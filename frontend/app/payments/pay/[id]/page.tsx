'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Shield,
  Info
} from 'lucide-react';
import { createPaymentIntent, simulatePayment, fetchInvoice } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Invoice {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: string;
  freelancer?: { name: string; email: string };
  client?: { name: string; email: string };
  description?: string;
}

function PaymentForm({ invoice, onSuccess, onError }: {
  invoice: Invoice;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [useTestPayment, setUseTestPayment] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      if (useTestPayment) {
        // Use the test payment simulation
        await simulatePayment(invoice.id);
        onSuccess();
        return;
      }

      // Create payment intent
      const { client_secret } = await createPaymentIntent(invoice.id);

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: invoice.client?.name || 'Anonymous',
            email: invoice.client?.email,
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Test Payment Toggle */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-yellow-600 mr-2" />
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useTestPayment}
              onChange={(e) => setUseTestPayment(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-yellow-800">
              Use test payment (simulates successful payment without Stripe)
            </span>
          </label>
        </div>
      </div>

      {!useTestPayment && (
        <>
          {/* Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="h-4 w-4 mr-2" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: invoice.currency || 'USD',
            }).format(invoice.amount)}
          </>
        )}
      </button>
    </form>
  );
}

export default function PayInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const invoiceData = await fetchInvoice(invoiceId);
      setInvoice(invoiceData);
    } catch (error) {
      console.error('Error loading invoice:', error);
      setPaymentStatus('error');
      setErrorMessage('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    // Refresh invoice data to show updated status
    setTimeout(() => {
      loadInvoice();
    }, 1000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    setErrorMessage(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Invoice Not Found</h2>
          <p className="mt-2 text-gray-600">The invoice you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/invoices')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">
            Your payment has been processed successfully. The funds are now held in escrow.
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push(`/invoices/${invoiceId}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              View Invoice
            </button>
            <button
              onClick={() => router.push('/payments')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Go to Payments
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
          <p className="mt-2 text-gray-600">{errorMessage}</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setErrorMessage('');
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/invoices')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Back to Invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if invoice is payable
  const isPayable = invoice.status === 'DRAFT' || invoice.status === 'SENT';

  if (!isPayable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <Clock className="h-16 w-16 text-yellow-600 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Invoice Not Payable</h2>
          <p className="mt-2 text-gray-600">
            This invoice has already been paid or is not in a payable state.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Current status: <span className="font-medium">{invoice.status}</span>
          </div>
          <button
            onClick={() => router.push(`/invoices/${invoiceId}`)}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View Invoice Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Pay Invoice</h1>
          <p className="mt-2 text-gray-600">Complete your payment securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Invoice Title</label>
                <p className="text-gray-900">{invoice.title}</p>
              </div>
              
              {invoice.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{invoice.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency || 'USD',
                  }).format(invoice.amount)}
                </p>
              </div>
              
              {invoice.freelancer && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Service Provider</label>
                  <p className="text-gray-900">{invoice.freelancer.name}</p>
                  <p className="text-sm text-gray-500">{invoice.freelancer.email}</p>
                </div>
              )}
              
              {invoice.dueDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Escrow Notice */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Escrow Protection</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment will be held securely in escrow until the work is completed and approved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            
            <Elements stripe={stripePromise}>
              <PaymentForm
                invoice={invoice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}