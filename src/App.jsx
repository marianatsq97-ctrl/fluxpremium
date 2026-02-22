import React, { useMemo, useState } from 'react';

const tabs = [
  'Dashboard',
  'Lançamentos',
  'Gráficos',
  'Previsão',
  'Cartões',
  'Investimentos',
  'Empréstimos',
  'Combustível',
];

const mockTransactions = [
  { type: 'receita', amount: 5200 },
  { type: 'despesa', amount: 1480 },
  { type: 'despesa', amount: 980 },
  { type: 'investimento', amount: 600 },
];

function KPI({ label, value, tone = 'neutral' }) {
  return (
    <article className={`kpi kpi-${tone}`}>
      <p className="kpi-label">{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const summary = useMemo(() => {
    const receitas = mockTransactions
      .filter((item) => item.type === 'receita')
      .reduce((acc, item) => acc + item.amount, 0);

    const despesas = mockTransactions
      .filter((item) => item.type !== 'receita')
      .reduce((acc, item) => acc + item.amount, 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  }, []);

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>FLUX PREMIUM</h1>
          <p>Controle financeiro inteligente, pessoal e de casal.</p>
        </div>
        <button type="button" className="logout-btn">
          Sair
        </button>
      </header>

      <nav className="tabs" aria-label="Navegação principal">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'tab active' : 'tab'}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="card">
        <h2>{activeTab}</h2>

        {activeTab === 'Dashboard' ? (
          <>
            <p className="section-help">Resumo rápido do período atual.</p>
            <div className="kpi-grid">
              <KPI
                label="Receitas"
                value={summary.receitas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                tone="income"
              />
              <KPI
                label="Despesas"
                value={summary.despesas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                tone="expense"
              />
              <KPI
                label="Saldo"
                value={summary.saldo.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                tone={summary.saldo >= 0 ? 'balance' : 'expense'}
              />
            </div>
          </>
        ) : (
          <p className="section-help">
            Módulo <strong>{activeTab}</strong> pronto para conectar com os dados
            reais da Base44.
          </p>
        )}
      </section>
    </main>
  );
}
