import React from 'react'
import ReactDOM from 'react-dom/client'
import BudgetFlowApp from './App.jsx'

// Polyfill window.storage API (used in Claude.ai artifacts)
// Maps to localStorage for standalone deployment
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      if (value === null) throw new Error('Key not found: ' + key);
      return { key, value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!prefix || k.startsWith(prefix)) keys.push(k);
      }
      return { keys };
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BudgetFlowApp />
  </React.StrictMode>
)
