'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Check,
  AlertCircle,
  Lock,
  Building2,
  Smartphone,
  Globe,
  Star,
  MoreVertical
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal' | 'crypto';
  isDefault: boolean;
  isVerified: boolean;
  lastUsed?: string;
  createdAt: string;
  // Card-specific fields
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4?: string;
  expMonth?: number;
  expYear?: number;
  cardholderName?: string;
  // Bank account-specific fields
  bankName?: string;
  accountType?: 'checking' | 'savings';
  routingNumber?: string;
  accountLast4?: string;
  accountHolderName?: string;
  // PayPal-specific fields
  paypalEmail?: string;
  // Crypto-specific fields
  cryptoType?: 'bitcoin' | 'ethereum' | 'usdc';
  walletAddress?: string;
}

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: Partial<PaymentMethod>) => void;
}

function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
  const [selectedType, setSelectedType] = useState<'card' | 'bank_account' | 'paypal' | 'crypto'>('card');
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newMethod: Partial<PaymentMethod> = {
        type: selectedType,
        isDefault: false,
        isVerified: selectedType === 'card', // Cards are verified immediately
        createdAt: new Date().toISOString(),
        ...formData
      };
      
      await onAdd(newMethod);
      onClose();
      setFormData({});
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add Payment Method</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Payment Method Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('card')}
                className={`p-3 border rounded-lg text-sm font-medium ${
                  selectedType === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="h-4 w-4 mx-auto mb-1" />
                Credit/Debit Card
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('bank_account')}
                className={`p-3 border rounded-lg text-sm font-medium ${
                  selectedType === 'bank_account'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building2 className="h-4 w-4 mx-auto mb-1" />
                Bank Account
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('paypal')}
                className={`p-3 border rounded-lg text-sm font-medium ${
                  selectedType === 'paypal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-4 w-4 mx-auto mb-1" />
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('crypto')}
                className={`p-3 border rounded-lg text-sm font-medium ${
                  selectedType === 'crypto'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="h-4 w-4 mx-auto mb-1" />
                Cryptocurrency
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {selectedType === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardholderName || ''}
                    onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const last4 = value.slice(-4);
                      let brand = 'visa';
                      if (value.startsWith('4')) brand = 'visa';
                      else if (value.startsWith('5')) brand = 'mastercard';
                      else if (value.startsWith('3')) brand = 'amex';
                      
                      setFormData({
                        ...formData, 
                        cardNumber: value,
                        last4,
                        brand
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <select
                      required
                      value={formData.expMonth || ''}
                      onChange={(e) => setFormData({...formData, expMonth: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Month</option>
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year
                    </label>
                    <select
                      required
                      value={formData.expYear || ''}
                      onChange={(e) => setFormData({...formData, expYear: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Year</option>
                      {Array.from({length: 10}, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedType === 'bank_account' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountHolderName || ''}
                    onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Chase Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    required
                    value={formData.accountType || ''}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select account type</option>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.routingNumber || ''}
                    onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData, 
                        accountNumber: value,
                        accountLast4: value.slice(-4)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Account number"
                  />
                </div>
              </div>
            )}

            {selectedType === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.paypalEmail || ''}
                  onChange={(e) => setFormData({...formData, paypalEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {selectedType === 'crypto' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cryptocurrency Type
                  </label>
                  <select
                    required
                    value={formData.cryptoType || ''}
                    onChange={(e) => setFormData({...formData, cryptoType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select cryptocurrency</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="usdc">USD Coin (USDC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.walletAddress || ''}
                    onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter wallet address"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Payment Method'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      
      // Mock payment methods data
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          isDefault: true,
          isVerified: true,
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2027,
          cardholderName: 'John Doe',
          lastUsed: '2025-10-30T14:20:00Z',
          createdAt: '2025-09-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'bank_account',
          isDefault: false,
          isVerified: true,
          bankName: 'Chase Bank',
          accountType: 'checking',
          routingNumber: '123456789',
          accountLast4: '1234',
          accountHolderName: 'John Doe',
          createdAt: '2025-09-20T16:45:00Z'
        },
        {
          id: '3',
          type: 'paypal',
          isDefault: false,
          isVerified: false,
          paypalEmail: 'john@example.com',
          createdAt: '2025-10-01T09:15:00Z'
        }
      ];

      setPaymentMethods(mockMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (method: Partial<PaymentMethod>) => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      ...method
    } as PaymentMethod;
    
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      setActionLoading(methodId);
      
      // Update payment methods
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })));
      
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemovePaymentMethod = async (methodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }
    
    try {
      setActionLoading(methodId);
      
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      
    } catch (error) {
      console.error('Error removing payment method:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getPaymentMethodIcon = (type: string, brand?: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'bank_account':
        return <Building2 className="h-5 w-5 text-green-600" />;
      case 'paypal':
        return <Globe className="h-5 w-5 text-orange-600" />;
      case 'crypto':
        return <Smartphone className="h-5 w-5 text-purple-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.brand?.toUpperCase()} ****${method.last4}`;
      case 'bank_account':
        return `${method.bankName} ****${method.accountLast4}`;
      case 'paypal':
        return method.paypalEmail;
      case 'crypto':
        return `${method.cryptoType?.toUpperCase()} Wallet`;
      default:
        return 'Unknown';
    }
  };

  const getPaymentMethodSubtitle = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `Expires ${method.expMonth}/${method.expYear}`;
      case 'bank_account':
        return `${method.accountType?.charAt(0).toUpperCase()}${method.accountType?.slice(1)} Account`;
      case 'paypal':
        return 'PayPal Account';
      case 'crypto':
        return method.walletAddress?.slice(0, 10) + '...';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
              <p className="mt-2 text-gray-600">Manage your payment methods and preferences</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Secure Payment Processing</h3>
              <p className="text-sm text-blue-700 mt-1">
                All payment information is encrypted and securely processed. We never store your complete card details on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-6">
          {paymentMethods.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a payment method to receive payments and make transactions.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </button>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getPaymentMethodIcon(method.type, method.brand)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getPaymentMethodLabel(method)}
                        </h3>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </span>
                        )}
                        {method.isVerified ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{getPaymentMethodSubtitle(method)}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
                        <span>Added {new Date(method.createdAt).toLocaleDateString()}</span>
                        {method.lastUsed && (
                          <span>Last used {new Date(method.lastUsed).toLocaleDateString()}</span>
                        )}
                        <span className={`${method.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {method.isVerified ? 'Verified' : 'Pending verification'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={actionLoading === method.id}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      disabled={actionLoading === method.id || method.isDefault}
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
                      title={method.isDefault ? "Can't remove default payment method" : "Remove payment method"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {!method.isVerified && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        This payment method needs verification before it can be used.
                      </span>
                      <button className="ml-auto text-sm font-medium text-yellow-600 hover:text-yellow-700">
                        Verify Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Payment Method Modal */}
        <AddPaymentMethodModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPaymentMethod}
        />
      </div>
    </div>
  );
}