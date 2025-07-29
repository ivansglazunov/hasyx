import { parseIssue, generateIssue } from './issues';

describe('issues', () => {
  describe('parseIssue', () => {
    it('should parse issue with relations block', () => {
      const body = `## Problem
This is a test issue.

## Solution
Fix the problem.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": ["issue:123", "commit:abc123"],
  "blocks": ["issue:456"],
  "related_to": ["issue:789"]
}
\`\`\`
</details>`;

      const result = parseIssue(body);

      expect(result.content).toBe(`## Problem
This is a test issue.

## Solution
Fix the problem.`);
      expect(result.relations).toEqual({
        depends_on: ["issue:123", "commit:abc123"],
        blocks: ["issue:456"],
        related_to: ["issue:789"]
      });
    });

    it('should extract references from content and add to relations', () => {
      const body = `## Problem
This issue references #123 and #456.

## Solution
Also mentions commit:abc123 and commit:def456.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": ["issue:789"]
}
\`\`\`
</details>`;

      const result = parseIssue(body);

      expect(result.content).toBe(`## Problem
This issue references #123 and #456.

## Solution
Also mentions commit:abc123 and commit:def456.`);
      expect(result.relations).toEqual({
        depends_on: ["issue:789"],
        issues: ["issue:123", "issue:456"],
        commits: ["commit:abc123", "commit:def456"]
      });
    });

    it('should extract references from content without relations block', () => {
      const body = `## Problem
This issue references #123 and #456.

## Solution
Also mentions commit:abc123 and commit:def456.`;

      const result = parseIssue(body);

      expect(result.content).toBe(body);
      expect(result.relations).toEqual({
        issues: ["issue:123", "issue:456"],
        commits: ["commit:abc123", "commit:def456"]
      });
    });

    it('should handle issue without relations block', () => {
      const body = `## Problem
This is a test issue.

## Solution
Fix the problem.`;

      const result = parseIssue(body);

      expect(result.content).toBe(body);
      expect(result.relations).toEqual({});
    });

    it('should handle empty body', () => {
      const result = parseIssue('');

      expect(result.content).toBe('');
      expect(result.relations).toEqual({});
    });

    it('should handle invalid JSON in relations block', () => {
      const body = `## Problem
This is a test issue.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": ["issue:123",
  "blocks": ["issue:456"]
}
\`\`\`
</details>`;

      const result = parseIssue(body);

      // При ошибке парсинга JSON возвращается весь контент
      expect(result.content).toBe(body);
      expect(result.relations).toEqual({});
    });
  });

  describe('generateIssue', () => {
    it('should generate issue with relations block', () => {
      const content = `## Problem
This is a test issue.

## Solution
Fix the problem.`;

      const relations = {
        depends_on: ["issue:123", "commit:abc123"],
        blocks: ["issue:456"],
        related_to: ["issue:789"]
      };

      const result = generateIssue(content, relations);

      expect(result).toBe(`## Problem
This is a test issue.

## Solution
Fix the problem.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": [
    "issue:123",
    "commit:abc123"
  ],
  "blocks": [
    "issue:456"
  ],
  "related_to": [
    "issue:789"
  ]
}
\`\`\`
</details>`);
    });

    it('should filter out issues and commits from relations block', () => {
      const content = `## Problem
This is a test issue.

## Solution
Fix the problem.`;

      const relations = {
        depends_on: ["issue:123", "commit:abc123"],
        blocks: ["issue:456"],
        issues: ["issue:789", "issue:101"],
        commits: ["commit:def456", "commit:ghi789"]
      };

      const result = generateIssue(content, relations);

      expect(result).toBe(`## Problem
This is a test issue.

## Solution
Fix the problem.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": [
    "issue:123",
    "commit:abc123"
  ],
  "blocks": [
    "issue:456"
  ]
}
\`\`\`
</details>`);
    });

    it('should generate issue without relations block when relations are empty', () => {
      const content = `## Problem
This is a test issue.`;

      const relations = {};

      const result = generateIssue(content, relations);

      expect(result).toBe(`## Problem
This is a test issue.`);
    });

    it('should handle empty content and relations', () => {
      const result = generateIssue('', {});

      expect(result).toBe('');
    });
  });

  describe('roundtrip', () => {
    it('should preserve content and relations through parse and generate', () => {
      const originalContent = `## Problem
This is a test issue.

## Solution
Fix the problem.`;

      const originalRelations = {
        depends_on: ["issue:123", "commit:abc123"],
        blocks: ["issue:456"]
      };

      const generatedBody = generateIssue(originalContent, originalRelations);
      const { content, relations } = parseIssue(generatedBody);

      expect(content).toBe(originalContent);
      expect(relations).toEqual(originalRelations);
    });

    it('should handle roundtrip with extracted references', () => {
      const originalContent = `## Problem
This issue references #123 and #456.

## Solution
Also mentions commit:abc123 and commit:def456.`;

      const originalRelations = {
        depends_on: ["issue:789"],
        issues: ["issue:123", "issue:456"],
        commits: ["commit:abc123", "commit:def456"]
      };

      const generatedBody = generateIssue(originalContent, originalRelations);
      const { content, relations } = parseIssue(generatedBody);

      expect(content).toBe(originalContent);
      // При roundtrip автоматически извлеченные ссылки сохраняются
      expect(relations).toEqual(originalRelations);
    });
  });

  describe('integration with database data', () => {
    it('should handle real issue data with references', () => {
      const realIssueBody = `## Problem
Currently, our project's environment variables are managed through npx hasyx assist.

## Solution
Introduce a centralized environment configuration file.

This relates to #123 and #456, and builds on commit:abc123.

<details>
<summary>Relations</summary>
\`\`\`json
{
  "depends_on": ["issue:789"],
  "blocks": ["issue:101"]
}
\`\`\`
</details>`;

      const { content, relations } = parseIssue(realIssueBody);

      // Проверяем, что контент не содержит блок с релейшенами
      expect(content).not.toContain('<details>');
      expect(content).not.toContain('Relations');
      expect(content).not.toContain('```json');

      // Проверяем, что релейшены извлечены правильно
      expect(relations).toEqual({
        depends_on: ["issue:789"],
        blocks: ["issue:101"],
        issues: ["issue:123", "issue:456"],
        commits: ["commit:abc123"]
      });

      // Проверяем, что при генерации автоматические ключи не попадают в метаблок
      const regeneratedBody = generateIssue(content, relations);
      expect(regeneratedBody).toContain('depends_on');
      expect(regeneratedBody).toContain('blocks');
      expect(regeneratedBody).not.toContain('"issues"');
      expect(regeneratedBody).not.toContain('"commits"');
    });
  });
}); 