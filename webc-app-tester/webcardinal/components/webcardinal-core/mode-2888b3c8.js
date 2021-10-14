import { s as setMode } from './index-60428ce4.js';

const appGlobalScript = () => setMode(element => {
  return element.mode || element.getAttribute('mode') || 'default';
});

export { appGlobalScript as a };
