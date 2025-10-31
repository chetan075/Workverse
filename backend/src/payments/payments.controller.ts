import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  Req,
  RawBodyRequest,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create/:invoiceId')
  async create(@Param('invoiceId') invoiceId: string) {
    return this.payments.createPaymentIntent(invoiceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':invoiceId/release')
  async release(@Param('invoiceId') invoiceId: string) {
    return this.payments.releaseEscrow(invoiceId);
  }

  // Test helper: simulate marking invoice as paid without hitting Stripe
  @UseGuards(JwtAuthGuard)
  @Post(':invoiceId/simulate-paid')
  async simulatePaid(@Param('invoiceId') invoiceId: string) {
    return this.payments.simulateMarkPaid(invoiceId);
  }

  // Stripe webhook endpoint
  @Post('/webhooks/stripe')
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') sig: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new Stripe(process.env.STRIPE_SECRET ?? '', {
      apiVersion: '2022-11-15' as unknown as '2025-10-29.clover',
    });
    let event: Stripe.Event;
    const payload =
      req['rawBody'] && req['rawBody'].length
        ? req['rawBody']
        : JSON.stringify(req.body);

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      } else {
        // No webhook secret configured — accept the payload as-is
        event = req.body as Stripe.Event;
      }
    } catch (err) {
      // ignore and return
      return { received: false };
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.payments.handlePaymentIntentSucceeded(intent.id);
    }

    return { received: true };
  }
}
