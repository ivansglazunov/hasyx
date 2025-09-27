export interface MarkdownHeading {
  level: number;
  text: string;
  id: string;
}

export interface MarkdownFile {
  filename: string;
  title: string;
  headings: MarkdownHeading[];
  content: string;
  path: string;
}

export interface DocIndex {
  files: MarkdownFile[];
  lastUpdated: string;
}

export interface DocSection {
  title: string;
  items: {
    title: string;
    url: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

export interface DocNavigation {
  items: {
    title: string;
    url: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  lastUpdated: string;
}

/**
 * Converts text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Parses markdown content and extracts headings
 */
export function parseMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text);
      
      headings.push({
        level,
        text,
        id
      });
    }
  }
  
  return headings;
}

/**
 * Gets the first heading from markdown content as title
 */
export function getMarkdownTitle(content: string): string {
  const headings = parseMarkdownHeadings(content);
  return headings.length > 0 ? headings[0].text : 'Untitled';
}

/**
 * Fetches documentation index from public/_doc/index.json
 */
export async function getDocumentationIndex(): Promise<DocIndex> {
  // Documentation is disabled; return empty index
  return { files: [], lastUpdated: new Date().toISOString() };
}

/**
 * Fetches markdown files from documentation index
 */
export async function getMarkdownFiles(): Promise<MarkdownFile[]> {
  const index = await getDocumentationIndex();
  return index.files;
}

/**
 * Creates navigation structure for sidebar from static md.json file
 * This function is kept for backward compatibility but now uses static data
 */
export async function createDocNavigation(): Promise<DocSection> {
  // Documentation is disabled; return empty section
  return { title: "Documentation", items: [] };
}

/**
 * Gets markdown file by filename
 */
export async function getMarkdownFile(filename: string): Promise<MarkdownFile | null> {
  // Documentation is disabled
  return null;
}