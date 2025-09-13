import React from 'react';
import { ChapterContent, Verse } from '../types';
import { BOOK_CHAPTERS } from '../constants';
import { ShareIcon } from './ShareIcon';

interface ChapterViewProps {
  book: string;
  chapter: number;
  content: ChapterContent | null;
  onSelectChapter: (chapter: number) => void;
  fontSizeStep: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  selectedVerses: Verse[];
  onSelectVerse: (verse: Verse) => void;
  onOpenShareModal: () => void;
}

const fontSizeClasses: { [key: number]: string } = {
  [-2]: 'text-sm',
  [-1]: 'text-base',
  [0]: 'text-lg',
  [1]: 'text-xl',
  [2]: 'text-2xl',
};

const FONT_SIZE_MIN = -2;
const FONT_SIZE_MAX = 2;

export const ChapterView: React.FC<ChapterViewProps> = ({
  book,
  chapter,
  content,
  onSelectChapter,
  fontSizeStep,
  onIncreaseFontSize,
  onDecreaseFontSize,
  selectedVerses,
  onSelectVerse,
  onOpenShareModal,
}) => {
  const totalChapters = BOOK_CHAPTERS[book] || 1;
  const chapterOptions = Array.from({ length: totalChapters }, (_, i) => i + 1);
  const textClass = fontSizeClasses[fontSizeStep] || 'text-lg';

  const handleShareChapter = async () => {
    const shareText = `Check out ${book} chapter ${chapter} in the Amharic Bible.`;
    const shareTitle = `Amharic Bible: ${book} ${chapter}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing chapter:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${book} ${chapter}`);
        alert('Chapter reference copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy chapter reference:', err);
        alert('Could not copy chapter reference.');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <h2 className="text-3xl font-bold text-slate-800 shrink-0 font-sans">
          {book} {chapter}
        </h2>
        <div className="flex items-center justify-end flex-wrap gap-3 sm:gap-4 font-sans">
          <div className="flex items-center space-x-2">
            <label htmlFor="chapter-select" className="text-sm font-medium text-slate-600">ምዕራፍ:</label>
            <select
              id="chapter-select"
              value={chapter}
              onChange={(e) => onSelectChapter(parseInt(e.target.value, 10))}
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5"
            >
              {chapterOptions.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Aa</span>
            <button
              onClick={onDecreaseFontSize}
              disabled={fontSizeStep <= FONT_SIZE_MIN}
              className="w-8 h-8 flex items-center justify-center bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease font size"
            >
              <span className="text-2xl leading-none font-thin mb-1">-</span>
            </button>
            <button
              onClick={onIncreaseFontSize}
              disabled={fontSizeStep >= FONT_SIZE_MAX}
              className="w-8 h-8 flex items-center justify-center bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase font size"
            >
              <span className="text-xl leading-none font-thin mb-1">+</span>
            </button>
          </div>
          <button
            onClick={handleShareChapter}
            className="flex items-center justify-center px-3 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors text-sm font-medium"
            aria-label="Share this chapter"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            <span>Share</span>
          </button>
        </div>
      </div>
      <div className={`${textClass} max-w-4xl mx-auto text-slate-800 leading-loose space-y-2`}>
        {content?.verses.map((verse) => {
          const isSelected = selectedVerses.some(v => v.verseNumber === verse.verseNumber);
          return (
             <p
              key={verse.verseNumber}
              onClick={() => onSelectVerse(verse)}
              className={`mb-2 p-2 -mx-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-100'}`}
            >
              <span className="font-bold text-indigo-600/70 mr-2 text-sm absolute -left-6 top-3 select-none">{verse.verseNumber}</span>
              {verse.text}
            </p>
          );
        })}
      </div>
      
      {selectedVerses.length > 0 && (
        <button
            onClick={onOpenShareModal}
            className="fixed bottom-8 right-8 z-10 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            aria-label="Share selected verses"
        >
            <ShareIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};