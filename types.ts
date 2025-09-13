export interface Verse {
  verseNumber: number;
  text: string;
}

export interface ChapterContent {
  verses: Verse[];
}

export interface SearchResult {
  book: string;
  chapter: number;
  verseNumber: number;
  text: string;
}

export enum ViewMode {
  CHAPTER = 'CHAPTER',
  SEARCH = 'SEARCH',
}
