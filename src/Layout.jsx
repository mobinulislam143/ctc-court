import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import AnniversaryPopup from '@/components/AnniversaryPopup';

export default function Layout({ children, currentPageName }) {
  return (
    <HelmetProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
          input, select, textarea, button {
            font-size: 16px !important;
          }
          * { -webkit-text-size-adjust: 100%; }
        `}</style>
      </Helmet>
      {children}
      <AnniversaryPopup />
    </HelmetProvider>
  );
}