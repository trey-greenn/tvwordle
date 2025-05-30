import "@/styles/globals.css";
import type { AppProps } from "next/app";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SEO from "@/components/SEO";

export default function App({ Component, pageProps }: AppProps) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NC3N1H4QYW';
  
  return (
    <>
      <SEO/>
      <GoogleAnalytics gaId={gaId} />
      <Component {...pageProps} />
    </>
  );
}
