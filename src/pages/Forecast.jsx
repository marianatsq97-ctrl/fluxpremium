import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Forecast() {
  const [horizon, setHorizon] = useState(12);
  const { data: transactions = [], isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: () => base44.entities.Transaction.list('-date', 2000) });

  const rows = useMemo(() => {
    const start = new Date();
    return Array.from({ length: horizon }).map((_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      let receitas = 0; let despesas = 0;
      transactions.forEach((t) => {
        if (!t.include_in_calc) return;
        if (t.recurrence === 'conta_fixa_mensal') {
          if (t.type === 'receita') receitas += t.amount || 0; else despesas += t.amount || 0;
        } else if ((t.recurrence === 'compra_parcelada' || t.installments > 1) && t.date?.startsWith(key)) {
          if (t.type === 'receita') receitas += t.amount || 0; else despesas += t.amount || 0;
        }
      });
      return { key, receitas, despesas, saldo: receitas - despesas };
    });
  }, [transactions, horizon]);

  if (isLoading) return <div className="p-6 text-slate-300">Carregando previsão...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar previsão.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between"><h1 className="text-2xl font-bold text-white">Previsão Futura</h1><div><Input type="number" min="1" max="24" value={horizon} onChange={(e) => setHorizon(Number(e.target.value || 12))} /></div></div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="border-b border-slate-700"><th className="p-2 text-left">Mês</th><th className="p-2 text-right">Receitas</th><th className="p-2 text-right">Despesas</th><th className="p-2 text-right">Saldo</th></tr></thead><tbody>{rows.map((r) => <tr key={r.key} className="border-b border-slate-800"><td className="p-2">{r.key}</td><td className="p-2 text-right">{r.receitas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td className="p-2 text-right">{r.despesas.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td className="p-2 text-right">{r.saldo.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr>)}</tbody></table>
      </Card>
    </div>
  );
}
