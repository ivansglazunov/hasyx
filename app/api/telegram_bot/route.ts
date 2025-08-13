import { generateTelegramHandler } from 'hasyx/lib/ai/telegram';
import { ExecJSTool } from 'hasyx/lib/ai/tools/exec-js-tool';
import { TerminalTool } from 'hasyx/lib/ai/tools/terminal-tool';
import { Tool } from 'hasyx/lib/ai/tool';
import { createSystemPrompt } from 'hasyx/lib/ai/core-prompts';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Generator } from 'hasyx/lib/generator';
import schema from '../../../public/hasura-schema.json';

const getSystemPrompt = (tools: Tool[]) => {
  const appContext = `You are a powerful AI assistant in Telegram. Your goal is to help users by executing commands or answering their questions.

**RESPONSE MODES:**
1. **Tool Execution**: If the user's request requires an action (running code, system commands, calculations), use the appropriate tool
2. **Direct Answer**: If the user is asking questions or having a conversation, respond in plain text

**TELEGRAM CONTEXT:**
- Keep responses concise and readable in chat format
- Use emojis when appropriate to make responses more engaging
- For code execution results, format them clearly`;

  const toolDescriptions = tools.map(t => `- ${t.name}: ${t.contextPreprompt}`);
  return createSystemPrompt(appContext, toolDescriptions);
};

const handleTelegram = generateTelegramHandler({
  tools: async ({ chatId }) => {
    // Resolve user by notification_permissions and check users.is_admin
    try {
      const apollo = createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET });
      const hasyx = new Hasyx(apollo, Generator(schema as any));
      const perm = await hasyx.select<{ user_id: string }[]>({
        table: 'notification_permissions',
        where: { provider: { _eq: 'telegram_bot' }, device_token: { _eq: String(chatId) } },
        returning: ['user_id'],
        limit: 1,
      });
      const userId = Array.isArray(perm) && perm[0]?.user_id ? perm[0].user_id : null;
      if (userId && await hasyx.isAdmin(userId)) {
        return [new ExecJSTool(), new TerminalTool({ timeout: 0 })];
      }
    } catch (_e) {
      // ignore and fall through to no-tools
    }

    // Not admin: no tools
    return [];
  },
  getSystemPrompt,
});

export async function POST(request: Request) {
  return handleTelegram(request);
} 