import { createRoot } from 'react-dom/client';
import { setOverrideKey } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Inject the foundry override key so PUT/DELETE /foundries/:id/override
// requests include the X-Override-Key header required by the server.
setOverrideKey(import.meta.env.VITE_FOUNDRY_OVERRIDE_KEY ?? null);

createRoot(document.getElementById('root')!).render(<App />);
