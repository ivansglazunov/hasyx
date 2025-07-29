interface IssueRelations {
  [relationName: string]: string[];
}

interface ParsedIssue {
  content: string;
  relations: IssueRelations;
}

/**
 * Извлекает ссылки на issues и commits из текста
 */
function extractReferences(text: string): { issues: string[], commits: string[] } {
  const issues: string[] = [];
  const commits: string[] = [];

  // Ищем ссылки на issues (#123, #456)
  const issuePattern = /#(\d+)/g;
  let match;
  while ((match = issuePattern.exec(text)) !== null) {
    issues.push(`issue:${match[1]}`);
  }

  // Ищем ссылки на commits (commit:abc123, commit:def456)
  const commitPattern = /commit:([a-f0-9]+)/gi;
  while ((match = commitPattern.exec(text)) !== null) {
    commits.push(`commit:${match[1]}`);
  }

  return { issues: [...new Set(issues)], commits: [...new Set(commits)] };
}

/**
 * Парсит тело issue и извлекает релейшены из сворачиваемого блока в конце
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
      
      // Удаляем блок с релейшенами из контента и убираем лишние переносы строк
      content = body.replace(collapsibleBlockRegex, '').trim();
    } catch (error) {
      console.error('Failed to parse relations JSON:', error);
      // В случае ошибки парсинга JSON, возвращаем весь контент
      content = body.trim();
    }
  } else {
    // Если блок не найден, возвращаем весь контент как content
    content = body.trim();
  }

  // Извлекаем ссылки из контента и добавляем их в relations
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
 * Генерирует полное тело issue с релейшенами в сворачиваемом блоке в конце
 * Возвращает строку, готовую для сохранения в GitHub
 * Ключи 'issues' и 'commits' не попадают в метаблок
 */
export function generateIssue(content: string, relations: IssueRelations): string {
  if (!content && Object.keys(relations).length === 0) {
    return '';
  }

  let body = content.trim();

  // Фильтруем relations, убирая автоматически извлеченные ключи
  const filteredRelations = { ...relations };
  delete filteredRelations.issues;
  delete filteredRelations.commits;

  // Добавляем блок с релейшенами только если они есть
  if (Object.keys(filteredRelations).length > 0) {
    const relationsJson = JSON.stringify(filteredRelations, null, 2);
    const relationsBlock = `\n\n<details>\n<summary>Relations</summary>\n\`\`\`json\n${relationsJson}\n\`\`\`\n</details>`;
    body += relationsBlock;
  }

  return body;
} 