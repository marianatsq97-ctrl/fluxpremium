import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Loans() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'peguei', person: '', amount: '', status: 'pendente', profile: 'eu', include_in_calc: false });
  const { data: loans = [], isLoading, isError } = useQuery({ queryKey: ['loans'], queryFn: () => base44.entities.Loan.list('-date', 100) });
  const create = useMutation({ mutationFn: async (d) => { await base44.entities.Loan.create(d); if (d.include_in_calc) await base44.entities.Transaction.create({ date: d.date, type: d.type === 'peguei' ? 'receita' : 'despesa', profile: d.profile, category: d.type === 'peguei' ? 'Empréstimos - Peguei' : 'Empréstimos - Dei', description: `Empréstimo - ${d.person}`, amount: d.amount, include_in_calc: true, recurrence: 'sem_recorrencia', origin: 'emprestimo' }); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['loans'] }); qc.invalidateQueries({ queryKey: ['transactions'] }); setOpen(false); } });

  if (isLoading) return <div className="p-6 text-slate-300">Carregando empréstimos...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar empréstimos.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">Empréstimos</h1><Button onClick={() => setOpen(true)}>Novo</Button></div>
      <Card className="p-4 space-y-2">{loans.map((l) => <div key={l.id} className="flex items-center justify-between rounded border border-slate-700 p-2"><span>{l.date} • {l.person} • {l.type} • {l.status}</span><strong>{Number(l.amount||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>)}</Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Novo empréstimo</DialogTitle></DialogHeader><form className="space-y-2" onSubmit={(e)=>{e.preventDefault();create.mutate({...form,amount:Number(form.amount||0)});}}><div><Label>Pessoa</Label><Input value={form.person} onChange={(e)=>setForm({...form,person:e.target.value})} /></div><div><Label>Valor</Label><Input type="number" step="0.01" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} /></div><Button type="submit">Salvar</Button></form></DialogContent></Dialog>
    </div>
  );
}
