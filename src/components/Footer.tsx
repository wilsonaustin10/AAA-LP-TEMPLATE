import React from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_URL || "{{logoUrl}}"}
                alt={process.env.NEXT_PUBLIC_COMPANY_NAME || "{{businessName}}"}
                width={120}
                height={40}
                className="mr-2"
              />
            </div>
            <p className="text-gray-300">
              We buy houses in any condition. Get your fair cash offer today.
            </p>
            <div className="space-y-2">
              <a 
                href="tel:{{publicPhone}}"
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{{publicPhone}}</span>
              </a>
              <a 
                href="mailto:{{publicEmail}}"
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{{publicEmail}}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-gray-300 hover:text-gray-100 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gray-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-300 hover:text-gray-100 transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Specializing In</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Pre-Foreclosure</li>
              <li className="text-gray-300">Divorce</li>
              <li className="text-gray-300">Storm Damage</li>
              <li className="text-gray-300">Tax Liens</li>
              <li className="text-gray-300">Bad Tenants</li>
              <li className="text-gray-300">Code Violations</li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Get Started</h3>
            <p className="text-gray-300 mb-4">
              Ready to sell your house? Get your cash offer today!
            </p>
            <Link
              href="/"
              className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Get Your Offer
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {{businessName}}. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-gray-100 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-100 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 
