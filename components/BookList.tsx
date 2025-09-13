import React from 'react';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../constants';
import { CloseIcon } from './CloseIcon';

interface BookListProps {
  selectedBook: string;
  onSelectBook: (book: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const BookSection: React.FC<{
  title: string;
  books: string[];
  selectedBook: string;
  onSelectBook: (book: string) => void;
}> = ({ title, books, selectedBook, onSelectBook }) => (
  <div className="mb-4">
    <h3 className="text-lg font-bold text-slate-800 px-4 py-2 sticky top-0 bg-slate-100 z-10 font-sans border-b border-slate-200">
      {title}
    </h3>
    <ul className="py-2">
      {books.map((book) => (
        <li key={book}>
          <button
            onClick={() => onSelectBook(book)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all duration-150 ${
              selectedBook === book
                ? 'bg-indigo-100 text-indigo-800 font-bold'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            {book}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const BookList: React.FC<BookListProps> = ({ selectedBook, onSelectBook, isOpen, onClose }) => {
  return (
    <>
    <div className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
    <aside 
      className={`fixed md:relative top-0 left-0 w-72 bg-slate-100 border-r border-slate-200 h-full z-40 transform transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 md:hidden">
            <h2 className="font-bold text-lg text-slate-800 font-sans">Books</h2>
            <button onClick={onClose} className="p-2 -mr-2 text-slate-500 hover:text-slate-800">
                <CloseIcon />
            </button>
        </div>
        <div className="overflow-y-auto h-full pb-16 md:pb-0">
         <BookSection
          title="ብሉይ ኪዳን"
          books={OLD_TESTAMENT_BOOKS}
          selectedBook={selectedBook}
          onSelectBook={onSelectBook}
        />
        <BookSection
          title="አዲስ ኪዳን"
          books={NEW_TESTAMENT_BOOKS}
          selectedBook={selectedBook}
          onSelectBook={onSelectBook}
        />
       </div>
    </aside>
    </>
  );
};