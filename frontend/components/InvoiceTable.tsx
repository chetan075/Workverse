"use client";
import { useAuth } from './AuthProvider';

type Invoice = { id: string; title: string; amount: number; status: string; };

export default function InvoiceTable({ invoices, onPay, onEscrow }: { invoices: Invoice[]; onPay?: (inv:Invoice)=>void; onEscrow?: (inv:Invoice)=>void }){
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-transparent">
        <thead>
          <tr className="text-left text-sm text-slate-400 border-b border-white/5">
            <th className="pb-3 uppercase tracking-wide text-xs">Title</th>
            <th className="pb-3 uppercase tracking-wide text-xs">Amount</th>
            <th className="pb-3 uppercase tracking-wide text-xs">Status</th>
            <th className="pb-3 uppercase tracking-wide text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
              <td className="py-4">{inv.title}</td>
              <td className="py-4">${inv.amount.toFixed(2)}</td>
              <td className="py-4">
                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'PAID' ? 'bg-emerald-900 text-emerald-300' : inv.status === 'SENT' ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {user?.role === 'CLIENT' && inv.status === 'SENT' && (
                    <button onClick={() => onPay?.(inv)} className="text-sm px-3 py-1 rounded-md bg-emerald-400 text-black font-semibold">Pay</button>
                  )}
                  {user?.role === 'FREELANCER' && inv.status === 'PAID' && (
                    <button onClick={() => onEscrow?.(inv)} className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white">Release</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
