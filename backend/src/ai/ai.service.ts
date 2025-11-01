import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/Prisma.service';
import { fetch } from 'undici';

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);
  constructor(private prisma: PrismaService) {}

  async validateInvoice(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!invoice) throw new Error('Invoice not found');

    // Basic heuristic anomalies before calling the model
    const anomalies: string[] = [];
    const inv: any = invoice as any;
    if (!inv.amount || Number(inv.amount) <= 0)
      anomalies.push('amount_missing_or_nonpositive');
    if (!inv.dueDate) anomalies.push('due_date_missing');
    if (!inv.currency) anomalies.push('currency_missing');

    const apiKey = process.env.GEMINI_API_KEY;
    const url =
      process.env.GEMINI_API_URL ||
      process.env.AI_API_URL ||
      'https://api.openai.com/v1/chat/completions';
    if (!apiKey) {
      this.logger.warn(
        'No GEMINI_API_KEY set; returning heuristic-only result',
      );
      return {
        ok: true,
        source: 'heuristic',
        invoiceId,
        anomalies,
        summary: `Invoice ${invoice.id} checked with simple heuristics. Found ${anomalies.length} anomalies.`,
      };
    }

    // Construct a prompt asking the model to parse and validate the invoice
    const prompt = `You are an invoice validation assistant. Given the following invoice JSON, detect anomalies, extract a short human-friendly summary, and return a JSON object with keys: summary (string), anomalies (array of strings), fields (extracted structured fields).\n\nINVOICE:\n${JSON.stringify(inv, null, 2)}\n\nRespond with JSON only.`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GEMINI_MODEL ?? 'gpt-4o-mini',
          prompt,
          max_tokens: 800,
        }),
      });

      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // Some APIs return a richer envelope; try to extract candidate text
        parsed = { raw: text };
      }

      return {
        ok: true,
        source: 'model',
        invoiceId,
        anomalies: [...anomalies],
        modelResponse: parsed,
      };
    } catch (err) {
      this.logger.error('AI call failed', err as any);
      return {
        ok: false,
        error: (err as Error).message,
        invoiceId,
        anomalies,
      };
    }
  }
}
