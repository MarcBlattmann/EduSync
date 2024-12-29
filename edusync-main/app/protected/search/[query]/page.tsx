'use client';

import { use } from 'react';
import './page.css';

interface SearchParams {
  query: string;
}

export default function SearchResultPage({ params }: { params: Promise<SearchParams> }) {
  const resolvedParams = use(params);
  const title = decodeURIComponent(resolvedParams.query);

  return (
    <div className="search-results">
      <h1>{title}</h1>
    </div>
  );
}
