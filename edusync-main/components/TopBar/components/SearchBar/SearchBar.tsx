'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSnackbar } from '@/context/SnackbarContext';
import { useRouter } from 'next/navigation';
import './SearchBar.css';

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient());
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const initializeSearchData = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.current.auth.getSession();
        
        if (!session) {
          return;
        }

        // Check if data exists
        const { data: existingData, error: checkError } = await supabase.current
          .from('search_suggestions')
          .select('count')
          .single();

        if (checkError) {
          throw new Error(`Failed to check existing data: ${checkError.message}`);
        }
      } catch (error: any) {
        showSnackbar('Failed to initialize search suggestions', 'error');
        console.error('Search initialization error:', error.message);
      }
    };

    initializeSearchData();
  }, [showSnackbar]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        const { data, error } = await supabase.current
          .from('search_suggestions')
          .select('*')
          .ilike('title', `%${searchQuery}%`)
          .limit(5);

        if (error) {
          showSnackbar('Failed to fetch search suggestions', 'error');
          setSuggestions([]);
          return;
        }

        setSuggestions(data || []);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery, showSnackbar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigateToSearch = (searchText: string) => {
    if (searchText) {
      router.push(`/protected/search/${encodeURIComponent(searchText)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        const selectedSuggestion = suggestions[selectedIndex];
        setSearchQuery(selectedSuggestion.title);
        setShowSuggestions(false);
        navigateToSearch(selectedSuggestion.title);
      } else if (searchQuery) {
        // Navigate with current search query if no suggestion is selected
        navigateToSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    navigateToSearch(suggestion.title);
  };

  return (
    <div className="search-container" ref={containerRef}>
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span>{suggestion.title}</span>
              <span className="suggestion-category">{suggestion.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
