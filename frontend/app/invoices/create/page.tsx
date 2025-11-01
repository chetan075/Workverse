"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { createInvoice, fetchUserProfiles, fetchWorkOpportunities } from '../../../lib/api';

interface InvoiceForm {
  title: string;
  amount: number;
  dueDate: string;
  currency: string;
  clientId: string;
  freelancerId: string;
  description: string;
  lineItems: LineItem[];
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  title: string;
  budget: number;
  clientId: string;
  client: { name: string };
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [form, setForm] = useState<InvoiceForm>({
    title: '',
    amount: 0,
    dueDate: '',
    currency: 'USD',
    clientId: '',
    freelancerId: user?.id || '',
    description: '',
    lineItems: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  });

  useEffect(() => {
    loadInitialData();
    
    // Check if a template was selected
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('template') === 'true') {
      loadTemplateData();
    }
  }, []);

  const loadTemplateData = () => {
    try {
      const templateData = localStorage.getItem('selectedTemplate');
      if (templateData) {
        const template = JSON.parse(templateData);
        
        setForm(prev => ({
          ...prev,
          title: template.defaultTitle,
          description: template.notes || '',
          lineItems: template.lineItems.map((item: any, index: number) => ({
            id: (index + 1).toString(),
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate
          }))
        }));
        
        // Clear the template data
        localStorage.removeItem('selectedTemplate');
      }
    } catch (error) {
      console.error('Failed to load template data:', error);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [form.lineItems]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load clients (if freelancer) or freelancers (if client)
      const profiles = await fetchUserProfiles(user?.role === 'FREELANCER' ? 'CLIENT' : 'FREELANCER');
      setClients(profiles);

      // Load projects/opportunities
      const opportunities = await fetchWorkOpportunities();
      setProjects(opportunities);
      
      // Set default due date (30 days from now)
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setForm(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
      
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = form.lineItems.reduce((sum, item) => sum + item.amount, 0);
    setForm(prev => ({ ...prev, amount: total }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const addLineItem = () => {
    const newId = (form.lineItems.length + 1).toString();
    setForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, {
        id: newId,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }]
    }));
  };

  const removeLineItem = (id: string) => {
    if (form.lineItems.length > 1) {
      setForm(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }));
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setForm(prev => ({
      ...prev,
      title: `Invoice for ${project.title}`,
      clientId: project.clientId,
      description: `Invoice for project: ${project.title}`,
      lineItems: [{
        id: '1',
        description: project.title,
        quantity: 1,
        rate: project.budget,
        amount: project.budget
      }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const invoiceData = {
        title: form.title,
        amount: form.amount,
        dueDate: form.dueDate,
        currency: form.currency,
        clientId: form.clientId,
        freelancerId: form.freelancerId
      };

      await createInvoice(invoiceData);
      router.push('/invoices?created=true');
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/invoices"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Invoices
              </Link>
              <div className="h-6 w-px bg-slate-600"></div>
              <h1 className="text-2xl font-bold text-white">Create Invoice</h1>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/invoices/templates"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Use Template
              </Link>
              <button
                type="button"
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                onClick={() => router.push('/invoices')}
              >
                Cancel
              </button>
              <button
                form="invoice-form"
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 font-medium">Error</span>
                </div>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            )}

            <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Details */}
              <div className="panel">
                <h2 className="text-xl font-semibold text-white mb-6">Invoice Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Invoice Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter invoice title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Client *
                    </label>
                    <select
                      value={form.clientId}
                      onChange={(e) => setForm(prev => ({ ...prev, clientId: e.target.value }))}
                      className="input-field"
                      required
                    >
                      <option value="">Select client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
                      className="input-field"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Additional notes or description"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="panel">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Line Items</h2>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {form.lineItems.map((item, index) => (
                    <div key={item.id} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            className="input-field"
                            placeholder="Item description"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                            className="input-field"
                            min="1"
                            step="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Rate ({form.currency})
                          </label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                            className="input-field"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-slate-400">
                          Amount: <span className="text-emerald-400 font-medium">
                            {form.currency} {item.amount.toLocaleString()}
                          </span>
                        </div>
                        
                        {form.lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-slate-600/20 mt-6 pt-6">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-sm text-slate-400 mb-1">Total Amount</div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {form.currency} {form.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full text-left p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  onClick={() => {
                    const template = {
                      title: 'Hourly Work Invoice',
                      lineItems: [{
                        id: '1',
                        description: 'Development work',
                        quantity: 40,
                        rate: 75,
                        amount: 3000
                      }]
                    };
                    setForm(prev => ({ ...prev, ...template }));
                  }}
                >
                  <div className="text-white font-medium">Use Hourly Template</div>
                  <div className="text-sm text-slate-400">40 hours @ $75/hr</div>
                </button>

                <button
                  type="button"
                  className="w-full text-left p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  onClick={() => {
                    const template = {
                      title: 'Fixed Price Project',
                      lineItems: [{
                        id: '1',
                        description: 'Project delivery',
                        quantity: 1,
                        rate: 5000,
                        amount: 5000
                      }]
                    };
                    setForm(prev => ({ ...prev, ...template }));
                  }}
                >
                  <div className="text-white font-medium">Use Fixed Price Template</div>
                  <div className="text-sm text-slate-400">Single project delivery</div>
                </button>
              </div>
            </div>

            {/* Project Selection */}
            {projects.length > 0 && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Link to Project</h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {projects.map(project => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => selectProject(project)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedProject?.id === project.id
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="text-white font-medium truncate">{project.title}</div>
                      <div className="text-sm text-slate-400">
                        {project.client.name} • ${project.budget.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Preview */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{form.currency} {form.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Items</span>
                  <span className="text-white">{form.lineItems.length}</span>
                </div>
                
                <div className="border-t border-slate-600/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Due</span>
                    <span className="text-emerald-400 font-semibold">
                      {form.currency} {form.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}