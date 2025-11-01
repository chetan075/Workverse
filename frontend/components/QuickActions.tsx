'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Upload, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Users,
  ChevronDown,
  Search,
  DollarSign
} from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Create Project',
    href: '/projects/create',
    icon: Briefcase,
    description: 'Start a new project',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    label: 'Upload Files',
    href: '/upload',
    icon: Upload,
    description: 'Upload documents',
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    label: 'Create Invoice',
    href: '/invoices/create',
    icon: FileText,
    description: 'Generate new invoice',
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    label: 'Find Talent',
    href: '/search?type=freelancer',
    icon: Users,
    description: 'Search freelancers',
    color: 'bg-orange-600 hover:bg-orange-700'
  },
  {
    label: 'Browse Jobs',
    href: '/opportunities',
    icon: Search,
    description: 'Find opportunities',
    color: 'bg-teal-600 hover:bg-teal-700'
  },
  {
    label: 'Send Message',
    href: '/chat',
    icon: MessageSquare,
    description: 'Start conversation',
    color: 'bg-pink-600 hover:bg-pink-700'
  }
];

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Quick Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Quick Actions</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={`p-3 rounded-lg ${action.color} transition-colors group`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <action.icon className="h-5 w-5 text-white" />
                      <span className="text-white font-medium text-sm">{action.label}</span>
                    </div>
                    <p className="text-xs text-white/80">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}