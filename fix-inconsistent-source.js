// Скрипт для удаления inconsistent source из Hasura
// Запуск: node fix-inconsistent-source.js

require('dotenv').config();
const axios = require('axios');

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://hasyx.hasura.app/v1';
const HASURA_SECRET = process.env.HASURA_ADMIN_SECRET;

if (!HASURA_SECRET) {
  console.error('❌ HASURA_ADMIN_SECRET не установлен');
  process.exit(1);
}

async function fixInconsistentSource() {
  try {
    console.log('🔍 Проверяю inconsistent metadata...');
    
    // Получить inconsistent metadata
    const response = await axios.post(
      `${HASURA_URL}/metadata`,
      {
        type: 'get_inconsistent_metadata',
        args: {}
      },
      {
        headers: {
          'x-hasura-admin-secret': HASURA_SECRET
        }
      }
    );
    
    const inconsistent = response.data;
    
    if (!inconsistent.inconsistent_objects || inconsistent.inconsistent_objects.length === 0) {
      console.log('✅ Нет inconsistent объектов');
      return;
    }
    
    console.log(`📋 Найдено ${inconsistent.inconsistent_objects.length} inconsistent объектов:`);
    inconsistent.inconsistent_objects.forEach(obj => {
      console.log(`  - ${obj.type}: ${obj.name || obj.definition || 'unknown'}`);
      if (obj.reason) {
        console.log(`    Причина: ${obj.reason}`);
      }
    });
    
    // Удалить inconsistent metadata
    console.log('\n🗑️ Удаляю inconsistent metadata...');
    const dropResponse = await axios.post(
      `${HASURA_URL}/metadata`,
      {
        type: 'drop_inconsistent_metadata',
        args: {}
      },
      {
        headers: {
          'x-hasura-admin-secret': HASURA_SECRET
        }
      }
    );
    
    console.log('✅ Inconsistent metadata удален');
    console.log('\n💡 Теперь можно подключить базу через Connection Parameters в Hasura Console');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
    process.exit(1);
  }
}

fixInconsistentSource();

