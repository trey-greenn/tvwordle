import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NC3N1H4QYW';
  
  return (
    <Html lang="en">
      <Head>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-NC3N1H4QYW`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NC3N1H4QYW');
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
