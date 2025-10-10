#!/usr/bin/env node
/**
 * Wstunnel Client CLI
 * Connects local port to remote wstunnel server via HTTPS subdomain
 * 
 * Usage:
 *   npm run tunnel -- --port 3004 --uuid my-app --server https://deep.foundation
 *   npm run tunnel -- -p 3004 -u my-app
 */

import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';
import Debug from './debug';
import { Command } from 'commander';

const debug = Debug('wstunnel-client');

interface TunnelOptions {
  port: number;
  uuid: string;
  server: string;
  token?: string;
}

class WstunnelClient {
  private options: TunnelOptions;
  private wstunnelProcess: ChildProcess | null = null;
  private registered: boolean = false;

  constructor(options: TunnelOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    try {
      console.log('🚀 Starting wstunnel client...');
      console.log(`   Local port: ${this.options.port}`);
      console.log(`   UUID: ${this.options.uuid}`);
      console.log(`   Server: ${this.options.server}`);
      console.log('');

      // Step 1: Register tunnel on server
      await this.registerTunnel();

      // Step 2: Start wstunnel client
      await this.startWstunnelClient();

      console.log('');
      console.log('✅ Tunnel is running!');
      console.log(`   Local:  http://localhost:${this.options.port}`);
      console.log(`   Public: https://${this.options.uuid}.${new URL(this.options.server).hostname}`);
      console.log('');
      console.log('Press Ctrl+C to stop the tunnel');
      
    } catch (error) {
      console.error('❌ Failed to start tunnel:', error);
      await this.cleanup();
      process.exit(1);
    }
  }

  private async registerTunnel(): Promise<void> {
    console.log('📡 Registering tunnel on server...');
    debug(`Registering tunnel: POST ${this.options.server}/api/wstunnel/${this.options.uuid}`);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.options.token) {
        headers['Authorization'] = `Bearer ${this.options.token}`;
      }

      const response = await axios.post(
        `${this.options.server}/api/wstunnel/${this.options.uuid}`,
        {},
        {
          headers,
          timeout: 60000
        }
      );

      if (!response.data.success) {
        throw new Error(`Server error: ${response.data.error}`);
      }

      this.registered = true;
      console.log('✅ Tunnel registered on server');
      console.log(`   Subdomain: ${response.data.subdomain}`);
      console.log(`   Server Port: ${response.data.port}`);
      debug('Registration response:', response.data);

      // Wait for infrastructure to be ready
      console.log('⏳ Waiting for infrastructure (DNS, SSL, Nginx) to be ready...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Server returned ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          throw new Error(`No response from server: ${error.message}`);
        }
      }
      throw error;
    }
  }

  private async startWstunnelClient(): Promise<void> {
    console.log('🔌 Starting wstunnel client connection...');

    // Extract domain from server URL
    const serverUrl = new URL(this.options.server);
    const domain = serverUrl.hostname;
    
    // Construct WebSocket URL
    // The wstunnel server on remote machine listens on port 5000-6000 range
    const wsPort = 5000; // This should match the port returned by server
    const wsUrl = `wss://${this.options.uuid}.${domain}:${wsPort}`;
    
    debug(`Starting wstunnel client: ${wsUrl} -> localhost:${this.options.port}`);
    console.log(`   Connecting to: ${wsUrl}`);
    console.log(`   Proxying to: localhost:${this.options.port}`);

    // Start wstunnel client
    const clientCommand = [
      'client',
      '-L', `stdio://localhost:${this.options.port}`,
      wsUrl
    ];

    this.wstunnelProcess = spawn('wstunnel', clientCommand, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.wstunnelProcess.stdout?.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`   [wstunnel] ${output}`);
        debug(`wstunnel stdout: ${output}`);
      }
    });

    this.wstunnelProcess.stderr?.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`   [wstunnel] ${output}`);
        debug(`wstunnel stderr: ${output}`);
      }
    });

    this.wstunnelProcess.on('error', (error) => {
      console.error('❌ wstunnel client error:', error);
      debug(`wstunnel process error: ${error}`);
    });

    this.wstunnelProcess.on('exit', (code, signal) => {
      console.log(`\nwstunnel client exited (code: ${code}, signal: ${signal})`);
      debug(`wstunnel process exited: code=${code}, signal=${signal}`);
      this.cleanup();
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ wstunnel client connected');
  }

  private async unregisterTunnel(): Promise<void> {
    if (!this.registered) return;

    console.log('🔄 Unregistering tunnel from server...');
    debug(`Unregistering tunnel: POST ${this.options.server}/api/wstunnel/${this.options.uuid}?undefine=1`);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.options.token) {
        headers['Authorization'] = `Bearer ${this.options.token}`;
      }

      await axios.post(
        `${this.options.server}/api/wstunnel/${this.options.uuid}?undefine=1`,
        {},
        {
          headers,
          timeout: 30000
        }
      );

      console.log('✅ Tunnel unregistered');
      debug('Tunnel unregistered successfully');
      
    } catch (error) {
      console.error('⚠️  Failed to unregister tunnel:', error);
      debug(`Unregister error: ${error}`);
    }
  }

  async stop(): Promise<void> {
    await this.cleanup();
  }

  private async cleanup(): Promise<void> {
    if (this.wstunnelProcess) {
      console.log('🛑 Stopping wstunnel client...');
      this.wstunnelProcess.kill('SIGTERM');
      this.wstunnelProcess = null;
    }

    await this.unregisterTunnel();
  }
}

// CLI setup
const program = new Command();

program
  .name('wstunnel-client')
  .description('Connect local port to remote wstunnel server')
  .version('1.0.0')
  .requiredOption('-p, --port <number>', 'Local port to tunnel', (val) => parseInt(val, 10))
  .option('-u, --uuid <string>', 'Tunnel UUID (subdomain name)', () => {
    // Generate random UUID if not provided
    return `dev-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  })
  .option('-s, --server <url>', 'Wstunnel server URL', process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ? 
    new URL(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL).origin : 
    'https://deep.foundation'
  )
  .option('-t, --token <string>', 'Authentication token', process.env.AUTH_TOKEN)
  .action(async (options) => {
    debug('Starting with options:', options);

    // Validate port
    if (!options.port || options.port < 1 || options.port > 65535) {
      console.error('❌ Invalid port number. Must be between 1 and 65535');
      process.exit(1);
    }

    // Create client
    const client = new WstunnelClient({
      port: options.port,
      uuid: options.uuid,
      server: options.server,
      token: options.token
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down...');
      await client.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n🛑 Shutting down...');
      await client.stop();
      process.exit(0);
    });

    // Start tunnel
    await client.start();

    // Keep process alive
    await new Promise(() => {});
  });

// Run if called directly (CommonJS compatible check)
if (typeof require !== 'undefined' && require.main === module) {
  program.parse(process.argv);
}

export { WstunnelClient };


