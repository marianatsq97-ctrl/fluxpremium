# FLUX PREMIUM

Base inicial do app FLUX PREMIUM com bootstrap web funcionando via Vite.

## Como abrir o app

```bash
npm install
npm run dev
```

Depois, abra:

- `http://localhost:5173`

## Se você ainda não criou nenhuma pasta (do zero)

Se quiser montar exatamente a base mínima no seu computador, rode no terminal:

```bash
mkdir fluxpremium
cd fluxpremium
mkdir -p src
```

Crie estes arquivos dentro da pasta `fluxpremium`:

```text
fluxpremium/
├─ package.json
├─ index.html
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ index.css
```

Conteúdo de cada arquivo:

`package.json`

```json
{
  "name": "flux-premium",
  "private": true,
  "version": "0.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.1.0"
  }
}
```

`index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FLUX PREMIUM</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

`src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/App.jsx`

```jsx
export default function App() {
  return (
    <main>
      <h1>FLUX PREMIUM</h1>
      <p>App rodando com sucesso.</p>
    </main>
  );
}
```

`src/index.css`

```css
body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: #0b1324;
  color: #fff;
}

main {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
```

Depois de criar os arquivos, rode:

```bash
npm install
npm run dev
```

Abra no navegador:

- `http://localhost:5173`

## Se no GitHub aparecer “This branch is 1 commit behind main”

Você está em uma branch diferente da principal. Para ver a versão mais recente:

1. Abra a branch `main` no seletor de branch do GitHub.
2. Ou faça merge da `main` na sua branch atual.

## Status atual

- Entry point web criado (`index.html`, `src/main.jsx`, `src/App.jsx`).
- Scripts de execução adicionados no `package.json` (`dev`, `build`, `preview`).
- Estrutura antiga de páginas/componentes permanece no repositório para integração gradual.
