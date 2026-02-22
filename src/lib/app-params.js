const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map(), location: { search: '', pathname: '', hash: '', href: '' }, history: { replaceState: () => {} } } : window;

function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function storageGet(storage, key) {
  return typeof storage.getItem === 'function' ? storage.getItem(key) : storage.get(key);
}

function storageSet(storage, key, value) {
  if (typeof storage.setItem === 'function') storage.setItem(key, value);
  else storage.set(key, value);
}

function getAppParamValue(paramName, { defaultValue = undefined, removeFromUrl = false } = {}) {
  if (isNode) return defaultValue ?? null;

  const storage = windowObj.localStorage;
  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(windowObj.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl && searchParam) {
    urlParams.delete(paramName);
    const newUrl = `${windowObj.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${windowObj.location.hash}`;
    windowObj.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storageSet(storage, storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue != null) {
    storageSet(storage, storageKey, defaultValue);
    return defaultValue;
  }

  return storageGet(storage, storageKey) ?? null;
}

function getAppParams() {
  const storage = windowObj.localStorage;
  if (!isNode && getAppParamValue('clear_access_token') === 'true') {
    storage.removeItem?.('base44_access_token');
    storage.removeItem?.('token');
  }

  return {
    appId: getAppParamValue('app_id', { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
    serverUrl: getAppParamValue('server_url', { defaultValue: import.meta.env.VITE_BASE44_BACKEND_URL || import.meta.env.VITE_BASE44_SERVER_URL }),
    token: getAppParamValue('access_token', { removeFromUrl: true }),
    fromUrl: getAppParamValue('from_url', { defaultValue: isNode ? '' : windowObj.location.href }),
    functionsVersion: getAppParamValue('functions_version', { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1' }),
  };
}

export const appParams = { ...getAppParams() };
