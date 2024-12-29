'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import './page.css';

export default function SearchResults({ params }: { params: Promise<{ query: string }> }) {
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const decodedContent = decodeURIComponent(searchParams.get('content') || '');
  const decodedQuery = decodeURIComponent(resolvedParams.query);

  return (
    <div className="search-results">
      <h1>{decodedQuery}</h1>
      {decodedContent && (
        <div 
          className="search-content"
          dangerouslySetInnerHTML={{ __html: decodedContent }}
        />
      )}
    </div>
  );
}
