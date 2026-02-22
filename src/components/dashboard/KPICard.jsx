import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, type = 'neutral', trend, alert }) {
  const textColors = {
    income: 'text-emerald-400',
    expense: 'text-rose-400',
    balance: 'text-blue-400',
    neutral: 'text-slate-300',
  };

  const numeric = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  const isNegativeBalance = type === 'balance' && Number.isFinite(numeric) && numeric < 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className={`text-2xl font-bold ${isNegativeBalance ? 'text-rose-400' : textColors[type]}`}>
            {value}
          </p>
          {typeof trend === 'number' && (
            <div className="flex items-center gap-1 text-xs">
              {trend > 0 ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : <TrendingDown className="h-3 w-3 text-rose-400" />}
              <span className={trend > 0 ? 'text-emerald-400' : 'text-rose-400'}>{Math.abs(trend)}% vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`rounded-xl bg-slate-800 p-3 ${textColors[type]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {alert && isNegativeBalance && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertTriangle className="h-3 w-3" />
          <span>Saldo negativo!</span>
        </div>
      )}
    </div>
  );
}
