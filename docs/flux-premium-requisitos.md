# FLUX PREMIUM — Requisitos Funcionais (consolidado)

Este documento consolida o escopo informado para implementação no app da Base44.

## 1) Identidade visual
- Nome sempre em maiúsculo: **FLUX PREMIUM**.
- Slogan: *Controle financeiro inteligente, pessoal e de casal.*
- Tema escuro com destaque em azul degradê.
- Logo oficial (carteira preta + barras coloridas + sorriso azul) sem alterar desenho.

## 2) Acesso
- Login por e-mail/senha.
- Cadastro de conta.
- Recuperação de senha por código enviado por e-mail.
- Admins fixos:
  - `mqueiroz.consult@gmail.com`
  - `marianatsq97@gmail.com`
- Cabeçalho com: e-mail logado, papel (Admin/Usuário), botão sair.

## 3) Dashboard
- Filtros: mês e perfil (Eu, Cônjuge, Casal, Casa/Família, Todos).
- KPIs: receitas, despesas, saldo e top categoria com percentual.
- Regras de cálculo: somente itens com **Incluir nos cálculos = Sim**.

## 4) Abas
1. Lançamentos
2. Gráficos & Análises
3. Previsão Futura
4. Cartões & Importação
5. Investimentos
6. Empréstimos
7. Combustível
8. (opcional já solicitado) Insights & Análise
9. (opcional já solicitado) Contas a Pagar

## 5) Regra central de fluxo
- `receita` soma em receitas.
- `despesa` e `investimento` somam em despesas.
- Toda inclusão/edição/exclusão deve recalcular KPIs, gráficos e previsão.

## 6) Importação de cartão
- Aceitar CSV/XLS/XLSX.
- Auto-detecção de colunas data/descrição/valor/categoria.
- Normalização de data e valor (pt-BR e en-US).
- Origem do lançamento: `Importação`.

## 7) Performance
- Operação fluida com centenas de linhas importadas.
- Evitar travamento e tela branca em navegação.
