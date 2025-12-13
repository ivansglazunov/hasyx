// Скрипт для удаления inconsistent source через API
// Запуск: node remove-inconsistent-source.js

require('dotenv').config();
const axios = require('axios');

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace('/v1/graphql', '') || 'https://hasyx.hasura.app';
const HASURA_SECRET = process.env.HASURA_ADMIN_SECRET;

if (!HASURA_SECRET) {
  console.error('❌ HASURA_ADMIN_SECRET не установлен в .env');
  process.exit(1);
}

async function removeInconsistentSource() {
  try {
    console.log('🔍 Проверяю inconsistent metadata...');
    
    // 1. Получить inconsistent metadata
    const inconsistentResponse = await axios.post(
      `${HASURA_URL}/v1/metadata`,
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
    
    const inconsistent = inconsistentResponse.data;
    
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
    
    // 2. Попробовать удалить source "default" напрямую
    console.log('\n🗑️ Пытаюсь удалить source "default"...');
    try {
      await axios.post(
        `${HASURA_URL}/v1/metadata`,
        {
          type: 'pg_drop_source',
          args: {
            name: 'default',
            cascade: true
          }
        },
        {
          headers: {
            'x-hasura-admin-secret': HASURA_SECRET
          }
        }
      );
      console.log('✅ Source "default" удален');
    } catch (dropError) {
      if (dropError.response?.data?.error?.includes('does not exist')) {
        console.log('ℹ️ Source "default" не существует (возможно уже удален)');
      } else {
        console.log('⚠️ Не удалось удалить source напрямую:', dropError.response?.data?.error || dropError.message);
      }
    }
    
    // 3. Удалить все inconsistent metadata
    console.log('\n🗑️ Удаляю все inconsistent metadata...');
    const dropResponse = await axios.post(
      `${HASURA_URL}/v1/metadata`,
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
    console.log('\n💡 Теперь можно подключить базу через Connection Parameters в Hasura Console:');
    console.log('   Data → Manage → Connect Database → Connection Parameters');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Детали:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

removeInconsistentSource();

