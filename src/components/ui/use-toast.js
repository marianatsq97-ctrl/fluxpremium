import { useEffect, useState } from 'react';

let memoryState = { toasts: [] };
const listeners = [];

function dispatch(next) {
  memoryState = next;
  listeners.forEach((l) => l(memoryState));
}

export function toast(input) {
  const id = `${Date.now()}-${Math.random()}`;
  const item = { id, open: true, ...input };
  dispatch({ toasts: [item, ...memoryState.toasts].slice(0, 20) });
  return { id, dismiss: () => dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) }) };
}

export function useToast() {
  const [state, setState] = useState(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  return { ...state, toast, dismiss: (id) => dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) }) };
}
