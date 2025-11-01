"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultTitle: string;
  lineItems: {
    description: string;
    quantity: number;
    rate: number;
  }[];
  terms?: string;
  notes?: string;
}

const defaultTemplates: InvoiceTemplate[] = [
  {
    id: 'hourly-dev',
    name: 'Hourly Development Work',
    description: 'Standard template for hourly development projects',
    category: 'Development',
    defaultTitle: 'Development Services Invoice',
    lineItems: [
      { description: 'Frontend Development', quantity: 20, rate: 75 },
      { description: 'Backend Development', quantity: 15, rate: 80 },
      { description: 'Testing & Debugging', quantity: 5, rate: 70 }
    ],
    terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly service charge.',
    notes: 'Thank you for your business!'
  },
  {
    id: 'fixed-web',
    name: 'Fixed Price Website',
    description: 'Complete website development package',
    category: 'Web Development',
    defaultTitle: 'Website Development Project',
    lineItems: [
      { description: 'Website Design & Development', quantity: 1, rate: 5000 },
      { description: 'Content Management System', quantity: 1, rate: 1500 },
      { description: 'Responsive Design', quantity: 1, rate: 1000 }
    ],
    terms: '50% due upfront, 50% due upon completion. Includes 30 days of post-launch support.',
    notes: 'Includes hosting setup and domain configuration.'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    description: 'iOS/Android mobile application development',
    category: 'Mobile Development',
    defaultTitle: 'Mobile Application Development',
    lineItems: [
      { description: 'UI/UX Design', quantity: 1, rate: 2000 },
      { description: 'iOS Development', quantity: 1, rate: 4000 },
      { description: 'Android Development', quantity: 1, rate: 4000 },
      { description: 'Backend Integration', quantity: 1, rate: 1500 }
    ],
    terms: 'Payment in 3 installments: 40% upfront, 40% at beta, 20% at launch.',
    notes: 'Includes app store submission and first month of maintenance.'
  },
  {
    id: 'consulting',
    name: 'Technical Consulting',
    description: 'Hourly consulting and advisory services',
    category: 'Consulting',
    defaultTitle: 'Technical Consulting Services',
    lineItems: [
      { description: 'Architecture Review', quantity: 8, rate: 150 },
      { description: 'Code Review', quantity: 6, rate: 120 },
      { description: 'Technical Documentation', quantity: 4, rate: 100 }
    ],
    terms: 'Payment due within 15 days. Minimum 2-hour billing increments.',
    notes: 'All recommendations provided in detailed written report.'
  },
  {
    id: 'design-package',
    name: 'Design Package',
    description: 'Complete design package for digital products',
    category: 'Design',
    defaultTitle: 'Design Services Package',
    lineItems: [
      { description: 'Brand Identity Design', quantity: 1, rate: 1200 },
      { description: 'Website Mockups', quantity: 5, rate: 300 },
      { description: 'Logo Design & Variations', quantity: 1, rate: 800 }
    ],
    terms: 'Payment due within 30 days. Includes 2 rounds of revisions.',
    notes: 'All source files and brand guidelines included.'
  },
  {
    id: 'maintenance',
    name: 'Monthly Maintenance',
    description: 'Ongoing website/app maintenance services',
    category: 'Maintenance',
    defaultTitle: 'Monthly Maintenance Services',
    lineItems: [
      { description: 'Website Maintenance & Updates', quantity: 1, rate: 500 },
      { description: 'Security Monitoring', quantity: 1, rate: 200 },
      { description: 'Performance Optimization', quantity: 1, rate: 300 }
    ],
    terms: 'Monthly recurring payment. Cancel anytime with 30 days notice.',
    notes: 'Includes monthly performance reports and security updates.'
  }
];

export default function InvoiceTemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(defaultTemplates.map(t => t.category)))];

  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const useTemplate = (template: InvoiceTemplate) => {
    // Store template data in localStorage to prefill the create form
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/invoices/create?template=true');
  };

  const calculateTemplateTotal = (template: InvoiceTemplate) => {
    return template.lineItems.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div>
                <h1 className="text-3xl font-bold text-white">Invoice Templates</h1>
                <p className="text-slate-400 mt-1">Choose from pre-built templates to create invoices quickly</p>
              </div>
            </div>
            
            <Link
              href="/invoices/create"
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Blank Invoice
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field min-w-[180px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-slate-300 mb-2">Search Templates</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 min-w-[300px]"
                  placeholder="Search templates..."
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="panel text-center py-12">
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No templates found</h3>
            <p className="text-slate-400">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="panel hover:border-emerald-500/30 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{template.description}</p>
                    <span className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                      {template.category}
                    </span>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-3 text-sm">{template.defaultTitle}</h4>
                  
                  <div className="space-y-2">
                    {template.lineItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-slate-300 truncate mr-2">{item.description}</span>
                        <span className="text-slate-400 whitespace-nowrap">
                          {item.quantity} × ${item.rate} = ${item.quantity * item.rate}
                        </span>
                      </div>
                    ))}
                    {template.lineItems.length > 3 && (
                      <div className="text-xs text-slate-400 italic">
                        +{template.lineItems.length - 3} more items
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-600/20 mt-3 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total</span>
                      <span className="text-emerald-400 font-medium">
                        ${calculateTemplateTotal(template).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Template Details */}
                <div className="space-y-3 mb-4">
                  {template.terms && (
                    <div>
                      <h5 className="text-xs font-medium text-slate-400 mb-1">Payment Terms</h5>
                      <p className="text-xs text-slate-300 line-clamp-2">{template.terms}</p>
                    </div>
                  )}
                  
                  {template.notes && (
                    <div>
                      <h5 className="text-xs font-medium text-slate-400 mb-1">Notes</h5>
                      <p className="text-xs text-slate-300 line-clamp-2">{template.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => useTemplate(template)}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-sm"
                  >
                    Use Template
                  </button>
                  <button
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    title="Preview Template"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Custom Template CTA */}
        <div className="panel mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Need a Custom Template?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your own invoice template with custom line items, terms, and branding for your specific business needs.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/invoices/create"
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Create Custom Template
              </Link>
              <button className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}