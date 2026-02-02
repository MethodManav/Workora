'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { issues } from '@/lib/demo-data';

interface SearchResult {
  id: string;
  key: string;
  title: string;
  type: string;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      const filtered = issues
        .filter(
          (issue) =>
            issue.title.toLowerCase().includes(value.toLowerCase()) ||
            issue.key.toLowerCase().includes(value.toLowerCase()) ||
            issue.description.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8)
        .map((issue) => ({
          id: issue.id,
          key: issue.key,
          title: issue.title,
          type: issue.type,
        }));
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search issues, projects..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-96 max-w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (query.trim().length > 0 || results.length > 0) && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setResults([]);
            }}
          />

          {/* Results panel */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-border shadow-lg z-50 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Results ({results.length})
                </p>
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                        setResults([]);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">
                          {result.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                            {result.key}: {result.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : query.trim().length > 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
