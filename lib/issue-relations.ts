import { parseIssue, generateIssue } from 'hasyx/lib/issues';

export async function updateIssueRelations(
  sourceIssueData: any, 
  targetIssueData: any, 
  relationType: string,
  hasyx: any
) {
  console.log('updateIssueRelations called with:', {
    sourceIssueData,
    targetIssueData,
    relationType
  });
  
  // Получаем полные данные target issue по github_id
  const { data: targetIssues } = await hasyx.query({
    table: 'github_issues',
    where: { github_id: { _eq: targetIssueData.github_id } },
    returning: ['id', 'github_id', 'number', 'title']
  });
  
  if (!targetIssues || targetIssues.length === 0) {
    console.error('Target issue not found:', targetIssueData.github_id);
    return;
  }
  
  const targetIssue = targetIssues[0];
  
  // Парсим текущее тело source issue
  const { content, relations } = parseIssue(sourceIssueData.body || '');
  
  // Добавляем новую связь
  if (!relations[relationType]) {
    relations[relationType] = [];
  }
  
  // Добавляем ссылку на target issue
  const targetReference = `issue:${targetIssue.number}`;
  if (!relations[relationType].includes(targetReference)) {
    relations[relationType].push(targetReference);
  }
  
  // Генерируем новое тело issue
  const newBody = generateIssue(content, relations);
  
  // Обновляем issue в базе данных
  await hasyx.update({
    table: 'github_issues',
    where: { id: { _eq: sourceIssueData.id } },
    _set: { body: newBody }
  });
} 