/*😈{"symbol":"🟢","name":"cloudflare","required":[],"available":["dns-api","ssl-certificates"]}*/

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import Debug from './debug';

const debug = Debug('cloudflare');

export interface CloudflareConfig {
  apiToken: string;
  zoneId: string;
  domain: string;
}

export interface DnsRecord {
  id: string;
  name: string;
  content: string;
  type: string;
  ttl: number;
  proxied: boolean;
}

export interface CloudflareResponse {
  success: boolean;
  errors: any[];
  messages: any[];
  result?: DnsRecord | DnsRecord[];
  result_info?: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
  };
}

export interface SubdomainDnsConfig {
  ip: string;
  ttl?: number;
  proxied?: boolean;
}

export class CloudFlare {
  private apiToken: string;
  private zoneId: string;
  private domain: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(config: CloudflareConfig) {
    debug(`Initializing CloudFlare manager for domain: ${config.domain}`);
    
    if (!config.apiToken || !config.zoneId || !config.domain) {
      throw new Error('CloudFlare configuration incomplete: apiToken, zoneId, and domain are required');
    }
    
    this.apiToken = config.apiToken;
    this.zoneId = config.zoneId;
    this.domain = config.domain;
  }

  private async makeRequest<T = CloudflareResponse>(method: string, endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      debug(`Making ${method} request to: ${endpoint}`);
      const response = await axios({
        method,
        url,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        data
      });

      if (!response.data.success) {
        throw new Error(`Cloudflare API error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        debug(`API request failed: ${error.response?.data || error.message}`);
        throw new Error(`Cloudflare API request failed: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      }
      throw error;
    }
  }

  private getFullDomain(subdomain: string): string {
    if (subdomain === '@' || subdomain === '') {
      return this.domain;
    }
    return `${subdomain}.${this.domain}`;
  }

  /**
   * Generate Cloudflare credentials file for certbot-dns-cloudflare
   * Returns path to the created credentials file
   */
  generateCredentialsFile(): string {
    debug('Generating Cloudflare credentials file for certbot');
    
    const credContent = `# Cloudflare API token for certbot-dns-cloudflare
dns_cloudflare_api_token = ${this.apiToken}
`;
    
    const credPath = '/tmp/cloudflare-certbot.ini';
    
    try {
      fs.writeFileSync(credPath, credContent, { mode: 0o600 });
      debug(`Credentials file created: ${credPath}`);
      return credPath;
    } catch (error) {
      debug(`Error creating credentials file: ${error}`);
      throw new Error(`Failed to create Cloudflare credentials file: ${error}`);
    }
  }

  /**
   * Create TXT record for ACME challenge (DNS-01 validation)
   * Used for wildcard certificate validation
   */
  async createAcmeChallenge(token: string): Promise<DnsRecord> {
    const challengeName = `_acme-challenge.${this.domain}`;
    debug(`Creating ACME challenge TXT record: ${challengeName} → ${token}`);

    try {
      const response = await this.makeRequest<CloudflareResponse>(
        'POST',
        `/zones/${this.zoneId}/dns_records`,
        {
          type: 'TXT',
          name: challengeName,
          content: token,
          ttl: 120 // Short TTL for quick propagation
        }
      );

      const record = response.result as DnsRecord;
      debug(`ACME challenge record created: ${record.id}`);
      return record;
    } catch (error) {
      debug(`Error creating ACME challenge record: ${error}`);
      throw new Error(`Failed to create ACME challenge record: ${error}`);
    }
  }

  /**
   * Delete ACME challenge TXT records
   * Cleanup after wildcard certificate validation
   */
  async deleteAcmeChallenge(): Promise<void> {
    const challengeName = `_acme-challenge.${this.domain}`;
    debug(`Deleting ACME challenge TXT records for: ${challengeName}`);

    try {
      // Find all TXT records for _acme-challenge
      const response = await this.makeRequest<CloudflareResponse>(
        'GET',
        `/zones/${this.zoneId}/dns_records?name=${challengeName}&type=TXT`
      );

      const records = Array.isArray(response.result) ? response.result : [];
      debug(`Found ${records.length} ACME challenge records to delete`);

      // Delete each record
      for (const record of records) {
        try {
          await this.makeRequest(
            'DELETE',
            `/zones/${this.zoneId}/dns_records/${record.id}`
          );
          debug(`Deleted ACME challenge record: ${record.id}`);
        } catch (error) {
          debug(`Error deleting ACME challenge record ${record.id}: ${error}`);
          // Continue with other records even if one fails
        }
      }

      debug(`ACME challenge cleanup completed`);
    } catch (error) {
      debug(`Error during ACME challenge cleanup: ${error}`);
      // Don't throw error - cleanup is best effort
    }
  }

