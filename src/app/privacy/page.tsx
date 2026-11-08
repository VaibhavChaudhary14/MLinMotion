import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy & Data Ethics — ML in Motion',
  description:
    'Our strict privacy commitment: 100% in-browser computation, zero telemetry of user datasets, and cookieless analytics.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 font-mono">
      {/* Top Banner */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-6 sm:p-8 shadow-[3px_3px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1715] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#33634B] border border-[#1A1715]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1A1715]">
              ETHICAL COMPUTING // PRIVACY SPECIFICATION
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5C544B]">LAST AUDITED: NOVEMBER 2026</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1715]">
          Your Data Never Leaves Your Browser.
        </h1>
        <p className="text-xs sm:text-sm text-[#5C544B] leading-relaxed">
          At Machine Learning in Motion, we believe educational computing should respect student sovereignty. We do not require accounts, we do not log your experimental inputs, and we do not transmit your uploaded datasets to any remote server or AI provider.
        </p>
      </div>

      {/* Commitments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Commitment 1 */}
        <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
          <div className="flex items-center gap-2 text-[#33634B]">
            <ServerOff className="w-4 h-4" />
            <h3 className="font-black text-sm uppercase text-[#1A1715]">100% Client-Side Computation</h3>
          </div>
          <p className="text-[#5C544B] leading-relaxed">
            All algorithm executions—from Linear Regression OLS matrix calculations to K-Means Lloyd coordinate descent and PCA eigenvalue extraction—run in your browser via local JavaScript. There is zero server-side model inference or backend data pipeline.
          </p>
        </div>

        {/* Commitment 2 */}
        <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
          <div className="flex items-center gap-2 text-[#1848B8]">
            <Database className="w-4 h-4" />
            <h3 className="font-black text-sm uppercase text-[#1A1715]">Local Storage Only</h3>
          </div>
          <p className="text-[#5C544B] leading-relaxed">
            When you save notes, bookmark concept cards, or upload custom CSV datasets in the DataLab, your files and progress are written exclusively to your device's browser <code className="bg-[#E8E1D3] px-1 py-0.5 border border-[#1A1715]">localStorage</code>. They can be deleted at any time by clearing site data.
          </p>
        </div>

        {/* Commitment 3 */}
        <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
          <div className="flex items-center gap-2 text-[#E28C05]">
            <EyeOff className="w-4 h-4" />
            <h3 className="font-black text-sm uppercase text-[#1A1715]">Cookieless Anonymous Analytics</h3>
          </div>
          <p className="text-[#5C544B] leading-relaxed">
            We use privacy-friendly Vercel Web Analytics. It does not use tracking cookies, does not collect personal identifiers or IP addresses, and does not track you across other websites. It only tallies aggregate page views and device viewport statistics to ensure responsive rendering.
          </p>
        </div>

        {/* Commitment 4 */}
        <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
          <div className="flex items-center gap-2 text-[#C83226]">
            <Lock className="w-4 h-4" />
            <h3 className="font-black text-sm uppercase text-[#1A1715]">No Data Monetization or Ads</h3>
          </div>
          <p className="text-[#5C544B] leading-relaxed">
            ML in Motion has no advertisements, no tracking pixels (Meta, Google Tag Manager), and no data brokers. We will never sell, rent, or commercialize student data.
          </p>
        </div>
      </div>

      {/* Open Source Transparency */}
      <div className="bg-[#E8E1D3] border-[1.5px] border-[#1A1715] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-[#1A1715] block uppercase">Verify It Yourself</span>
          <span className="text-[#5C544B]">Our code is completely open-source and auditable on GitHub under the MIT License.</span>
        </div>
        <a
          href="https://github.com/VaibhavChaudhary14/MLinMotion"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-[#FAF7F0] text-[#1A1715] font-black border border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F4EFE4]"
        >
          VIEW SOURCE ON GITHUB
        </a>
      </div>

      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1848B8] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO WORKBENCH
        </Link>
      </div>
    </div>
  );
}
