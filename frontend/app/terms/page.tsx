"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last updated: November 1, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Workverse, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Platform Overview</h2>
              <p>
                Workverse is a decentralized freelance platform that connects clients with freelancers using blockchain technology
                for secure payments and reputation management. Our platform facilitates:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Project listings and applications</li>
                <li>Secure escrow payments via blockchain</li>
                <li>File sharing and collaboration tools</li>
                <li>Reputation and review systems</li>
                <li>Communication and project management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p>Users agree to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of their account credentials</li>
                <li>Use the platform in accordance with applicable laws</li>
                <li>Respect intellectual property rights</li>
                <li>Communicate professionally and respectfully</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
              <p>
                All payments are processed through our secure blockchain-based escrow system. Platform fees apply to completed
                transactions. Users are responsible for understanding and complying with tax obligations in their jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                Users retain ownership of their original content and work product. By using Workverse, users grant us a license
                to display and distribute their content solely for the purpose of operating the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Dispute Resolution</h2>
              <p>
                Our platform includes built-in dispute resolution mechanisms. For disputes that cannot be resolved through
                our automated systems, we provide mediation services and, if necessary, arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                Workverse is provided "as is" without warranties of any kind. We shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes,
                and continued use of the platform constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@workverse.com
                <br />
                Address: 123 Blockchain Ave, Crypto City, CC 12345
              </p>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Privacy Policy
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