import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Fuel() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], vehicle: '', fuel_type: 'gasolina', total_amount: '', profile: 'eu' });
  const { data: fuel = [], isLoading, isError } = useQuery({ queryKey: ['fuel'], queryFn: () => base44.entities.Fuel.list('-date', 100) });
  const create = useMutation({ mutationFn: async (d) => { await base44.entities.Fuel.create(d); await base44.entities.Transaction.create({ date: d.date, type: 'despesa', profile: d.profile, category: 'Combustível', description: `${d.vehicle} - ${d.fuel_type}`, amount: d.total_amount, include_in_calc: true, recurrence: 'sem_recorrencia', origin: 'combustivel' }); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['fuel'] }); qc.invalidateQueries({ queryKey: ['transactions'] }); setOpen(false); } });

  if (isLoading) return <div className="p-6 text-slate-300">Carregando combustível...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar combustível.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">Combustível</h1><Button onClick={() => setOpen(true)}>Registrar</Button></div>
      <Card className="p-4 space-y-2">{fuel.map((f) => <div key={f.id} className="flex items-center justify-between rounded border border-slate-700 p-2"><span>{f.date} • {f.vehicle} • {f.fuel_type}</span><strong>{Number(f.total_amount||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>)}</Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Novo abastecimento</DialogTitle></DialogHeader><form className="space-y-2" onSubmit={(e)=>{e.preventDefault();create.mutate({...form,total_amount:Number(form.total_amount||0)});}}><div><Label>Data</Label><Input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div><div><Label>Veículo</Label><Input value={form.vehicle} onChange={(e)=>setForm({...form,vehicle:e.target.value})} /></div><div><Label>Tipo</Label><Input value={form.fuel_type} onChange={(e)=>setForm({...form,fuel_type:e.target.value})} /></div><div><Label>Total</Label><Input type="number" step="0.01" value={form.total_amount} onChange={(e)=>setForm({...form,total_amount:e.target.value})} /></div><Button type="submit">Salvar</Button></form></DialogContent></Dialog>
    </div>
  );
}
