# Migração do código Base44

Arquivos principais recebidos e estruturados:
- `entities/*.json`
- `src/api/*`
- `src/components/dashboard/*`
- `src/components/transactions/*`
- `src/components/ErrorBoundary.jsx`

## Correções aplicadas
- Remoção de animações de desmontagem em tabela de transações para mitigar `removeChild` em navegação.
- Componente `AppErrorBoundary` para evitar tela totalmente branca em erro de renderização.
