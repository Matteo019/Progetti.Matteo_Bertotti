import { Link } from 'react-router-dom';

import { usePageMeta } from '../seo.js';

export default function Privacy() {
    usePageMeta({ title: 'Privacy Policy | Matteo Augustinho Bertotti', path: '/privacy' });

    return (
        <>
            <nav className="navbar scrolled">
                <div className="container">
                    <Link to="/" className="logo">MB.</Link>
                </div>
            </nav>

            <main className="privacy-content">
                <Link to="/" className="back-link">&larr; Torna alla Home</Link>
                <h1>Informativa sulla Privacy e sui Cookie</h1>

                <p>Ultimo aggiornamento: 19 Novembre 2026</p>

                <h2>1. Introduzione</h2>
                <p>Benvenuti nel sito di Matteo Augustinho Bertotti. Questa informativa spiega quali dati vengono trattati
                    durante la navigazione, in conformità con il Regolamento UE 2016/679 (GDPR) e la Direttiva ePrivacy.</p>

                <h2>2. Cookie e tracciamento</h2>
                <p>Le pagine pubbliche di questo sito <strong>non utilizzano cookie</strong>, né cookie di profilazione, né
                    strumenti di analisi (es. Google Analytics) o di tracciamento di terze parti. L'unica eccezione è l'area
                    riservata all'amministratore (<strong>/admin</strong>), usata solo da me per pubblicare i post: lì il
                    login imposta un <strong>cookie tecnico di sessione</strong>, necessario all'accesso e non usato per
                    profilazione.</p>

                <h2>3. Dati salvati nel browser</h2>
                <p>Per il funzionamento del sito vengono salvate, esclusivamente nel <em>localStorage</em> del vostro browser,
                    due preferenze tecniche:</p>
                <ul>
                    <li><strong>preferredLanguage</strong>: la lingua scelta (italiano o inglese);</li>
                    <li><strong>cookie-consent</strong>: il fatto che abbiate chiuso l'avviso informativo.</li>
                </ul>
                <p>Questi dati non vengono mai inviati al server né a terzi e potete cancellarli in qualsiasi momento dalle
                    impostazioni del browser (dati dei siti).</p>

                <h2>4. Risorse di terze parti</h2>
                <p>Font, immagini e script sono serviti direttamente da questo sito, senza servizi esterni. I link esterni
                    (LinkedIn, GitHub, Google Drive, freeCodeCamp) portano a siti con proprie politiche sulla privacy.</p>

                <h2>5. Applicazione Gestione Magazzino Bar</h2>
                <p>L'applicazione dimostrativa aperta dalla sezione &laquo;Progetti&raquo;
                    (<strong>dispensabar.matteobertotti.tech</strong>) è ospitata sullo stesso server, senza servizi di terze parti:</p>
                <ul>
                    <li>quando si accede, usa un unico <strong>cookie tecnico di sessione</strong> (necessario al login,
                        non usato per profilazione), che viene eliminato con il logout o alla scadenza;</li>
                    <li>chi si registra fornisce nome ed email, salvati sul server insieme alla password cifrata
                        (non è mai salvata in chiaro), al solo scopo di permettere l'accesso;</li>
                    <li>i dati presenti nella demo (prodotti, movimenti, utenti) sono di esempio: per provarla basta
                        l'account <strong>test / test</strong>, senza registrarsi.</li>
                </ul>
                <p>Per far cancellare un account creato con la registrazione scrivete all'indirizzo indicato sotto.</p>

                <h2>6. Log del server</h2>
                <p>Come ogni server web, il server che ospita il sito può registrare temporaneamente dati tecnici (indirizzo IP,
                    data e ora, pagina richiesta) per finalità di sicurezza e corretto funzionamento.</p>

                <h2>7. Contatti</h2>
                <p>Per qualsiasi domanda relativa a questa informativa, potete contattarmi all'indirizzo email: <a
                    href="mailto:matteobertotti@icloud.com">matteobertotti@icloud.com</a>.</p>
            </main>

            <footer className="privacy-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Matteo Augustinho Bertotti. Tutti i diritti riservati.</p>
                </div>
            </footer>
        </>
    );
}
