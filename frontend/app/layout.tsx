import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '../components/AuthProvider';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickActions from '../components/QuickActions';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workverse - Freelance Platform",
  description: "Complete freelance marketplace with invoicing, payments, and project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1220] text-white`}>
        <AuthProvider>
          <div className="min-h-screen">
            <Navigation />
            
            {/* Main Content Area */}
            <div className="lg:ml-80">
              {/* Top Header */}
              <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Breadcrumbs />
                  </div>
                  <QuickActions />
                </div>
              </header>

              {/* Page Content */}
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
