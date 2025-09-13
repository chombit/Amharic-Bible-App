import React from 'react';
import { SearchResult } from '../types';

interface SearchViewProps {
  term: string;
  results: SearchResult[];
}

export const SearchView: React.FC<SearchViewProps> = ({ term, results }) => {
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={index} className="bg-yellow-200 text-slate-900 px-1 rounded">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200 font-sans">
        Search Results for: <span className="text-indigo-700">"{term}"</span>
      </h2>
      {results.length === 0 ? (
        <p className="text-slate-500 text-center py-10">No results found for your search.</p>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {results.map((result, index) => (
            <div key={index} className="border-b border-slate-200 pb-6">
              <p className="font-bold text-indigo-700 mb-2 font-sans tracking-wide">
                {result.book} {result.chapter}:{result.verseNumber}
              </p>
              <p className="text-slate-700 leading-relaxed text-lg">{highlightMatch(result.text, term)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};