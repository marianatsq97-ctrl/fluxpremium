import React from 'react';

export default function TransactionFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        placeholder="Buscar descrição..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        className="min-w-[200px] flex-1 rounded border border-slate-700 bg-slate-800 p-2 text-white"
      />
    </div>
  );
}
