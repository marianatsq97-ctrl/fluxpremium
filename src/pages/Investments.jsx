import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Investments() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0], type: 'Selic', profile: 'eu' });
  const { data: investments = [], isLoading, isError } = useQuery({ queryKey: ['investments'], queryFn: () => base44.entities.Investment.list('-date', 100) });
  const create = useMutation({ mutationFn: async (data) => { await base44.entities.Investment.create(data); await base44.entities.Transaction.create({ date: data.date, type: 'investimento', profile: data.profile, category: data.type, description: `Aplicação em ${data.type}`, amount: data.amount, include_in_calc: true, recurrence: 'sem_recorrencia', origin: 'investimento' }); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['investments'] }); qc.invalidateQueries({ queryKey: ['transactions'] }); setOpen(false); } });

  if (isLoading) return <div className="p-6 text-slate-300">Carregando investimentos...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar investimentos.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">Investimentos</h1><Button onClick={() => setOpen(true)}>Novo</Button></div>
      <Card className="p-4 space-y-2">{investments.map((i) => <div key={i.id} className="flex items-center justify-between rounded border border-slate-700 p-2"><span>{i.type} • {i.date}</span><strong>{Number(i.amount||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>)}</Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Novo investimento</DialogTitle></DialogHeader><form className="space-y-2" onSubmit={(e)=>{e.preventDefault();create.mutate({...form,amount:Number(form.amount||0),include_in_calc:true});}}><div><Label>Data</Label><Input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div><div><Label>Tipo</Label><Input value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} /></div><div><Label>Valor</Label><Input type="number" step="0.01" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} /></div><Button type="submit">Salvar</Button></form></DialogContent></Dialog>
    </div>
  );
}
