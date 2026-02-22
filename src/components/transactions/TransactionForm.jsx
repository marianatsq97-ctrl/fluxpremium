import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const empty = {
  date: new Date().toISOString().split('T')[0],
  type: 'despesa',
  profile: 'eu',
  category: '',
  description: '',
  amount: '',
  recurrence: 'sem_recorrencia',
  installments: 1,
  include_in_calc: true,
  origin: 'manual',
};

export default function TransactionForm({ open, onClose, onSave, editingTransaction }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(editingTransaction ? { ...editingTransaction, amount: String(editingTransaction.amount || '') } : empty);
  }, [editingTransaction, open]);

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: Number(form.amount || 0), installments: Number(form.installments || 1) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editingTransaction ? 'Editar' : 'Novo'} lançamento</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <div><Label>Data</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
          <div><Label>Tipo</Label><select className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="receita">Receita</option><option value="despesa">Despesa</option><option value="investimento">Investimento</option></select></div>
          <div><Label>Perfil</Label><select className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })}><option value="eu">Eu</option><option value="conjuge">Cônjuge</option><option value="casal">Casal</option><option value="familia">Família</option></select></div>
          <div><Label>Categoria</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
          <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Valor</Label><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
          <div className="flex gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit">Salvar</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
