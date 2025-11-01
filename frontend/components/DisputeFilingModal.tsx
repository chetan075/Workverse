'use client';

import { useState } from 'react';
import { X, AlertTriangle, FileText, Upload, DollarSign } from 'lucide-react';
import { openDispute } from '@/lib/api';

interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: string;
  clientId?: string;
  freelancerId?: string;
}

interface DisputeFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onDisputeFiled: () => void;
}

const disputeCategories = [
  { id: 'quality', label: 'Work Quality Issues', description: 'Work delivered does not meet specifications' },
  { id: 'communication', label: 'Communication Problems', description: 'Poor or no communication from the other party' },
  { id: 'payment', label: 'Payment Issues', description: 'Payment delays or non-payment' },
  { id: 'scope', label: 'Scope Creep', description: 'Work exceeds original project scope' },
  { id: 'deadline', label: 'Missed Deadlines', description: 'Project deadlines were not met' },
  { id: 'other', label: 'Other', description: 'Other dispute not covered above' },
];

export default function DisputeFilingModal({ isOpen, onClose, invoices, onDisputeFiled }: DisputeFilingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    invoiceId: '',
    category: '',
    reason: '',
    description: '',
    evidence: null as File | null,
    expectedOutcome: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      setLoading(true);
      await openDispute(
        formData.invoiceId,
        'current-user-id', // This would come from auth context
        `${formData.category}: ${formData.reason}\n\nDetails: ${formData.description}\n\nExpected Outcome: ${formData.expectedOutcome}`
      );
      onDisputeFiled();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error filing dispute:', error);
      alert('Error filing dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      invoiceId: '',
      category: '',
      reason: '',
      description: '',
      evidence: null,
      expectedOutcome: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isOpen) return null;

  const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">File a Dispute</h2>
              <p className="text-gray-600 text-sm">Step {step} of 3</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Close modal"
            aria-label="Close dispute filing modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Select Invoice</span>
            <span>Dispute Details</span>
            <span>Review & Submit</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Select Invoice */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Invoice to Dispute</h3>
              <p className="text-gray-600 mb-6">Choose the invoice related to your dispute</p>
              
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <label key={invoice.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="invoiceId"
                      value={invoice.id}
                      checked={formData.invoiceId === invoice.id}
                      onChange={(e) => setFormData({...formData, invoiceId: e.target.value})}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{invoice.title}</h4>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Status: {invoice.status}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              {invoices.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No invoices available for disputes</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Dispute Details */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Dispute Details</h3>
              
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dispute Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {disputeCategories.map((category) => (
                      <label key={category.id} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="mt-1 mr-3"
                          required
                        />
                        <div>
                          <div className="font-medium text-sm">{category.label}</div>
                          <div className="text-xs text-gray-600">{category.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brief Reason *
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Summarize your dispute in one sentence"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.reason.length}/200 characters</p>
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide a detailed explanation of the dispute, including relevant dates, communications, and specific issues..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Evidence Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload screenshots, emails, or other supporting documents
                    </p>
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      className="text-sm"
                      title="Upload evidence file"
                      aria-label="Upload evidence file for dispute"
                    />
                    {formData.evidence && (
                      <p className="text-xs text-green-600 mt-2">
                        File selected: {formData.evidence.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Outcome *
                  </label>
                  <textarea
                    value={formData.expectedOutcome}
                    onChange={(e) => setFormData({...formData, expectedOutcome: e.target.value})}
                    placeholder="What outcome are you seeking from this dispute? (e.g., refund, project completion, payment, etc.)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
              <p className="text-gray-600 mb-6">Please review your dispute details before submitting</p>
              
              <div className="space-y-6">
                {/* Invoice Summary */}
                {selectedInvoice && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Invoice Details</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Title:</span> {selectedInvoice.title}</p>
                      <p><span className="font-medium">Amount:</span> {formatCurrency(selectedInvoice.amount)}</p>
                      <p><span className="font-medium">Status:</span> {selectedInvoice.status}</p>
                    </div>
                  </div>
                )}

                {/* Dispute Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Dispute Summary</h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Category:</span> {
                      disputeCategories.find(cat => cat.id === formData.category)?.label
                    }</p>
                    <p><span className="font-medium">Reason:</span> {formData.reason}</p>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-gray-700">{formData.description}</p>
                    </div>
                    <div>
                      <span className="font-medium">Expected Outcome:</span>
                      <p className="mt-1 text-gray-700">{formData.expectedOutcome}</p>
                    </div>
                    {formData.evidence && (
                      <p><span className="font-medium">Evidence:</span> {formData.evidence.name}</p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Important Notice</p>
                      <p className="text-yellow-700">
                        By submitting this dispute, you acknowledge that:
                      </p>
                      <ul className="list-disc list-inside text-yellow-700 mt-2 space-y-1">
                        <li>The information provided is accurate and truthful</li>
                        <li>This dispute will be reviewed by community members</li>
                        <li>False or malicious disputes may result in account penalties</li>
                        <li>You agree to participate in good faith resolution efforts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading || (step === 1 && !formData.invoiceId)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : step === 3 ? 'Submit Dispute' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}