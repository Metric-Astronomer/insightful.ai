declare module '@mozilla/readability' {
  export class Readability {
    constructor(doc: Document, options?: {
      debug?: boolean;
      nbTopCandidates?: number;
      charThreshold?: number;
    });
    
    parse(): {
      title: string;
      content: string;
      textContent: string;
      length: number;
      excerpt: string;
      byline: string | null;
      dir: string;
      siteName: string | null;
      lang: string | null;
    } | null;
  }
}