import { s as setMode } from './index-30eb7fef.js';

const appGlobalScript = () => setMode(element => {
  return element.mode || element.getAttribute('mode') || 'default';
});

export { appGlobalScript as a };
