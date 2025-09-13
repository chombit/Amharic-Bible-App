import React, { useState } from 'react';
import { BookIcon } from './BookIcon';
import { SearchIcon } from './SearchIcon';
import { MenuIcon } from './MenuIcon';

interface HeaderProps {
  onSearch: (term: string) => void;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onToggleMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-200 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-800">
                <MenuIcon className="h-6 w-6" />
             </button>
            <BookIcon className="h-8 w-8 text-indigo-700 hidden sm:block" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Amharic Bible
            </h1>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-md w-full">
              <form onSubmit={handleSubmit} className="relative text-slate-400 focus-within:text-slate-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="በመጽሐፍ ቅዱስ ውስጥ ይፈልጉ"
                  className="block w-full bg-slate-100 border border-slate-300 rounded-full py-2 pl-10 pr-4 text-sm placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};