'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  Loader2,
  CalendarCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: '/' },
      { label: 'Inventory', href: '/inventory' },
      { label: 'Purchases', href: '/purchases' },
      { label: 'AI Agent', href: '/ai-agent' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { label: 'Sales workspace', href: '/sales' },
      { label: 'Customers', href: '/customers' },
      { label: 'Invoices', href: '/billing/invoices' },
      { label: 'Reports', href: '/reports' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Settings', href: '/settings' },
      { label: 'Inventory alerts', href: '/inventory/alerts' },
      { label: 'Contact sales', href: '/customers/new' },
      { label: 'Release notes', href: '/reports' },
    ],
  },
];

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
];

type NewsletterStatus = 'idle' | 'loading' | 'success';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === 'loading') {
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1200);
  };

  return (
    <div className="mt-10">
      <div className="wave-divider" aria-hidden="true" />

      <footer className="border-t border-white/10 bg-slate-950 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:gap-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-blue-100">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                Trusted platform
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                FootwearMS keeps your supply chain sharp and connected.
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Modern tooling for teams that need instant visibility across sales, inventory, and
                fulfillment. Built for motion, designed for retail.
              </p>

              <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <span>Backed up daily with enterprise-grade security</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-slate-300">
                <CalendarCheck className="h-5 w-5 text-sky-300" />
                <span>99.9% uptime · 24/7 monitoring</span>
              </div>

              <div className="mt-6 flex gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <p className="text-sm font-semibold tracking-wide text-slate-200">
                  {section.title}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition hover:text-white hover:underline hover:underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-200">
                Stay in the loop
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Product changelog, design notes, and invitations—straight to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your work email"
                    className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400',
                    status === 'loading' && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
                <p
                  role="status"
                  className={cn(
                    'text-center text-xs text-emerald-300 transition',
                    status === 'success' ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  You&apos;re subscribed! Check your inbox shortly.
                </p>
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FootwearMS. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              {['Privacy', 'Terms', 'Security', 'Status'].map((item) => (
                <Link key={item} href="#" className="hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
