#!/usr/bin/env tsx

interface Roadstep {
  symbol: string;
  name: string;
  required?: string[];
  available?: string[];
}

// Регулярное выражение для поиска комментариев /*😈{...}*/
const ROADMAP_REGEX = /\/\*😈(\{[\s\S]*?\})\*\//g;

// Примеры комментариев для тестирования
const testFiles = [
  {
    path: 'lib/pwa.ts',
    content: `/*😈{"symbol":"🟠","name":"PWA","required":["server-client"],"available":["notifications","install-prompt","offline-support"]}*/`
  },
  {
    path: 'lib/apollo.tsx', 
    content: `/*😈{"symbol":"🟢","name":"apollo","required":["class-hasura"],"available":["lib","graphql-subscriptions"]}*/`
  },
  {
    path: 'lib/hasura.ts',
    content: `/*😈{"symbol":"🟢","name":"class-hasura","required":["lib"],"available":["migrations","apollo","graphql-proxy"]}*/`
  },
  {
    path: 'lib/generator.ts',
    content: `/*😈{"symbol":"🟢","name":"generator-hasyx","required":["class-hasura"],"available":["lib","graphql-generation"]}*/`
  },
  {
    path: 'lib/next-auth-options.ts',
    content: `/*😈{"symbol":"🟢","name":"next-auth","required":[],"available":["google-auth","yandex-auth","vk-auth","telegram-auth","telegram-miniapp-auth"]}*/`
  },
  {
    path: 'lib/telegram-miniapp.tsx',
    content: `/*😈{"symbol":"🟠","name":"telegram-miniapp-auth","required":["next-auth"],"available":["telegram-auth"]}*/`
  },
  {
    path: 'app/page.tsx',
    content: `/*😈{"symbol":"🟢","name":"nextjs","required":[],"available":["cli","server-client","client"]}*/`
  }
];

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

function parseTestFiles(): Roadstep[] {
  const roadsteps: Roadstep[] = [];
  
  console.log('🚀 Начинаю парсинг тестовых файлов...');
  
  for (const file of testFiles) {
    const matches = Array.from(file.content.matchAll(ROADMAP_REGEX));
    
    if (matches.length > 0) {
      console.log(`📄 Найдено ${matches.length} roadstep(s) в ${file.path}`);
      
      for (const match of matches) {
        try {
          // Парсим JSON из комментария
          const jsonStr = match[1];
          console.log(`🔍 Попытка парсинга JSON: "${jsonStr}"`);
          const roadstep = parseRoadstepJson(jsonStr);
          
          if (roadstep) {
            // Проверяем на дубликаты
            const existing = roadsteps.find(r => r.name === roadstep.name);
            if (existing) {
              console.warn(`⚠️  Дубликат roadstep '${roadstep.name}' в ${file.path}`);
            } else {
              roadsteps.push(roadstep);
              console.log(`  ✅ ${roadstep.symbol} ${roadstep.name}`);
            }
          }
        } catch (error: any) {
          console.error(`❌ Ошибка парсинга roadstep в ${file.path}: ${match[0]}`);
          console.error(`   ${error.message}`);
        }
      }
    }
  }
  
  // Сортируем по имени для консистентности
  roadsteps.sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`📊 Найдено roadstep'ов: ${roadsteps.length}`);
  
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

// Основная функция
function main() {
  try {
    const roadsteps = parseTestFiles();
    printReport(roadsteps);
    
    // Генерируем JSON
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

export { parseTestFiles, printReport, main, type Roadstep };