export interface CodeExample {
  code: string;
  language: string;
  title?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface SlideContent {
  overline: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  features?: Feature[];
  codeExamples?: CodeExample[];
  tables?: TableData[];
  keyTakeaway?: string;
  notes?: string[];
}

export interface Section {
  id: string;
  path: string;
  title: string;
  shortTitle: string;
  slides: SlideContent[];
}
