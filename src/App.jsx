import React, { useMemo, useState } from 'react';

const profiles = ['eu', 'conjuge', 'casal', 'familia'];
const profileLabel = {
  eu: 'Eu',
  conjuge: 'Cônjuge',
  casal: 'Casal',
  familia: 'Família',
};

const typeLabel = {
  receita: 'Receita',
  despesa: 'Despesa',
  investimento: 'Investimento',
};

function monthKey(dateString) {
  return String(dateString || '').slice(0, 7);
}

function addMonths(yyyyMmDd, amount) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  const dt = new Date(y, m - 1 + amount, d || 1);
  return dt.toISOString().slice(0, 10);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedProfile, setSelectedProfile] = useState('casal');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const [transactions, setTransactions] = useState([
    { id: 1, date: `${selectedMonth}-05`, type: 'receita', profile: 'eu', category: 'Salário', description: 'Salário', amount: 4500, include_in_calc: true, recurrence: 'sem_recorrencia', installments: 1, origin: 'manual' },
    { id: 2, date: `${selectedMonth}-08`, type: 'despesa', profile: 'casal', category: 'Mercado', description: 'Supermercado', amount: 780, include_in_calc: true, recurrence: 'sem_recorrencia', installments: 1, origin: 'manual' },
    { id: 3, date: `${selectedMonth}-12`, type: 'despesa', profile: 'eu', category: 'Aluguel', description: 'Moradia', amount: 1500, include_in_calc: true, recurrence: 'conta_fixa_mensal', installments: 1, origin: 'manual' },
  ]);

  const [entry, setEntry] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'despesa',
    profile: 'eu',
    category: '',
    description: '',
    amount: '',
    recurrence: 'sem_recorrencia',
    installments: 1,
    include_in_calc: true,
  });

  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [cardProfile, setCardProfile] = useState('eu');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.include_in_calc) return false;
      if (monthKey(t.date) !== selectedMonth) return false;
      if (selectedProfile === 'familia') return true;
      if (selectedProfile === 'casal') return t.profile === 'eu' || t.profile === 'conjuge' || t.profile === 'casal';
      return t.profile === selectedProfile;
    });
  }, [transactions, selectedMonth, selectedProfile]);

  const kpis = useMemo(() => {
    const receitas = filtered.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
    const despesas = filtered.filter((t) => t.type !== 'receita').reduce((s, t) => s + t.amount, 0);
    const byCategory = {};
    filtered.filter((t) => t.type !== 'receita').forEach((t) => {
      byCategory[t.category || 'Outros'] = (byCategory[t.category || 'Outros'] || 0) + t.amount;
    });
    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return { receitas, despesas, saldo: receitas - despesas, top };
  }, [filtered]);

  const forecast = useMemo(() => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const mk = monthKey(addMonths(`${selectedMonth}-01`, i));
      let receitas = 0;
      let despesas = 0;
      transactions.forEach((t) => {
        if (!t.include_in_calc) return;
        if (selectedProfile !== 'familia' && selectedProfile !== 'casal') {
          if (t.profile !== selectedProfile) return;
        }
        if (selectedProfile === 'casal' && !['eu', 'conjuge', 'casal'].includes(t.profile)) return;

        if (t.recurrence === 'conta_fixa_mensal' && monthKey(t.date) <= mk) {
          if (t.type === 'receita') receitas += t.amount;
          else despesas += t.amount;
          return;
        }

        if (t.recurrence === 'compra_parcelada' && t.installments > 1) {
          for (let p = 0; p < t.installments; p++) {
            if (monthKey(addMonths(t.date, p)) === mk) {
              if (t.type === 'receita') receitas += t.amount;
              else despesas += t.amount;
            }
          }
          return;
        }

        if (monthKey(t.date) === mk) {
          if (t.type === 'receita') receitas += t.amount;
          else despesas += t.amount;
        }
      });
      months.push({ month: mk, receitas, despesas, saldo: receitas - despesas });
    }
    return months;
  }, [transactions, selectedProfile, selectedMonth]);

  function currency(v) {
    return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function addTransaction(e) {
    e.preventDefault();
    const amount = Number(entry.amount || 0);
    if (!entry.date || !entry.category || amount <= 0) return;
    setTransactions((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...entry,
        amount,
        installments: Number(entry.installments || 1),
        origin: 'manual',
      },
    ]);
    setEntry((prev) => ({ ...prev, category: '', description: '', amount: '', installments: 1 }));
  }

  function importCsv(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const sep = text.includes(';') ? ';' : ',';
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return;
      const header = lines[0].toLowerCase().split(sep).map((h) => h.trim());
      const idxDate = header.findIndex((h) => h.includes('data') || h.includes('date'));
      const idxDesc = header.findIndex((h) => h.includes('descr') || h.includes('hist'));
      const idxVal = header.findIndex((h) => h.includes('valor') || h.includes('amount') || h.includes('total'));
      if (idxDate < 0 || idxDesc < 0 || idxVal < 0) return;

      const imported = lines.slice(1).map((line) => {
        const cols = line.split(sep);
        const rawDate = cols[idxDate]?.trim() || '';
        const date = rawDate.includes('/')
          ? `${rawDate.split('/')[2]}-${rawDate.split('/')[1]}-${rawDate.split('/')[0]}`
          : rawDate.slice(0, 10);
        const rawVal = (cols[idxVal] || '').replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        return {
          id: Date.now() + Math.random(),
          date,
          type: 'despesa',
          profile: cardProfile,
          category: 'Importação',
          description: cols[idxDesc] || 'Compra no cartão',
          amount: Math.abs(Number(rawVal || 0)),
          include_in_calc: true,
          recurrence: 'sem_recorrencia',
          installments: 1,
          origin: 'importacao',
          card: cardName,
        };
      }).filter((r) => r.date && r.amount > 0);

      if (cardName && !cards.find((c) => c.name === cardName)) {
        setCards((prev) => [...prev, { id: Date.now(), name: cardName, profile: cardProfile }]);
      }
      setTransactions((prev) => [...prev, ...imported]);
    };
    reader.readAsText(file);
  }

  const tabs = ['Dashboard', 'Lançamentos', 'Gráficos', 'Previsão', 'Cartões', 'Investimentos', 'Empréstimos', 'Combustível'];

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>FLUX PREMIUM</h1>
          <p>Controle financeiro inteligente, pessoal e de casal.</p>
        </div>
      </header>

      <section className="card filter-row">
        <label>
          Mês
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
        </label>
        <label>
          Perfil
          <select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
            {profiles.map((p) => (
              <option key={p} value={p}>{profileLabel[p]}</option>
            ))}
          </select>
        </label>
      </section>

      <nav className="tabs" aria-label="Navegação">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'tab active' : 'tab'}>
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Dashboard' && (
        <section className="card">
          <h2>Dashboard</h2>
          <div className="kpi-grid">
            <article className="kpi kpi-income"><p>Receitas</p><strong>{currency(kpis.receitas)}</strong></article>
            <article className="kpi kpi-expense"><p>Despesas</p><strong>{currency(kpis.despesas)}</strong></article>
            <article className="kpi kpi-balance"><p>Saldo</p><strong>{currency(kpis.saldo)}</strong></article>
            <article className="kpi"><p>Top Categoria</p><strong>{kpis.top ? `${kpis.top[0]} (${currency(kpis.top[1])})` : '-'}</strong></article>
          </div>
        </section>
      )}

      {activeTab === 'Lançamentos' && (
        <section className="card">
          <h2>Novo lançamento</h2>
          <form className="grid-form" onSubmit={addTransaction}>
            <input type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
            <select value={entry.type} onChange={(e) => setEntry({ ...entry, type: e.target.value })}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
              <option value="investimento">Investimento</option>
            </select>
            <select value={entry.profile} onChange={(e) => setEntry({ ...entry, profile: e.target.value })}>
              {profiles.map((p) => <option key={p} value={p}>{profileLabel[p]}</option>)}
            </select>
            <input placeholder="Categoria" value={entry.category} onChange={(e) => setEntry({ ...entry, category: e.target.value })} />
            <input placeholder="Descrição" value={entry.description} onChange={(e) => setEntry({ ...entry, description: e.target.value })} />
            <input placeholder="Valor" type="number" min="0" step="0.01" value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
            <select value={entry.recurrence} onChange={(e) => setEntry({ ...entry, recurrence: e.target.value })}>
              <option value="sem_recorrencia">Sem recorrência</option>
              <option value="conta_fixa_mensal">Conta fixa mensal</option>
              <option value="compra_parcelada">Compra parcelada</option>
            </select>
            <input type="number" min="1" value={entry.installments} onChange={(e) => setEntry({ ...entry, installments: e.target.value })} />
            <label className="check"><input type="checkbox" checked={entry.include_in_calc} onChange={(e) => setEntry({ ...entry, include_in_calc: e.target.checked })} />Incluir nos cálculos</label>
            <button type="submit">Salvar</button>
          </form>

          <h3>Lista</h3>
          <table>
            <thead><tr><th>Data</th><th>Tipo</th><th>Perfil</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td><td>{typeLabel[t.type] || t.type}</td><td>{profileLabel[t.profile] || t.profile}</td><td>{t.category}</td><td>{t.description}</td><td>{currency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'Gráficos' && (
        <section className="card"><h2>Gráficos</h2><p>Resumo por categoria:</p>
          <ul>{Object.entries(filtered.filter((t) => t.type !== 'receita').reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})).map(([c, v]) => <li key={c}>{c}: {currency(v)}</li>)}</ul>
        </section>
      )}

      {activeTab === 'Previsão' && (
        <section className="card"><h2>Previsão (6 meses)</h2>
          <table><thead><tr><th>Mês</th><th>Receitas</th><th>Despesas</th><th>Saldo</th></tr></thead>
            <tbody>{forecast.map((m) => <tr key={m.month}><td>{m.month}</td><td>{currency(m.receitas)}</td><td>{currency(m.despesas)}</td><td>{currency(m.saldo)}</td></tr>)}</tbody>
          </table>
        </section>
      )}

      {activeTab === 'Cartões' && (
        <section className="card">
          <h2>Cartões & Importação CSV</h2>
          <div className="grid-form">
            <input placeholder="Nome do cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} />
            <select value={cardProfile} onChange={(e) => setCardProfile(e.target.value)}>
              {profiles.map((p) => <option key={p} value={p}>{profileLabel[p]}</option>)}
            </select>
            <input type="file" accept=".csv" onChange={(e) => importCsv(e.target.files?.[0])} />
          </div>
          <ul>{cards.map((c) => <li key={c.id}>{c.name} ({profileLabel[c.profile]})</li>)}</ul>
        </section>
      )}

      {activeTab === 'Investimentos' && (
        <section className="card"><h2>Investimentos</h2><p>Cadastre pelo painel de Lançamentos com tipo "Investimento".</p></section>
      )}

      {activeTab === 'Empréstimos' && (
        <section className="card"><h2>Empréstimos</h2><p>Cadastre pelo painel de Lançamentos usando categoria "Empréstimos".</p></section>
      )}

      {activeTab === 'Combustível' && (
        <section className="card"><h2>Combustível</h2><p>Cadastre pelo painel de Lançamentos usando categoria "Combustível".</p></section>
      )}
    </main>
  );
}
