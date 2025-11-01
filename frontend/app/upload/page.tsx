"use client";
import React, { useState } from 'react';
import { uploadStorage } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceId, setInvoiceId] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
  if (!file) return alert('choose file');
  const buf = await file.arrayBuffer();
  // browser-friendly ArrayBuffer -> base64
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
    try {
      await uploadStorage(invoiceId, file.name, b64);
      alert('uploaded');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('upload failed');
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-md">
        <h2 className="text-2xl mb-2 font-semibold">Upload File for Invoice</h2>
        <p className="text-sm text-slate-400 mb-4">Attach supporting files (receipts, contracts) to an invoice</p>
        <div className="panel">
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input value={invoiceId} onChange={(e)=>setInvoiceId(e.target.value)} placeholder="Invoice ID" className="bg-slate-800 border border-white/6 text-white p-2 rounded" />
            <label className="flex flex-col text-sm text-slate-300">
              <span className="mb-2">Choose file</span>
              <input type="file" onChange={(e)=>setFile(e.target.files?.[0]??null)} className="text-sm" />
            </label>
            <div className="flex justify-end">
              <button className="mt-2 rounded-md bg-emerald-400 text-black px-4 py-2">Upload</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
