import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import KPICard from '@/components/dashboard/KPICard';
import MonthProfileFilter from '@/components/dashboard/MonthProfileFilter';
import TopCategoryCard from '@/components/dashboard/TopCategoryCard';

export default function Dashboard() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedProfile, setSelectedProfile] = useState('casal');

  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: () => base44.entities.Transaction.list('-date', 1000) });

  const stats = useMemo(() => {
    const start = `${selectedYear}-${selectedMonth}-01`;
    const end = `${selectedYear}-${selectedMonth}-31`;
    const filtered = transactions.filter((t) => t.include_in_calc && t.date >= start && t.date <= end && (selectedProfile === 'familia' || selectedProfile === 'casal' ? true : t.profile === selectedProfile));
    let income = 0; let expense = 0;
    const cats = {};
    filtered.forEach((t) => {
      if (t.type === 'receita') income += t.amount || 0;
      else {
        expense += t.amount || 0;
        cats[t.category || 'Outros'] = (cats[t.category || 'Outros'] || 0) + (t.amount || 0);
      }
    });
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
    return { income, expense, balance: income - expense, topCategory: top?.[0], topAmount: top?.[1] || 0, topPct: expense ? ((top?.[1] || 0) / expense) * 100 : 0 };
  }, [transactions, selectedMonth, selectedYear, selectedProfile]);

  if (isLoading) return <div className="p-6 text-slate-300">Carregando dashboard...</div>;

  const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <MonthProfileFilter selectedMonth={selectedMonth} selectedYear={selectedYear} selectedProfile={selectedProfile} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear} onProfileChange={setSelectedProfile} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard title="Receitas" value={money(stats.income)} icon={TrendingUp} type="income" />
        <KPICard title="Despesas" value={money(stats.expense)} icon={TrendingDown} type="expense" />
        <KPICard title="Saldo" value={money(stats.balance)} icon={Wallet} type="balance" alert />
        <TopCategoryCard category={stats.topCategory} amount={stats.topAmount} percentage={stats.topPct} />
      </div>
    </div>
  );
}
