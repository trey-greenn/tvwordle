import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: object | null;
};

const SEO = ({
    // ... existing code ...
    title = 'TV Wordle - Guess the Mystery TV Show',
    description = 'Dive into TV Wordle, the ultimate guessing game for TV enthusiasts. Test your knowledge of popular TV shows by guessing the mystery show in a limited number of tries. Enjoy a fun and engaging way to explore your favorite TV series and discover new ones.',
  image = '/wordle.png',
  type = 'website',
  structuredData = null,
}: SEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
};

export default SEO;
