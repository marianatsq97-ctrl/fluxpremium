import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import MonthProfileFilter from '@/components/dashboard/MonthProfileFilter';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionForm from '@/components/transactions/TransactionForm';
import { toast } from '@/components/ui/use-toast';

export default function Transactions() {
  const qc = useQueryClient();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedProfile, setSelectedProfile] = useState('casal');
  const [filters, setFilters] = useState({ search: '', type: 'todos', profile: 'todos', category: 'todas', includeInCalc: 'todos' });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: transactions = [], isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: () => base44.entities.Transaction.list('-date', 1000) });
  const create = useMutation({ mutationFn: (d) => base44.entities.Transaction.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); setOpen(false); toast({ title: 'Lançamento criado' }); } });
  const update = useMutation({ mutationFn: ({ id, data }) => base44.entities.Transaction.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); setOpen(false); setEditing(null); toast({ title: 'Lançamento atualizado' }); } });
  const del = useMutation({ mutationFn: (id) => base44.entities.Transaction.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }) });
  const bulkDel = useMutation({ mutationFn: async (ids) => Promise.all(ids.map((id) => base44.entities.Transaction.delete(id))), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); setSelectedIds([]); } });

  const filtered = useMemo(() => {
    const start = `${selectedYear}-${selectedMonth}-01`;
    const end = `${selectedYear}-${selectedMonth}-31`;
    return transactions.filter((t) => {
      if (t.date < start || t.date > end) return false;
      if (selectedProfile === 'casal' && !['eu', 'conjuge'].includes(t.profile)) return false;
      if (selectedProfile !== 'casal' && selectedProfile !== 'familia' && t.profile !== selectedProfile) return false;
      if (filters.search && !`${t.description || ''} ${t.category || ''}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, selectedMonth, selectedYear, selectedProfile, filters]);

  if (isLoading) return <div className="p-6 text-slate-300">Carregando lançamentos...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar lançamentos.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Lançamentos</h1>
        <div className="flex items-center gap-2"><MonthProfileFilter selectedMonth={selectedMonth} selectedYear={selectedYear} selectedProfile={selectedProfile} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear} onProfileChange={setSelectedProfile} /><Button onClick={() => { setEditing(null); setOpen(true); }}>Novo</Button></div>
      </div>
      <TransactionFilters filters={filters} onFilterChange={setFilters} />
      <TransactionTable transactions={filtered} onEdit={(t) => { setEditing(t); setOpen(true); }} onDelete={(id) => del.mutate(id)} onBulkDelete={(ids) => bulkDel.mutate(ids)} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
      <TransactionForm open={open} onClose={() => { setOpen(false); setEditing(null); }} editingTransaction={editing} onSave={(data) => editing ? update.mutate({ id: editing.id, data }) : create.mutate(data)} />
    </div>
  );
}
