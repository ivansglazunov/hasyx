import { v4 as uuidv4 } from 'uuid';
import { API_URL } from './url';
import Debug from './debug';

const debug = Debug('jwt:client');

interface JwtOptions {
  onDone: (jwt: string) => void;
}

export class JwtClient {
  public id: string = '';
  public interval: number | null = null;
  public time: number = 1000;
  private onDone: (jwt: string) => void;

  constructor(options: JwtOptions) {
    this.onDone = options.onDone;
    this.update();
  }

  update(): void {
    debug('Updating JWT client ID');
    this.id = uuidv4();
  }

  async check(): Promise<void> {
    debug(`Checking JWT auth status for ID: ${this.id}`);
    
    try {
      const response = await fetch(`${API_URL}/api/auth_jwt?jwt=${this.id}`);
      const data = await response.json();
      
      debug('JWT auth response:', data);
      
      switch (data.status) {
        case 'lost':
          debug('JWT auth lost, stopping interval');
          this.stop();
          // Remove from localStorage if exists
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('nextauth_jwt_id');
          }
          break;
        case 'await':
          debug('JWT auth still waiting');
          break;
        case 'done':
          debug('JWT auth completed, calling onDone');
          this.stop();
          // Remove from localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('nextauth_jwt_id');
          }
          this.onDone(data.jwt);
          break;
        default:
          debug('Unknown JWT auth status:', data.status);
      }
    } catch (error) {
      debug('Error checking JWT auth status:', error);
    }
  }

  start(): void {
    debug(`Starting JWT auth interval with ${this.time}ms delay`);
    
    if (this.interval !== null) {
      this.stop();
    }
    
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nextauth_jwt_id', this.id);
    }
    
    this.interval = setInterval(() => {
      this.check();
    }, this.time) as any;
  }

  stop(): void {
    debug('Stopping JWT auth interval');
    
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Auto-start JWT client if ID exists in localStorage
export function initJwtClient(): JwtClient | null {
  const savedJwtId = localStorage.getItem('nextauth_jwt_id');
  if (!savedJwtId) return null;
  
  debug('Found saved JWT ID, initializing client');
  
  const client = new JwtClient({
    onDone: (jwt: string) => {
      debug('JWT authentication completed, saving JWT');
      localStorage.setItem('nextauth_jwt', jwt);
      localStorage.removeItem('nextauth_jwt_id');
      localStorage.removeItem('nextauth_jwt_redirect');
    }
  });
  
  // Use the saved ID instead of generating new one
  client.id = savedJwtId;
  client.start();
  
  return client;
} 