import React from 'react';
import { BookIcon } from './BookIcon';

export const WelcomeView: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white">
            <BookIcon className="h-24 w-24 text-indigo-200 mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-2 font-sans">Welcome to the Amharic Bible</h2>
            <p className="text-lg text-slate-500 max-w-md">
                Select a book from the sidebar to begin your reading and study journey.
            </p>
        </div>
    );
};
