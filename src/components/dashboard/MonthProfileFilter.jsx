import React from 'react';

const months = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const profiles = [
  { value: 'eu', label: 'Eu' },
  { value: 'conjuge', label: 'Cônjuge' },
  { value: 'casal', label: 'Casal' },
  { value: 'familia', label: 'Família' },
];

export default function MonthProfileFilter({ selectedMonth, selectedYear, selectedProfile, onMonthChange, onYearChange, onProfileChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="flex flex-wrap gap-3">
      <select value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)} className="rounded bg-slate-800 p-2 text-white">
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)} className="rounded bg-slate-800 p-2 text-white">
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
      <select value={selectedProfile} onChange={(e) => onProfileChange(e.target.value)} className="rounded bg-slate-800 p-2 text-white">
        {profiles.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  );
}
