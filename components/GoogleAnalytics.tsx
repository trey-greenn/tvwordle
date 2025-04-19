import Script from 'next/script';
import { useEffect } from 'react';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    // Define the dataLayer and the gtag function
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore - Google Analytics includes this function
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    // @ts-ignore
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', gaId);
  }, [gaId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}

// Add necessary type definitions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 