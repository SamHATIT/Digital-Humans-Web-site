import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FormData {
    email: string;
    name: string;
    company: string;
    newsletter: boolean;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const CTA: React.FC = () => {
    const { t } = useLanguage();
    const [showForm, setShowForm] = useState(false);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        name: '',
        company: '',
        newsletter: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('https://n8n.samhatit-consulting.cloud/webhook/lead-capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    source: 'website_cta',
                    timestamp: new Date().toISOString()
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ email: '', name: '', company: '', newsletter: true });
            } else {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Request failed');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <section id="final-cta" className="py-20 px-4 min-h-[70vh] flex flex-col justify-center items-center text-center">
            <div className="max-w-2xl mx-auto space-y-6 text-lg text-slate-600 dark:text-slate-400">
                <p className="text-3xl font-bold text-purple-500 dark:text-purple-400">
                    {t('cta.title')}
                </p>
                
                <p>{t('cta.line1')}</p>
                <p>{t('cta.line2')}</p>
                <p className="text-cyan-500 dark:text-cyan-400">{t('cta.line3')}</p>
                <p><strong className="text-slate-800 dark:text-white">{t('cta.line4')}</strong></p>
            </div>

            {!showForm && status !== 'success' && (
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-10 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all cursor-pointer"
                >
                    {t('cta.button')}
                </button>
            )}

            {showForm && status !== 'success' && (
                <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                            {t('form.pilot')}
                        </p>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                            {t('form.title')}
                        </h3>
                        
                        {/* Email - Required */}
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('form.email')}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Name - Optional */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={t('form.name')}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Company - Optional */}
                        <div className="mb-4">
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder={t('form.company')}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Newsletter Checkbox */}
                        <div className="mb-6 flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="newsletter"
                                id="newsletter"
                                checked={formData.newsletter}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                            />
                            <label htmlFor="newsletter" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                {t('form.newsletter')}
                            </label>
                        </div>

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                {t('form.error')} {errorMessage && `(${errorMessage})`}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    {t('form.sending')}
                                </span>
                            ) : t('form.submit')}
                        </button>

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {t('form.cancel')}
                        </button>
                    </div>
                </form>
            )}

            {/* Success State */}
            {status === 'success' && (
                <div className="mt-10 w-full max-w-md">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-2xl text-center">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                            {t('form.success.title')}
                        </h3>
                        <p className="text-green-600 dark:text-green-500">
                            {t('form.success.message')}
                        </p>
                    </div>
                </div>
            )}

            {!showForm && status !== 'success' && (
                <p className="mt-5 text-sm text-slate-400">
                    <span className="opacity-50">{t('cta.no')}</span>
                </p>
            )}
        </section>
    );
};

export default CTA;
