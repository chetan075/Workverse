"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: November 1, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Profile information (skills, experience, portfolio)</li>
                <li>Project and communication data</li>
                <li>Payment and billing information</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process transactions and payments</li>
                <li>Facilitate communication between users</li>
                <li>Improve our platform and user experience</li>
                <li>Send important updates and notifications</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>With other users as necessary for platform functionality</li>
                <li>With service providers who assist in platform operations</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Blockchain and Decentralization</h2>
              <p>
                As a blockchain-based platform, certain information (such as transaction records and reputation scores)
                may be stored on public blockchains. This information is pseudonymous but may be permanently accessible.
                We use privacy-preserving technologies where possible to protect your identity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable,
                and we cannot guarantee the security of our systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and fulfill our legal obligations.
                You may request deletion of your account and associated data, subject to certain limitations due to
                blockchain immutability and legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to improve user experience, analyze usage patterns, and maintain
                session information. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the updated policy on our platform and updating the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                Email: privacy@workverse.com
                <br />
                Address: 123 Blockchain Ave, Crypto City, CC 12345
              </p>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/terms"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}