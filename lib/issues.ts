interface IssueRelations {
  [relationName: string]: string[];
}

interface ParsedIssue {
  content: string;
  relations: IssueRelations;
}

/**
 * Extract references to issues and commits from text
 */
function extractReferences(text: string): { issues: string[], commits: string[] } {
  const issues: string[] = [];
  const commits: string[] = [];

  // Find issue references (#123, #456)
  const issuePattern = /#(\d+)/g;
  let match;
  while ((match = issuePattern.exec(text)) !== null) {
    issues.push(`issue:${match[1]}`);
  }

  // Find commit references (commit:abc123, commit:def456)
  const commitPattern = /commit:([a-f0-9]+)/gi;
  while ((match = commitPattern.exec(text)) !== null) {
    commits.push(`commit:${match[1]}`);
  }

  return { issues: [...new Set(issues)], commits: [...new Set(commits)] };
}

/**
 * Parse issue body and extract relations from the collapsible block at the end
 */
export function parseIssue(body: string): ParsedIssue {
  if (!body) {
    return { content: '', relations: {} };
  }

  // Ищем сворачиваемый блок в конце файла
  const collapsibleBlockRegex = /<details>\s*<summary>Relations<\/summary>\s*```json\s*(\{[\s\S]*?\})\s*```\s*<\/details>\s*$/;
  const match = body.match(collapsibleBlockRegex);

  let content: string;
  let relations: IssueRelations = {};

  if (match) {
    try {
      const relationsJson = match[1];
      relations = JSON.parse(relationsJson);
      
      // Remove relations block from content and trim extra newlines
      content = body.replace(collapsibleBlockRegex, '').trim();
    } catch (error) {
      console.error('Failed to parse relations JSON:', error);
      // On JSON parse error, return full content
      content = body.trim();
    }
  } else {
    // If block not found, return full content as content
    content = body.trim();
  }

  // Extract references from content and add to relations
  const { issues, commits } = extractReferences(content);
  
  if (issues.length > 0) {
    relations.issues = issues;
  }
  if (commits.length > 0) {
    relations.commits = commits;
  }

  return { content, relations };
}

/**
 * Generate full issue body with relations inside a collapsible block at the end
 * Returns a string ready for GitHub
 * Keys 'issues' and 'commits' are not included in the meta block
 */
export function generateIssue(content: string, relations: IssueRelations): string {
  if (!content && Object.keys(relations).length === 0) {
    return '';
  }

  let body = content.trim();

  // Filter relations, removing auto-extracted keys
  const filteredRelations = { ...relations };
  delete filteredRelations.issues;
  delete filteredRelations.commits;

  // Append relations block only if non-empty
  if (Object.keys(filteredRelations).length > 0) {
    const relationsJson = JSON.stringify(filteredRelations, null, 2);
    const relationsBlock = `\n\n<details>\n<summary>Relations</summary>\n\`\`\`json\n${relationsJson}\n\`\`\`\n</details>`;
    body += relationsBlock;
  }

  return body;
} 