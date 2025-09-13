import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BookList } from './components/BookList';
import { ChapterView } from './components/ChapterView';
import { SearchView } from './components/SearchView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ShareModal } from './components/ShareModal';
import { WelcomeView } from './components/WelcomeView';
import { getChapter, searchBible } from './services/geminiService';
import { ChapterContent, SearchResult, ViewMode, Verse } from './types';

function App() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [view, setView] = useState<ViewMode>(ViewMode.CHAPTER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSizeStep, setFontSizeStep] = useState<number>(0);
  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const FONT_SIZE_MIN = -2;
  const FONT_SIZE_MAX = 2;

  const handleIncreaseFontSize = () => {
    setFontSizeStep(prev => Math.min(prev + 1, FONT_SIZE_MAX));
  };

  const handleDecreaseFontSize = () => {
    setFontSizeStep(prev => Math.max(prev - 1, FONT_SIZE_MIN));
  };

  const fetchChapterContent = useCallback(async (book: string, chapter: number) => {
    setIsLoading(true);
    setError(null);
    setChapterContent(null);
    try {
      const content = await getChapter(book, chapter);
      // Ensure verses are sorted and numbered correctly, overriding any API inconsistencies.
      const correctlyNumberedContent: ChapterContent = {
        ...content,
        verses: content.verses
          .sort((a, b) => a.verseNumber - b.verseNumber) // Sort by original number first.
          .map((verse, index) => ({ // Then, re-number sequentially from 1.
            ...verse,
            verseNumber: index + 1
          }))
      };
      setChapterContent(correctlyNumberedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchChapterContent(selectedBook, selectedChapter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, selectedChapter]);

  const handleSelectBook = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setView(ViewMode.CHAPTER);
    setSelectedVerses([]);
    setIsMenuOpen(false); // Close menu on selection
  };

  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setSelectedVerses([]);
  };
  
  const handleSelectVerse = (verse: Verse) => {
    setSelectedVerses(prev => {
        const isSelected = prev.some(v => v.verseNumber === verse.verseNumber);
        if (isSelected) {
            return prev.filter(v => v.verseNumber !== verse.verseNumber);
        } else {
            return [...prev, verse].sort((a, b) => a.verseNumber - b.verseNumber);
        }
    });
  };

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const handleSearch = async (term: string) => {
    setIsLoading(true);
    setError(null);
    setSearchTerm(term);
    setView(ViewMode.SEARCH);
    try {
      const results = await searchBible(term);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
       return (
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg m-8">
          <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (view === ViewMode.SEARCH) {
      return <SearchView term={searchTerm} results={searchResults} />;
    }
    if (!selectedBook || !chapterContent) {
        return <WelcomeView />;
    }
    return (
      <ChapterView
        book={selectedBook}
        chapter={selectedChapter}
        content={chapterContent}
        onSelectChapter={handleSelectChapter}
        fontSizeStep={fontSizeStep}
        onIncreaseFontSize={handleIncreaseFontSize}
        onDecreaseFontSize={handleDecreaseFontSize}
        selectedVerses={selectedVerses}
        onSelectVerse={handleSelectVerse}
        onOpenShareModal={openShareModal}
      />
    );
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900">
      <Header onSearch={handleSearch} onToggleMenu={toggleMenu} />
      <div className="flex-1 flex overflow-hidden">
        <BookList 
            selectedBook={selectedBook || ''} 
            onSelectBook={handleSelectBook} 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-white">
          {renderMainContent()}
        </main>
      </div>
      {selectedBook && (
         <ShareModal 
            isOpen={isShareModalOpen}
            onClose={closeShareModal}
            verses={selectedVerses}
            book={selectedBook}
            chapter={selectedChapter}
          />
      )}
    </div>
  );
}

export default App;