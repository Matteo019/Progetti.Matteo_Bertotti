import { useState } from 'react';

import { api } from '../api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const EMPTY = { name: '', email: '', message: '', website: '' };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ContactForm() {
    const { t } = useLanguage();
    const [data, setData] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [serverError, setServerError] = useState('');

    const set = (field) => (e) => {
        setData(d => ({ ...d, [field]: e.target.value }));
        if (errors[field]) setErrors(errs => ({ ...errs, [field]: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (!data.name.trim()) errs.name = t('form-err-name');
        if (!EMAIL_RE.test(data.email.trim())) errs.email = t('form-err-email');
        if (data.message.trim().length < 10) errs.message = t('form-err-message');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus('sending');
        setServerError('');
        try {
            await api.sendContact(data);
            setStatus('sent');
            setData(EMPTY);
        } catch (err) {
            setStatus('error');
            setServerError(err.status === 429 ? t('form-err-rate') : t('form-err-server'));
        }
    };

    if (status === 'sent') {
        return (
            <div className="contact-sent" role="status">
                <p className="contact-sent-title">{t('form-sent-title')}</p>
                <p>{t('form-sent-text')}</p>
                <button type="button" className="arrow-link" onClick={() => setStatus('idle')}>
                    {t('form-sent-again')} <span aria-hidden="true">→</span>
                </button>
            </div>
        );
    }

    const field = (name, label, props = {}) => (
        <label className={`field${errors[name] ? ' has-error' : ''}`}>
            <span className="field-label">{label}</span>
            {props.multiline ? (
                <textarea value={data[name]} onChange={set(name)} rows={5} maxLength={4000} aria-invalid={!!errors[name]} />
            ) : (
                <input value={data[name]} onChange={set(name)} aria-invalid={!!errors[name]} {...props} />
            )}
            {errors[name] && <span className="field-error">{errors[name]}</span>}
        </label>
    );

    return (
        <form className="contact-form" onSubmit={submit} noValidate>
            <div className="field-row">
                {field('name', t('form-name'), { autoComplete: 'name', maxLength: 120 })}
                {field('email', t('form-email'), { type: 'email', autoComplete: 'email', maxLength: 254 })}
            </div>
            {field('message', t('form-message'), { multiline: true })}

            {/* Honeypot: invisible to people, bots fill it in */}
            <label className="hp" aria-hidden="true">
                Website
                <input tabIndex={-1} autoComplete="off" value={data.website} onChange={set('website')} />
            </label>

            <div className="contact-submit">
                <button type="submit" className="btn btn-clay" disabled={status === 'sending'}>
                    {status === 'sending' ? t('form-sending') : t('form-send')}
                </button>
                {serverError && <p className="field-error" role="alert">{serverError}</p>}
            </div>
            <p className="contact-privacy">{t('form-privacy')}</p>
        </form>
    );
}
