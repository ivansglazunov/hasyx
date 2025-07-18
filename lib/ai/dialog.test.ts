import { Dialog, DialogEvent, DialogOptions } from './dialog';
import { OpenRouterProvider } from './providers/openrouter';
import { ExecJSTool } from './tools/exec-js-tool';
import * as dotenv from 'dotenv';
import * as path from 'path';
import Debug from '../debug';

const debug = Debug('dialog:test');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const hasApiKey = !!process.env.OPENROUTER_API_KEY;
const describeWithApiKey = hasApiKey ? describe : describe.skip;

describeWithApiKey('Dialog Class with Real Components', () => {
    const runDialogTests = (method: 'stream' | 'query') => {
        describe(`${method.charAt(0).toUpperCase() + method.slice(1)} Mode`, () => {
            let dialog: Dialog;
            let events: DialogEvent[];

            beforeEach(() => {
                events = []; // Reset events before each test
                debug(`--- Starting new test (${method}) ---`);
            });

            it('should run a simple ask-response cycle with OpenRouter', (done) => {
                debug(`Test (${method}): should run a simple ask-response cycle with OpenRouter`);
                const provider = new OpenRouterProvider({
                    token: process.env.OPENROUTER_API_KEY!,
                    user: `test-user-${Math.random()}`
                });

                const dialogOptions: DialogOptions = {
                    provider,
                    method,
                    onChange: (e) => {
                        debug(`Received event in test (${method}): %o`, e);
                        events.push(e);
                        if (e.type === 'done') {
                            const eventTypes = events.map(ev => ev.type);
                            const expectedEvents = ['ask', 'ai_request', 'ai_response', 'done'];
                            if (method === 'stream') {
                                expectedEvents.splice(2, 0, 'ai_chunk');
                            }
                            expect(eventTypes).toEqual(expect.arrayContaining(expectedEvents));
                            if (method === 'query') {
                                expect(eventTypes).not.toContain('ai_chunk');
                            }
                            const responseEvent = events.find(ev => ev.type === 'ai_response') as any;
                            expect(responseEvent.content.toLowerCase()).toContain('hello');

                            const askEvent = events.find(ev => ev.type === 'ask') as any;
                            expect(askEvent.message).toEqual({ role: 'user', content: 'Say "hello"' });

                            debug(`Test (${method}) completed successfully.`);
                            done();
                        } else if (e.type === 'error') {
                            debug(`Test (${method}) failed with error: %s`, e.error);
                            done(new Error(e.error));
                        }
                    }
                };

                dialog = new Dialog(dialogOptions);
                dialog.ask('Say "hello"');
            }, 30000);

            it('should handle a real tool cycle with ExecJSTool', (done) => {
                debug(`Test (${method}): should handle a real tool cycle with ExecJSTool`);
                const provider = new OpenRouterProvider({
                    token: process.env.OPENROUTER_API_KEY!,
                    user: `test-user-${Math.random()}`,
                    model: 'anthropic/claude-3.5-sonnet'
                });
                const jsTool = new ExecJSTool();

                dialog = new Dialog({
                    provider,
                    tools: [jsTool],
                    method,
                    systemPrompt: 'You are a helpful assistant. When asked to calculate something, you MUST use the javascript tool to perform the calculation. Always use available tools when they are relevant to the task.',
                    onChange: (e) => {
                        debug(`Received event in test (${method}): %o`, e);
                        events.push(e);
                        if (e.type === 'done') {
                            const eventTypes = events.map(ev => ev.type);
                            const hasToolResult = events.some(ev => ev.type === 'tool_result');
                            
                            if (hasToolResult) {
                                // Expected flow with tool usage
                                expect(eventTypes).toContain('tool_call');
                                expect(eventTypes).toContain('tool_result');
                                expect(eventTypes.filter(et => et === 'ai_request').length).toBeGreaterThanOrEqual(2);
                                
                                const toolResult = events.find(ev => ev.type === 'tool_result') as any;
                                expect(toolResult.result).toBe(8);

                                const finalResponse = events.slice().reverse().find(ev => ev.type === 'ai_response') as any;
                                expect(finalResponse.content).toMatch(/8|eight/);

                                debug(`Test (${method}) completed successfully.`);
                                done();
                            } else {
                                // AI didn't use tools - this is a test failure
                                debug(`Test (${method}) failed: AI didn't use tools. Events: %o`, eventTypes);
                                const lastResponse = events.slice().reverse().find(ev => ev.type === 'ai_response') as any;
                                debug(`Last AI response: %s`, lastResponse?.content || 'No AI response found');
                                done(new Error(`AI didn't use the javascript tool as expected. Event types: ${eventTypes.join(', ')}. Last response: ${lastResponse?.content || 'No response'}`));
                            }
                        } else if (e.type === 'error') {
                            debug(`Test (${method}) failed with error: %s`, e.error);
                            done(new Error(e.error));
                        }
                    }
                });

                dialog.ask('Use javascript tool to calculate 5 + 3');
            }, 60000);

            it('should stop and resume correctly with real calls', (done) => {
                debug(`Test (${method}): should stop and resume correctly with real calls`);
                const provider = new OpenRouterProvider({
                    token: process.env.OPENROUTER_API_KEY!,
                    user: `test-user-${Math.random()}`
                });
                let askCounter = 0;
                let resumed = false;

                dialog = new Dialog({
                    provider,
                    method,
                    onChange: (e) => {
                        debug(`Received event in test (${method}): %o`, e);
                        events.push(e);

                        if (e.type === 'ai_request') {
                            askCounter++;
                        }

                        if (e.type === 'done') {
                            // After first question is done
                            if (askCounter === 1 && !resumed) {
                                dialog.stop();
                                dialog.ask('Second question'); 
                                
                                setTimeout(() => {
                                    expect(askCounter).toBe(1); // Should not have increased
                                    resumed = true;
                                    dialog.resume();
                                }, 500);

                            } else if (askCounter === 2) {
                                // After second question is done
                                debug(`Test (${method}) completed successfully.`);
                                done();
                            }
                        } else if (e.type === 'error') {
                            debug(`Test (${method}) failed with error: %s`, e.error);
                            done(new Error(e.error));
                        }
                    }
                });

                dialog.ask('First question, say "one"');
            }, 60000);
        });
    };

    runDialogTests('stream');
    runDialogTests('query');
}); 