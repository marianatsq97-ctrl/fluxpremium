import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function VisualEditAgent() {
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const isVisualEditModeRef = useRef(false);
  const selectedElementIdRef = useRef(null);
  const hoverOverlaysRef = useRef([]);
  const selectedOverlaysRef = useRef([]);

  const createOverlay = (isSelected = false) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.border = isSelected ? '2px solid #2563EB' : '2px solid #95a5fc';
    if (!isSelected) overlay.style.backgroundColor = 'rgba(99,102,241,0.05)';
    return overlay;
  };

  const findElementsById = (id) => {
    if (!id) return [];
    const bySource = [...document.querySelectorAll(`[data-source-location="${id}"]`)];
    if (bySource.length) return bySource;
    return [...document.querySelectorAll(`[data-visual-selector-id="${id}"]`)];
  };

  const positionOverlay = (overlay, element) => {
    if (!overlay || !element || !isVisualEditModeRef.current) return;
    const rect = element.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
  };

  const clearOverlays = (arrRef) => {
    arrRef.current.forEach((o) => o.parentNode?.removeChild(o));
    arrRef.current = [];
  };

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (!isVisualEditModeRef.current) return;
      const el = e.target.closest('[data-source-location], [data-visual-selector-id]');
      if (!el) return clearOverlays(hoverOverlaysRef);

      const id = el.dataset.sourceLocation || el.dataset.visualSelectorId;
      if (id === selectedElementIdRef.current) return;

      clearOverlays(hoverOverlaysRef);
      findElementsById(id).forEach((target) => {
        const overlay = createOverlay(false);
        document.body.appendChild(overlay);
        hoverOverlaysRef.current.push(overlay);
        positionOverlay(overlay, target);
      });
    };

    const handleMouseOut = () => clearOverlays(hoverOverlaysRef);

    const handleClick = (e) => {
      if (!isVisualEditModeRef.current) return;
      const el = e.target.closest('[data-source-location], [data-visual-selector-id]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();

      const id = el.dataset.sourceLocation || el.dataset.visualSelectorId;
      selectedElementIdRef.current = id;

      clearOverlays(selectedOverlaysRef);
      findElementsById(id).forEach((target) => {
        const overlay = createOverlay(true);
        document.body.appendChild(overlay);
        selectedOverlaysRef.current.push(overlay);
        positionOverlay(overlay, target);
      });

      window.parent.postMessage({
        type: 'element-selected',
        visualSelectorId: id,
        tagName: el.tagName,
        classes: el.className?.baseVal || el.className || '',
        content: el.innerText,
      }, '*');
    };

    const handleMessage = (event) => {
      const msg = event.data;
      if (msg?.type === 'toggle-visual-edit-mode') {
        const enabled = !!msg.data?.enabled;
        setIsVisualEditMode(enabled);
        isVisualEditModeRef.current = enabled;
        document.body.style.cursor = enabled ? 'crosshair' : 'default';
        if (!enabled) {
          clearOverlays(hoverOverlaysRef);
          clearOverlays(selectedOverlaysRef);
          selectedElementIdRef.current = null;
        }
      }

      if (msg?.type === 'update-classes' && msg.data?.visualSelectorId) {
        findElementsById(msg.data.visualSelectorId).forEach((el) => {
          const current = el.className?.baseVal || el.className || '';
          el.className = msg.data.replace ? msg.data.classes : twMerge(current, msg.data.classes);
        });
      }

      if (msg?.type === 'update-content' && msg.data?.visualSelectorId) {
        findElementsById(msg.data.visualSelectorId).forEach((el) => {
          el.innerText = msg.data.content ?? '';
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('message', handleMessage);
    window.parent?.postMessage({ type: 'visual-edit-agent-ready' }, '*');

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('message', handleMessage);
      clearOverlays(hoverOverlaysRef);
      clearOverlays(selectedOverlaysRef);
    };
  }, []);

  return null;
}
