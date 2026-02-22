import React, { useMemo, useState } from 'react';

export default function TransactionTable({ transactions, onEdit, onDelete, onBulkDelete, selectedIds, onSelectionChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * itemsPerPage;

  const paginated = useMemo(() => transactions.slice(start, start + itemsPerPage), [transactions, start]);

  const handleSelectAll = (checked) => onSelectionChange(checked ? paginated.map((t) => t.id) : []);
  const handleSelectOne = (id, checked) => onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
          <span className="text-sm text-rose-300">{selectedIds.length} item(s) selecionado(s)</span>
          <button onClick={() => onBulkDelete(selectedIds)} className="rounded bg-rose-600 px-3 py-1 text-sm text-white">Excluir selecionados</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900/70 text-left text-sm text-slate-300">
              <th className="p-3"><input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} /></th>
              <th className="p-3">Data</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Perfil</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Descrição</th>
              <th className="p-3 text-right">Valor</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} className="border-t border-slate-800 text-sm text-white">
                <td className="p-3"><input type="checkbox" checked={selectedIds.includes(t.id)} onChange={(e) => handleSelectOne(t.id, e.target.checked)} /></td>
                <td className="p-3">{t.date || '-'}</td>
                <td className="p-3">{t.type}</td>
                <td className="p-3">{t.profile}</td>
                <td className="p-3">{t.category}</td>
                <td className="p-3">{t.description}</td>
                <td className="p-3 text-right">{Number(t.amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-3 text-center">
                  <button onClick={() => onEdit(t)} className="mr-2 rounded bg-slate-700 px-2 py-1">Editar</button>
                  <button onClick={() => onDelete(t.id)} className="rounded bg-rose-700 px-2 py-1">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="p-8 text-center text-slate-400">Nenhum lançamento encontrado</div>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Mostrando {start + 1} - {Math.min(start + itemsPerPage, transactions.length)} de {transactions.length}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded bg-slate-700 px-2 py-1">Anterior</button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="rounded bg-slate-700 px-2 py-1">Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
}
