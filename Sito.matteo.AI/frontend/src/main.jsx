import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles/fonts.css';
import './styles/style.css';
import './styles/modal.css';
import './styles/cookie-banner.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </BrowserRouter>
    </StrictMode>
);
