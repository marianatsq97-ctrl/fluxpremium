import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function Cards() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [cardName, setCardName] = useState('');
  const [profile, setProfile] = useState('eu');

  const { data: cards = [] } = useQuery({ queryKey: ['cards'], queryFn: () => base44.entities.Card.list() });

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(Boolean);
    const sep = text.includes(';') ? ';' : ',';
    const headers = (lines[0] || '').split(sep).map((x) => x.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(sep);
      return headers.reduce((acc, h, i) => ({ ...acc, [h]: values[i]?.trim() || '' }), {});
    });
    return { headers, rows };
  };

  const handleImport = async () => {
    if (!file || !cardName) return toast({ title: 'Dados faltando', description: 'Selecione arquivo e nome do cartão.' });
    const text = await file.text();
    const { headers, rows } = parseCSV(text);
    const dateCol = headers.find((h) => ['data', 'date', 'dt'].some((n) => h.includes(n)));
    const descCol = headers.find((h) => ['descricao', 'descrição', 'description', 'historico'].some((n) => h.includes(n)));
    const valueCol = headers.find((h) => ['valor', 'amount', 'total'].some((n) => h.includes(n)));
    if (!dateCol || !descCol || !valueCol) return toast({ title: 'Erro na importação', description: 'Não identifiquei Data/Descrição/Valor.' });

    const tx = rows.map((r) => ({
      date: r[dateCol],
      type: 'despesa',
      profile,
      category: 'Outros',
      description: r[descCol],
      amount: Math.abs(Number(String(r[valueCol]).replace(',', '.')) || 0),
      include_in_calc: true,
      recurrence: 'sem_recorrencia',
      origin: 'importacao',
      card: cardName,
    })).filter((x) => x.date && x.description && x.amount > 0);

    await base44.entities.Transaction.bulkCreate(tx);
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    toast({ title: 'Importação concluída', description: `${tx.length} lançamentos criados.` });
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Cartões & Importação</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 space-y-3">
          <Input placeholder="Nome do cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} />
          <select className="rounded border border-slate-700 bg-slate-800 p-2 text-white" value={profile} onChange={(e) => setProfile(e.target.value)}>
            <option value="eu">Eu</option><option value="conjuge">Cônjuge</option><option value="familia">Família</option>
          </select>
          <Input type="file" accept=".csv,.xls,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleImport}>Importar fatura</Button>
        </Card>
        <Card className="p-4">
          <p className="mb-2 text-sm text-slate-400">Cartões cadastrados</p>
          <ul className="space-y-2">{cards.map((c) => <li key={c.id} className="rounded border border-slate-700 p-2 text-white">{c.name}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
