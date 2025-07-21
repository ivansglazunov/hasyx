/**
 * Promise queue management class
 * Ensures sequential execution of async operations
 */
export class Promising {
  private static _promises: { [id: string]: Promise<any> } = {};

  constructor(private id: string) {}

  /**
   * Get the current promise chain for this ID
   * If no queue exists, creates a resolved promise
   */
  get promise(): Promise<void> {
    if (!Promising._promises[this.id]) {
      Promising._promises[this.id] = Promise.resolve();
    }
    return Promising._promises[this.id];
  }

  /**
   * Add a new task to the promise queue
   * The task will execute after all previous tasks complete
   */
  set promise(taskFactory: () => any) {
    if (typeof taskFactory !== 'function') {
      throw new Error('Promising.promise: Expected a function');
    }

    const task = () => Promise.resolve(taskFactory());
    
    // Chain the new task to the end of the queue
    Promising._promises[this.id] = this.promise
      .then(task)
      .catch(error => {
        // Log error but don't break the chain
        console.error(`Error in promise queue ${this.id}:`, error);
        return Promise.resolve();
      });
  }

  /**
   * Add a task and wait for its completion
   * Returns the result of the task
   */
  async execute<T>(taskFactory: () => T | Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.promise = async () => {
        try {
          const result = await taskFactory();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      };
    });
  }

  /**
   * Clear the promise queue for this ID
   */
  clear(): void {
    delete Promising._promises[this.id];
  }

  /**
   * Clear all promise queues
   */
  static clearAll(): void {
    Promising._promises = {};
  }
}
