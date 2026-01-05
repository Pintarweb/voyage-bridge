'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export default function GoogleTranslateWidget() {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,zh-CN,es,fr,de,ja,ko,ar,ms,th,vi,id',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };
    }, []);

    return (
        <>
            <div id="google_translate_element" className="hidden" aria-hidden="true" />
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />

            <style jsx global>{`
        body { top: 0 !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-te-gadget { display: none !important; }
        iframe[id^=":"] { display: none !important; }
      `}</style>
        </>
    );
}
