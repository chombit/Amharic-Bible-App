import React, { useState, useEffect, useMemo } from 'react';
import { Verse } from '../types';
import { CopyIcon } from './CopyIcon';
import { ShareIcon } from './ShareIcon';
import { CloseIcon } from './CloseIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  verses: Verse[];
  book: string;
  chapter: number;
}

const getVerseRange = (verses: Verse[]): string => {
  if (!verses.length) return '';
  const verseNumbers = verses.map(v => v.verseNumber);

  let rangeStr = '';
  let start = verseNumbers[0];

  for (let i = 0; i < verseNumbers.length; i++) {
    const current = verseNumbers[i];
    const next = verseNumbers[i + 1];

    if (next === undefined || next > current + 1) {
      if (rangeStr) rangeStr += ', ';
      rangeStr += start === current ? `${start}` : `${start}-${current}`;
      if (next !== undefined) {
        start = next;
      }
    }
  }
  return rangeStr;
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  verses,
  book,
  chapter,
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const formattedText = useMemo(() => {
    if (!verses.length) return '';
    const verseRange = getVerseRange(verses);
    const versesText = verses.map(v => v.text).join(' ');
    return `"${versesText}"\n\n— ${book} ${chapter}:${verseRange}`;
  }, [verses, book, chapter]);
  
  const reference = useMemo(() => {
      const verseRange = getVerseRange(verses);
      return `${book} ${chapter}:${verseRange}`;
  }, [verses, book, chapter]);

  useEffect(() => {
    if (!isOpen) {
      setCopyStatus('idle');
      return;
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bible Verses from ${book} ${chapter}`,
          text: formattedText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Web Share API is not supported in your browser. Try copying the text instead.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4 backdrop-blur-sm" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <h2 id="share-modal-title" className="text-2xl font-bold text-slate-800">Share Verses</h2>
              <button 
                  onClick={onClose} 
                  className="text-slate-400 hover:text-slate-600 p-1 -mt-1 -mr-1"
                  aria-label="Close"
              >
                  <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200 mb-6">
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  {verses.map(v => v.text).join(' ')}
                </p>
                <p className="text-right font-bold text-slate-600 tracking-wide">
                  — {reference}
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <CopyIcon className="w-5 h-5 mr-2" />
                {copyStatus === 'copied' ? 'Copied!' : 'Copy Text'}
              </button>
              {navigator.share && (
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Share
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};