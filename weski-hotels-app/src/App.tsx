import React, { useState, useCallback, useRef } from 'react'
import NavBar from './components/navbar/nav-bar'
import Results from './components/results/results'
import { streamSearchResults } from './services/search-service'
import { SearchParams, Hotel } from './types'

const App: React.FC = () => {
  const [results, setResults] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  // Keep a ref to the current stream's abort function so we can cancel it
  // if a new search is triggered before the previous one finishes.
  const cancelCurrentSearch = useRef<(() => void) | null>(null);

  const handleSearch = useCallback((params: SearchParams) => {
    // Cancel any in-flight search
    cancelCurrentSearch.current?.();

    setResults([]);
    setError(null);
    setIsLoading(true);
    setSearchParams(params);

    const cancel = streamSearchResults(
      params,
      (batch) => setResults((prev) => [...prev, ...(batch as Hotel[])]),
      () => setIsLoading(false),
      (message) => {
        setError(message);
        setIsLoading(false);
      }
    );

    cancelCurrentSearch.current = cancel;
  }, []);

  return (
    <div className='app'>
      <NavBar onSearch={handleSearch} />
      {searchParams && (
        <Results
          results={results}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
        />
      )}
    </div>
  )
}

export default App
