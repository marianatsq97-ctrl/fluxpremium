import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

export default function Bills() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', due_date: '', profile: 'eu', category: '', notes: '' });

  const { data: bills = [], isLoading, isError } = useQuery({
    queryKey: ['bills'],
    queryFn: () => base44.entities.Bill.list('-due_date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => base44.entities.Bill.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setDialogOpen(false);
      setForm({ name: '', amount: '', due_date: '', profile: 'eu', category: '', notes: '' });
      toast({ title: 'Conta adicionada', description: 'A nova conta foi salva.' });
    },
  });

  const payMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bill.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bills'] }),
  });

  const rows = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bills.map((b) => {
      const due = new Date(`${b.due_date}T00:00:00`);
      due.setHours(0, 0, 0, 0);
      const late = b.status !== 'pago' && due < today;
      return { ...b, autoStatus: late ? 'atrasado' : b.status };
    });
  }, [bills]);

  const onSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...form, amount: Number(form.amount || 0), status: 'pendente', is_recurring: false });
  };

  if (isLoading) return <div className="p-6 text-slate-300">Carregando contas...</div>;
  if (isError) return <div className="p-6 text-rose-400">Erro ao carregar contas.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Contas a Pagar</h1>
        <Button onClick={() => setDialogOpen(true)}>Nova conta</Button>
      </div>

      <Card className="p-4">
        <div className="space-y-2">
          {rows.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between rounded border border-slate-700 bg-slate-800/40 p-3">
              <div className="flex items-center gap-3">
                <Checkbox checked={bill.status === 'pago'} onCheckedChange={() => payMutation.mutate({ id: bill.id, data: { ...bill, status: 'pago' } })} />
                <div>
                  <p className="text-white">{bill.name}</p>
                  <p className="text-xs text-slate-400">{bill.due_date} • {bill.profile} • {bill.autoStatus}</p>
                </div>
              </div>
              <span className="font-semibold text-white">{Number(bill.amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          ))}
          {rows.length === 0 && <p className="text-slate-400">Nenhuma conta cadastrada.</p>}
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova conta</DialogTitle></DialogHeader>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Valor</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required /></div>
            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