  /**
   * Get DNS record for specific subdomain
   * Returns null if not found
   */
  async get(subdomain: string): Promise<DnsRecord | null> {
    const fullDomain = this.getFullDomain(subdomain);
    debug(`Getting DNS record for: ${fullDomain}`);
    
    try {
      const response = await this.makeRequest<CloudflareResponse>(
        'GET',
        `/zones/${this.zoneId}/dns_records?name=${fullDomain}&type=A`
      );

      const records = Array.isArray(response.result) ? response.result : [];
      const record = records.find(r => r.name === fullDomain && r.type === 'A');
      
      debug(`Found ${records.length} records for ${fullDomain}, A record: ${record ? 'found' : 'not found'}`);
      return record || null;
    } catch (error) {
      debug(`Error getting DNS record for ${fullDomain}: ${error}`);
      throw error;
    }
  }

  /**
   * List all DNS A records for the domain
   */
  async list(): Promise<DnsRecord[]> {
    debug(`Listing all A records for domain: ${this.domain}`);
    
    try {
      let allRecords: DnsRecord[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.makeRequest<CloudflareResponse>(
          'GET',
          `/zones/${this.zoneId}/dns_records?type=A&page=${page}&per_page=100`
        );

        const records = Array.isArray(response.result) ? response.result : [];
        allRecords = allRecords.concat(records);

        hasMore = response.result_info ? page < Math.ceil(response.result_info.total_count / response.result_info.per_page) : false;
        page++;
      }

      // Filter only records that belong to our domain or its subdomains
      const domainRecords = allRecords.filter(record => 
        record.name === this.domain || record.name.endsWith(`.${this.domain}`)
      );

      debug(`Found ${domainRecords.length} A records for domain ${this.domain}`);
      return domainRecords;
    } catch (error) {
      debug(`Error listing DNS records: ${error}`);
      throw error;
    }
  }

  /**
   * Create DNS record for subdomain
   * Throws error if record already exists
   */
  async create(subdomain: string, config: SubdomainDnsConfig): Promise<DnsRecord> {
    const fullDomain = this.getFullDomain(subdomain);
    debug(`Creating DNS record for: ${fullDomain} → ${config.ip}`);

    // Check if record already exists
    const existing = await this.get(subdomain);
    if (existing) {
      throw new Error(`DNS record for ${fullDomain} already exists (ID: ${existing.id})`);
    }

    try {
      const response = await this.makeRequest<CloudflareResponse>(
        'POST',
        `/zones/${this.zoneId}/dns_records`,
        {
          type: 'A',
          name: fullDomain,
          content: config.ip,
          ttl: config.ttl || 300,
          proxied: config.proxied || false
        }
      );

      const record = response.result as DnsRecord;
      debug(`Successfully created DNS record: ${record.id}`);
      return record;
    } catch (error) {
      debug(`Error creating DNS record for ${fullDomain}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete DNS record for subdomain
   * Throws error if record doesn't exist
   */
  async delete(subdomain: string): Promise<void> {
    const fullDomain = this.getFullDomain(subdomain);
    debug(`Deleting DNS record for: ${fullDomain}`);

    const existing = await this.get(subdomain);
    if (!existing) {
      throw new Error(`DNS record for ${fullDomain} does not exist`);
    }

    try {
      await this.makeRequest(
        'DELETE',
        `/zones/${this.zoneId}/dns_records/${existing.id}`
      );
      
      debug(`Successfully deleted DNS record: ${existing.id}`);
    } catch (error) {
      debug(`Error deleting DNS record for ${fullDomain}: ${error}`);
      throw error;
    }
  }

  /**
   * Define DNS record (delete if exists, then create)
   * Does not throw errors for non-existing records
   */
  async define(subdomain: string, config: SubdomainDnsConfig): Promise<DnsRecord> {
    debug(`Defining DNS record for: ${subdomain}`);
    
    try {
      await this.undefine(subdomain);
    } catch (error) {
      debug(`No existing DNS record to delete for ${subdomain}`);
    }

    return await this.create(subdomain, config);
  }

  /**
   * Undefine DNS record (delete if exists)
   * Does not throw errors for non-existing records
   */
  async undefine(subdomain: string): Promise<void> {
    debug(`Undefining DNS record for: ${subdomain}`);
    
    try {
      await this.delete(subdomain);
    } catch (error) {
      debug(`DNS record ${subdomain} does not exist or already deleted`);
    }
  }
} 