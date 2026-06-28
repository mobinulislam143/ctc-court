import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  structuredData 
}) {
  const siteUrl = 'https://coasttocoastcourts.com';
  const defaultImage = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png';
  
  const fullTitle = title ? `${title} | Coast to Coast Courts` : 'Coast to Coast Courts - Premium Modular Court Flooring & Basketball Court Tiles';
  const metaDescription = description || 'Design custom basketball, pickleball & multi-sport courts with premium interlocking modular tiles. DIY-friendly installation, UV-protected, all-weather flooring. Get instant pricing!';
  const metaKeywords = keywords || 'modular court tiles, basketball court flooring, pickleball court tiles, interlocking court tiles, DIY court installation, outdoor court flooring, garage floor tiles, multi-sport court';
  const image = ogImage || defaultImage;
  const url = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Coast to Coast Courts" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Business Information */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}