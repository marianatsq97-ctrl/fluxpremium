import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Insights() {
  const [analysis, setAnalysis] = useState('');
  const { data: transactions = [], isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: () => base44.entities.Transaction.list('-date', 1000) });
  const summary = useMemo(() => {
    let income = 0; let expense = 0;
    transactions.filter((t) => t.include_in_calc).forEach((t) => { if (t.type === 'receita') income += t.amount || 0; else expense += t.amount || 0; });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const run = async () => {
    const prompt = `Analise receitas ${summary.income} despesas ${summary.expense} saldo ${summary.balance} e dê dicas práticas.`;
    const out = await base44.integrations.Core.InvokeLLM({ prompt, add_context_from_internet: false });
    setAnalysis(String(out || 'Sem resposta'));
  };

  if (isLoading) return <div className="p-6 text-slate-300">Carregando insights...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar insights.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Insights & Análise</h1>
      <Card className="p-4"><p className="text-slate-300">Receitas: {summary.income.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} • Despesas: {summary.expense.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><Button onClick={run} className="mt-3">Gerar análise com IA</Button></Card>
      {analysis && <Card className="p-4 whitespace-pre-wrap text-slate-200">{analysis}</Card>}
    </div>
  );
}
