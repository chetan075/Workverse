'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { 
  Home, 
  Search, 
  Briefcase, 
  Users, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  Settings, 
  Star, 
  Upload, 
  Shield,
  Network,
  Bell,
  FolderOpen,
  GitBranch,
  CloudUpload,
  ChevronDown,
  Menu,
  X,
  LogOut,
  UserCircle
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and analytics'
  },
  {
    label: 'Search & Discovery',
    href: '/search',
    icon: Search,
    description: 'Find opportunities and talent'
  },
  {
    label: 'Opportunities',
    href: '/opportunities',
    icon: Briefcase,
    description: 'Browse and apply for work'
  },
  {
    label: 'Services',
    href: '/services',
    icon: Users,
    description: 'Freelancer services marketplace'
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderOpen,
    description: 'Project management',
    children: [
      { label: 'My Projects', href: '/projects', icon: FolderOpen },
      { label: 'Project Messages', href: '/project-messages', icon: MessageSquare },
    ]
  },
  {
    label: 'Communication',
    href: '/chat',
    icon: MessageSquare,
    description: 'Real-time messaging',
    children: [
      { label: 'Chat', href: '/chat', icon: MessageSquare },
      { label: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    label: 'Files & Storage',
    href: '/files',
    icon: FileText,
    description: 'File management',
    children: [
      { label: 'File Manager', href: '/files', icon: FileText },
      { label: 'Upload Files', href: '/upload', icon: Upload },
      { label: 'Cloud Storage', href: '/files/cloud', icon: CloudUpload },
      { label: 'File Versions', href: '/files/versions', icon: GitBranch },
    ]
  },
  {
    label: 'Financial',
    href: '/invoices',
    icon: DollarSign,
    description: 'Invoices and payments',
    children: [
      { label: 'Invoices', href: '/invoices', icon: FileText },
      { label: 'Payments', href: '/payments', icon: DollarSign },
    ]
  },
  {
    label: 'Reputation & Trust',
    href: '/reputation',
    icon: Star,
    description: 'Reviews and reputation',
    children: [
      { label: 'Reputation', href: '/reputation', icon: Star },
      { label: 'Reviews', href: '/reviews', icon: MessageSquare },
      { label: 'Trust Badges', href: '/trust-badges', icon: Shield },
      { label: 'Disputes', href: '/disputes', icon: Shield },
    ]
  },
  {
    label: 'Networking',
    href: '/networking',
    icon: Network,
    description: 'Professional connections'
  },
  {
    label: 'Blockchain',
    href: '/blockchain',
    icon: GitBranch,
    description: 'Crypto and smart contracts'
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const NavLink = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.includes(item.label);

    return (
      <div className={`${isChild ? 'ml-6' : ''}`}>
        <div className="flex items-center group">
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-1 relative overflow-hidden ${
              active
                ? 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:shadow-md'
            } ${isChild ? 'text-sm py-2 px-3 rounded-lg' : ''} ${
              !isChild ? 'border border-transparent hover:border-gray-700/50' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            {/* Active indicator */}
            {active && !isChild && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
            )}
            
            <item.icon className={`${isChild ? 'h-4 w-4' : 'h-5 w-5'} ${
              active ? 'text-white' : 'text-gray-400 group-hover:text-sky-400'
            } transition-colors duration-200`} />
            
            <div className="flex-1">
              <div className={`font-medium transition-colors duration-200 ${
                active ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {item.label}
              </div>
              {item.description && !isChild && (
                <div className={`text-xs transition-colors duration-200 ${
                  active ? 'text-sky-100' : 'text-gray-500 group-hover:text-gray-400'
                }`}>
                  {item.description}
                </div>
              )}
            </div>
            
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </Link>
          
          {hasChildren && !isChild && (
            <button
              onClick={() => toggleDropdown(item.label)}
              className={`p-2 ml-2 rounded-lg transition-all duration-200 ${
                isDropdownOpen 
                  ? 'text-sky-400 bg-sky-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              aria-label={`Toggle ${item.label} submenu`}
              title={`Toggle ${item.label} submenu`}
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          )}
        </div>

        {hasChildren && isDropdownOpen && (
          <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children?.map((child) => (
              <NavLink key={child.href} item={child} isChild={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-gray-800/90 backdrop-blur-md text-white border border-gray-700/50 shadow-lg hover:bg-gray-700/90 transition-all duration-200 hover:scale-105"
        aria-label="Toggle navigation menu"
        title="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 shadow-2xl z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800/50">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 via-emerald-400 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-sky-500/25 transition-all duration-300 group-hover:scale-105">
                W
              </div>
              <div>
                <div className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors duration-200">Workverse</div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Freelance Platform</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items - Hidden Scrollbar */}
          <div className="flex-1 px-6 py-4 overflow-hidden">
            <div className="space-y-1 overflow-y-auto h-full pr-4 -mr-4 scroll-smooth scrollbar-hide">
              {navigationItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* User Profile Section - Fixed at bottom */}
          <div className="mt-auto border-t border-gray-800/50 bg-gray-950/50 backdrop-blur-sm">
            <div className="p-6">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group border border-transparent hover:border-gray-700/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-purple-500/25 transition-all duration-200 group-hover:scale-105">
                      {getInitials(user.name, user.email)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-purple-300 transition-colors duration-200">{user.name || user.email}</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 capitalize">{user.role?.toLowerCase()}</div>
                    </div>
                    <UserCircle className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-600/10 text-red-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-600/20 group"
                  >
                    <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 p-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl transition-all duration-200 hover:bg-gray-800/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}