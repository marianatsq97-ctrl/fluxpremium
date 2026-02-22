import React from 'react';

export default function TopCategoryCard({ category, amount = 0, percentage = 0 }) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
      <p className="text-sm text-slate-400">Top Categoria</p>
      <p className="text-xl font-bold text-amber-400 capitalize">{category || '-'}</p>
      {amount > 0 && (
        <p className="text-2xl font-bold text-white">
          {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      )}
      {percentage > 0 && <p className="mt-2 text-sm text-amber-300">{percentage.toFixed(1)}% do total de despesas</p>}
    </div>
  );
}
