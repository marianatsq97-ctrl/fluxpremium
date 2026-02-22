import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import MonthProfileFilter from '@/components/dashboard/MonthProfileFilter';

export default function Charts() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedProfile, setSelectedProfile] = useState('casal');

  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: () => base44.entities.Transaction.list('-date', 2000) });

  const byCategory = useMemo(() => {
    const start = `${selectedYear}-${selectedMonth}-01`;
    const end = `${selectedYear}-${selectedMonth}-31`;
    const filtered = transactions.filter((t) => t.include_in_calc && t.date >= start && t.date <= end && (selectedProfile === 'familia' || selectedProfile === 'casal' ? true : t.profile === selectedProfile));
    const map = {};
    filtered.forEach((t) => {
      if (t.type === 'despesa' || t.type === 'investimento') map[t.category || 'Outros'] = (map[t.category || 'Outros'] || 0) + (t.amount || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions, selectedMonth, selectedYear, selectedProfile]);

  if (isLoading) return <div className="p-6 text-slate-300">Carregando gráficos...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gráficos & Análises</h1>
        <MonthProfileFilter selectedMonth={selectedMonth} selectedYear={selectedYear} selectedProfile={selectedProfile} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear} onProfileChange={setSelectedProfile} />
      </div>
      <Card className="p-4">
        <p className="mb-2 text-slate-300">Resumo por categoria</p>
        <ul className="space-y-2">
          {byCategory.map(([name, value]) => (
            <li key={name} className="flex items-center justify-between rounded border border-slate-700 p-2 text-white">
              <span>{name}</span>
              <span>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </li>
          ))}
          {byCategory.length === 0 && <li className="text-slate-400">Sem dados no período.</li>}
        </ul>
      </Card>
    </div>
  );
}
