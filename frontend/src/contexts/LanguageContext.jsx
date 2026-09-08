import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('app_lang') || 'en';
    });

    const isRTL = lang === 'ar' || lang === 'he'; // e.g., for directional styling

    useEffect(() => {
        localStorage.setItem('app_lang', lang);
        // Optional: Update HTML root attributes for CSS/accessibility
        document.documentElement.lang = lang;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }, [lang, isRTL]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}