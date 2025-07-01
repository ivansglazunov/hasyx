#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface Roadstep {
  symbol: string;
  name: string;
  required?: string[];
  available?: string[];
}

// Регулярное выражение для поиска комментариев /*😈{...}*/
const ROADMAP_REGEX = /\/\*😈(\{[\s\S]*?\})\*\//g;

// Расширения файлов для сканирования
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Папки для исключения из сканирования
const EXCLUDE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '.vercel'];

function parseRoadstepJson(jsonStr: string): Roadstep | null {
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Валидация обязательных полей
    if (!parsed.symbol || !parsed.name) {
      throw new Error('Отсутствуют обязательные поля symbol или name');
    }
    
    // Проверяем тип символа
    const validSymbols = ['🟢', '🟡', '🟠', '🔴', '⚪'];
    if (!validSymbols.includes(parsed.symbol)) {
      console.warn(`⚠️  Неизвестный символ: ${parsed.symbol}`);
    }
    
    return {
      symbol: parsed.symbol,
      name: parsed.name,
      required: Array.isArray(parsed.required) ? parsed.required : undefined,
      available: Array.isArray(parsed.available) ? parsed.available : undefined,
    };
  } catch (error: any) {
    throw new Error(`Невалидный JSON: ${error.message}`);
  }
}

function shouldScanFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return SCAN_EXTENSIONS.includes(ext);
}

function shouldScanDirectory(dirName: string): boolean {
  return !EXCLUDE_DIRS.includes(dirName) && !dirName.startsWith('.');
}

function scanDirectory(dirPath: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (shouldScanDirectory(entry.name)) {
          files.push(...scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        if (shouldScanFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Не удалось прочитать директорию ${dirPath}: ${error}`);
  }
  
  return files;
}

function parseRealFiles(rootDir: string = '.'): Roadstep[] {
  const roadsteps: Roadstep[] = [];
  
  console.log('🚀 Начинаю сканирование файлов проекта...');
  
  // Получаем список всех файлов для сканирования
  const files = scanDirectory(rootDir);
  console.log(`📁 Найдено ${files.length} файлов для сканирования`);
  
  let scannedFiles = 0;
  let filesWithRoadsteps = 0;
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      scannedFiles++;
      
      const matches = Array.from(content.matchAll(ROADMAP_REGEX));
      
      if (matches.length > 0) {
        filesWithRoadsteps++;
        console.log(`📄 Найдено ${matches.length} roadstep(s) в ${filePath}`);
        
        for (const match of matches) {
          try {
            // Парсим JSON из комментария
            const jsonStr = match[1];
            console.log(`🔍 Попытка парсинга JSON: "${jsonStr.substring(0, 80)}${jsonStr.length > 80 ? '...' : ''}"`);
            const roadstep = parseRoadstepJson(jsonStr);
            
            if (roadstep) {
              // Проверяем на дубликаты
              const existing = roadsteps.find(r => r.name === roadstep.name);
              if (existing) {
                console.warn(`⚠️  Дубликат roadstep '${roadstep.name}' в ${filePath}`);
              } else {
                roadsteps.push(roadstep);
                console.log(`  ✅ ${roadstep.symbol} ${roadstep.name}`);
              }
            }
          } catch (error: any) {
            console.error(`❌ Ошибка парсинга roadstep в ${filePath}: ${match[0]}`);
            console.error(`   ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Не удалось прочитать файл ${filePath}: ${error}`);
    }
  }
  
  // Сортируем по имени для консистентности
  roadsteps.sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`\n📊 Статистика сканирования:`);
  console.log(`   Всего файлов просканировано: ${scannedFiles}`);
  console.log(`   Файлов с roadstep'ами: ${filesWithRoadsteps}`);
  console.log(`   Найдено roadstep'ов: ${roadsteps.length}`);
  
  return roadsteps;
}

function printReport(roadsteps: Roadstep[]): void {
  console.log('\n📋 Детальный отчет:');
  console.log('='.repeat(50));
  
  const groupedBySymbol = roadsteps.reduce((acc, step) => {
    if (!acc[step.symbol]) acc[step.symbol] = [];
    acc[step.symbol].push(step);
    return acc;
  }, {} as Record<string, Roadstep[]>);
  
  Object.entries(groupedBySymbol).forEach(([symbol, steps]) => {
    console.log(`\n${symbol} (${steps.length}):`);
    steps.forEach(step => {
      console.log(`  • ${step.name}`);
      if (step.required?.length) {
        console.log(`    Требует: ${step.required.join(', ')}`);
      }
      if (step.available?.length) {
        console.log(`    Предоставляет: ${step.available.join(', ')}`);
      }
    });
  });
  
  // Статистика
  const stats = roadsteps.reduce((acc, step) => {
    acc[step.symbol] = (acc[step.symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📈 Статистика по символам:');
  Object.entries(stats).forEach(([symbol, count]) => {
    console.log(`   ${symbol} ${count}`);
  });
}

function writeRoadmapJson(roadsteps: Roadstep[], outputPath: string = 'lib/roadmap.json'): void {
  try {
    const jsonContent = JSON.stringify(roadsteps, null, 2);
    fs.writeFileSync(outputPath, jsonContent, 'utf-8');
    console.log(`\n💾 Roadmap сохранен в ${outputPath}`);
  } catch (error) {
    console.error(`❌ Ошибка записи файла ${outputPath}: ${error}`);
  }
}

// Основная функция
function main() {
  try {
    const roadsteps = parseRealFiles();
    printReport(roadsteps);
    
    // Записываем JSON в файл
    writeRoadmapJson(roadsteps);
    
    // Также выводим JSON в консоль
    const jsonContent = JSON.stringify(roadsteps, null, 2);
    console.log('\n💾 Сгенерированный roadmap.json:');
    console.log(jsonContent);
    
    console.log('\n🎉 Парсинг завершен успешно!');
    return roadsteps;
  } catch (error: any) {
    console.error('💥 Критическая ошибка:', error.message);
    return [];
  }
}

// Запускаем если файл вызван напрямую
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

export { parseRealFiles, printReport, main, writeRoadmapJson, type Roadstep };