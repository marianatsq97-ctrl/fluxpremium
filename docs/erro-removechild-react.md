# Correção da tela branca (`removeChild`) em apps React

Erro observado:

`NotFoundError: Failed to execute 'removeChild' on 'Node'`

Esse erro costuma ocorrer quando extensões (ex.: tradutor, plugins de produtividade) alteram o DOM e o React perde sincronização durante troca de rota.

## Plano de correção (aplicar no código do app)

1. Adicionar **Error Boundary** no layout raiz (envolvendo rotas).
2. Evitar desmontagens animadas agressivas durante navegação.
3. Aplicar `translate="no"` no contêiner raiz.
4. Garantir chaves estáveis em listas e menus.
5. Proteger parsing/importação contra exceções não tratadas.

## Snippet de Error Boundary

```tsx
import React from 'react';

type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[AppErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 16 }}>Ocorreu um erro. Recarregue a tela.</div>;
    }

    return this.props.children;
  }
}
```

> Observação: este repositório ainda não contém o código-fonte da aplicação, então o patch acima está documentado para aplicação assim que os arquivos do app forem enviados.
