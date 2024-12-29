'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import './page.css';

export default function SearchResults({ params }: { params: Promise<{ query: string }> }) {
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const content = decodeURIComponent(searchParams.get('content') || '');
  const title = decodeURIComponent(resolvedParams.query);

  return (
    <div className="search-results">
      <h1>{title}</h1>
      {content && (
        <div 
          className="search-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
