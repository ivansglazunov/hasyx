import { Promising } from './promising';

describe('Promising Class', () => {
  let promising: Promising;

  beforeEach(() => {
    Promising.clearAll();
    promising = new Promising('test-queue');
  });

  afterEach(() => {
    Promising.clearAll();
  });

  describe('Basic Promise Queue', () => {
    it('should initialize with resolved promise', async () => {
      const initialPromise = promising.promise;
      expect(initialPromise).toBeInstanceOf(Promise);
      await expect(initialPromise).resolves.toBeUndefined();
    });

    it('should execute tasks sequentially', async () => {
      const results: number[] = [];
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Add tasks that should execute in order
      promising.promise = async () => {
        await delay(50);
        results.push(1);
      };

      promising.promise = async () => {
        await delay(20);
        results.push(2);
      };

      promising.promise = async () => {
        results.push(3);
      };

      // Wait for all tasks to complete
      await promising.promise;

      expect(results).toEqual([1, 2, 3]);
    });

    it('should handle errors without breaking the chain', async () => {
      const results: string[] = [];
      const originalConsoleError = console.error;
      const errorLogs: any[] = [];
      console.error = (...args: any[]) => {
        errorLogs.push(args);
      };

      promising.promise = () => {
        results.push('task1');
      };

      promising.promise = () => {
        results.push('task2');
        throw new Error('Test error');
      };

      promising.promise = () => {
        results.push('task3');
      };

      // Wait for all tasks to complete
      await promising.promise;

      expect(results).toEqual(['task1', 'task2', 'task3']);
      expect(errorLogs.length).toBe(1);
      expect(errorLogs[0][0]).toContain('Error in promise queue test-queue:');
      expect(errorLogs[0][1]).toBeInstanceOf(Error);

      console.error = originalConsoleError;
    });

    it('should throw error for non-function tasks', () => {
      expect(() => {
        promising.promise = 'not a function' as any;
      }).toThrow('Promising.promise: Expected a function');
    });
  });

  describe('Execute Method', () => {
    it('should execute task and return result', async () => {
      const result = await promising.execute(() => 'test result');
      expect(result).toBe('test result');
    });

    it('should execute async task and return result', async () => {
      const result = await promising.execute(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async result';
      });
      expect(result).toBe('async result');
    });

    it('should execute tasks sequentially with execute method', async () => {
      const results: number[] = [];
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const promises = [
        promising.execute(async () => {
          await delay(50);
          results.push(1);
          return 1;
        }),
        promising.execute(async () => {
          await delay(20);
          results.push(2);
          return 2;
        }),
        promising.execute(() => {
          results.push(3);
          return 3;
        })
      ];

      const resolvedResults = await Promise.all(promises);

      expect(results).toEqual([1, 2, 3]);
      expect(resolvedResults).toEqual([1, 2, 3]);
    });

    it('should handle errors in execute method', async () => {
      await expect(
        promising.execute(() => {
          throw new Error('Execute error');
        })
      ).rejects.toThrow('Execute error');
    });

    it('should continue queue after error in execute method', async () => {
      const results: string[] = [];

      // First task that will fail
      const failedTask = promising.execute(() => {
        results.push('failed');
        throw new Error('Task failed');
      });

      // Second task that should still execute
      const successTask = promising.execute(() => {
        results.push('success');
        return 'ok';
      });

      await expect(failedTask).rejects.toThrow('Task failed');
      await expect(successTask).resolves.toBe('ok');

      expect(results).toEqual(['failed', 'success']);
    });
  });

  describe('Multiple Queues', () => {
    it('should handle multiple independent queues', async () => {
      const queue1 = new Promising('queue1');
      const queue2 = new Promising('queue2');
      const results: string[] = [];

      queue1.promise = () => {
        results.push('q1-task1');
      };

      queue2.promise = () => {
        results.push('q2-task1');
      };

      queue1.promise = () => {
        results.push('q1-task2');
      };

      queue2.promise = () => {
        results.push('q2-task2');
      };

      await Promise.all([queue1.promise, queue2.promise]);

      // Each queue should maintain its own order
      expect(results).toContain('q1-task1');
      expect(results).toContain('q1-task2');
      expect(results).toContain('q2-task1');
      expect(results).toContain('q2-task2');
      
      // Within each queue, order should be maintained
      const q1Index1 = results.indexOf('q1-task1');
      const q1Index2 = results.indexOf('q1-task2');
      const q2Index1 = results.indexOf('q2-task1');
      const q2Index2 = results.indexOf('q2-task2');
      
      expect(q1Index1).toBeLessThan(q1Index2);
      expect(q2Index1).toBeLessThan(q2Index2);
    });
  });

  describe('Queue Management', () => {
    it('should clear specific queue', async () => {
      promising.promise = () => 'task1';
      promising.clear();
      
      // After clearing, should start with fresh resolved promise
      const newPromise = promising.promise;
      await expect(newPromise).resolves.toBeUndefined();
    });

    it('should clear all queues', async () => {
      const queue1 = new Promising('queue1');
      const queue2 = new Promising('queue2');

      queue1.promise = () => 'task1';
      queue2.promise = () => 'task2';

      Promising.clearAll();

      // Both queues should start fresh
      await expect(queue1.promise).resolves.toBeUndefined();
      await expect(queue2.promise).resolves.toBeUndefined();
    });
  });
});
