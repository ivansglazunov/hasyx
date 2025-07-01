/*😈{"symbol":"🟢","name":"ssl","required":["nginx","certbot"],"available":["https","ssl-certificates"]}*/

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import Debug from './debug';

const debug = Debug('ssl');

export interface SSLConfig {
  email?: string;
  webroot?: string;
  certbotPath?: string;
  staging?: boolean;
}

export interface CertificateInfo {
  exists: boolean;
  domain?: string;
  expiresAt?: Date;
  daysLeft?: number;
  path?: {
    certificate: string;
    privateKey: string;
    fullchain: string;
  };
}

export interface WildcardCertificateInfo {
  domain: string;
  wildcardDomain: string;
  exists: boolean;
  expiresAt?: Date;
  daysLeft?: number;
  coversSubdomain: (subdomain: string) => boolean;
  path?: {
    certificate: string;
    privateKey: string;
    fullchain: string;
  };
}

export interface DNSPropagationResult {
  domain: string;
  expectedIp: string;
  actualIp: string;
  propagated: boolean;
  attempts: number;
}

export class SSL {
  public defaultEmail: string;
  public certbotPath: string;
  public letsencryptPath: string;
  public staging: boolean;

  constructor(config?: SSLConfig) {
    debug('Initializing SSL manager');
    
    this.defaultEmail = config?.email || process.env.LETSENCRYPT_EMAIL || '';
    this.certbotPath = config?.certbotPath || 'certbot';
    this.letsencryptPath = '/etc/letsencrypt/live';
    this.staging = config?.staging || false;
    
    debug(`SSL manager initialized with email: ${this.defaultEmail ? 'set' : 'not set'}, staging: ${this.staging}`);
  }

  public validateCertbotAvailable(): void {
    try {
      execSync(`${this.certbotPath} --version`, { stdio: 'pipe' });
      debug('Certbot is available');
    } catch (error) {
      throw new Error(`Certbot is not available. Please install certbot first: ${error}`);
    }
  }

  public validateCertbotDnsCloudflareAvailable(): void {
    try {
      execSync(`${this.certbotPath} plugins | grep dns-cloudflare`, { stdio: 'pipe' });
      debug('Certbot DNS Cloudflare plugin is available');
    } catch (error) {
      throw new Error(`Certbot DNS Cloudflare plugin is not available. Please install certbot-dns-cloudflare first: ${error}`);
    }
  }

  public getCertificatePaths(domain: string): { certificate: string; privateKey: string; fullchain: string } {
    const basePath = path.join(this.letsencryptPath, domain);
    return {
      certificate: path.join(basePath, 'cert.pem'),
      privateKey: path.join(basePath, 'privkey.pem'),
      fullchain: path.join(basePath, 'fullchain.pem')
    };
  }

  public checkCertificateExists(domain: string): boolean {
    const paths = this.getCertificatePaths(domain);
    return fs.existsSync(paths.certificate) && 
           fs.existsSync(paths.privateKey) && 
           fs.existsSync(paths.fullchain);
  }

  public parseCertificateInfo(certPath: string): { expiresAt: Date } {
    try {
      const output = execSync(`openssl x509 -in "${certPath}" -noout -enddate`, { encoding: 'utf8' });
      const match = output.match(/notAfter=(.+)/);
      if (!match) {
        throw new Error('Could not parse certificate expiration date');
      }
      
      const expiresAt = new Date(match[1]);
      return { expiresAt };
    } catch (error) {
      throw new Error(`Failed to parse certificate: ${error}`);
    }
  }

  public wildcardCovers(subdomain: string, domain: string): boolean {
    const fullSubdomain = `${subdomain}.${domain}`;
    const parts = fullSubdomain.split('.');
    const domainParts = domain.split('.');
    
    return parts.length === domainParts.length + 1;
  }

  /**
   * Create wildcard SSL certificate for domain using DNS-01 validation
   * Requires Cloudflare credentials file
   */
  async createWildcard(domain: string, credentialsPath: string, email?: string): Promise<void> {
    debug(`Creating wildcard SSL certificate for: *.${domain}`);
    
    this.validateCertbotAvailable();
    this.validateCertbotDnsCloudflareAvailable();
    
    const certificateEmail = email || this.defaultEmail;
    if (!certificateEmail) {
      throw new Error('Email is required for SSL certificate creation. Provide via parameter or LETSENCRYPT_EMAIL env variable.');
    }

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Cloudflare credentials file not found: ${credentialsPath}`);
    }

    if (this.checkCertificateExists(`*.${domain}`) || this.checkCertificateExists(domain)) {
      throw new Error(`Wildcard certificate for ${domain} already exists`);
    }

    try {
      const certbotCommand = [
        this.certbotPath,
        'certonly',
        '--dns-cloudflare',
        '--dns-cloudflare-credentials', credentialsPath,
        this.staging ? '--staging' : '',
        '--non-interactive',
        '--agree-tos',
        '--email', certificateEmail,
        '-d', domain,
        '-d', `*.${domain}`
      ].filter(Boolean).join(' ');

      debug(`Running certbot wildcard command: ${certbotCommand}`);
      execSync(certbotCommand, { 
        stdio: 'inherit',
        timeout: 180000
      });
      
      debug(`Wildcard SSL certificate created successfully for *.${domain}`);
    } catch (error) {
      debug(`Error creating wildcard SSL certificate for ${domain}: ${error}`);
      throw new Error(`Failed to create wildcard SSL certificate: ${error}`);
    }
  }

  /**
   * Get wildcard certificate information
   * Returns null if wildcard certificate doesn't exist
   */
  async getWildcard(domain: string): Promise<WildcardCertificateInfo | null> {
    debug(`Getting wildcard certificate info for: *.${domain}`);
    
    let certDomain = domain;
    if (!this.checkCertificateExists(domain) && this.checkCertificateExists(`*.${domain}`)) {
      certDomain = `*.${domain}`;
    } else if (!this.checkCertificateExists(domain)) {
      debug(`Wildcard certificate for ${domain} does not exist`);
      return null;
    }

    try {
      const paths = this.getCertificatePaths(certDomain);
      const certInfo = this.parseCertificateInfo(paths.certificate);
      const now = new Date();
      const daysLeft = Math.ceil((certInfo.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const wildcardInfo: WildcardCertificateInfo = {
        domain,
        wildcardDomain: `*.${domain}`,
        exists: true,
        expiresAt: certInfo.expiresAt,
        daysLeft,
        coversSubdomain: (subdomain: string) => this.wildcardCovers(subdomain, domain),
        path: paths
      };

      debug(`Wildcard certificate info for ${domain}: expires ${certInfo.expiresAt}, ${daysLeft} days left`);
      return wildcardInfo;
    } catch (error) {
      debug(`Error getting wildcard certificate info for ${domain}: ${error}`);
      throw new Error(`Failed to get wildcard certificate information: ${error}`);
    }
  }

  public waitForDnsPropagation(domain: string, expectedIp: string, maxAttempts: number = 12): Promise<DNSPropagationResult> {
    return new Promise(async (resolve, reject) => {
      debug(`Waiting for DNS propagation: ${domain} → ${expectedIp}`);
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = execSync(`dig +short ${domain} @8.8.8.8`, { encoding: 'utf8' }).trim();
          
          if (result === expectedIp) {
            debug(`DNS propagated successfully: ${domain} → ${expectedIp} (attempt ${attempt})`);
            resolve({
              domain,
              expectedIp,
              actualIp: result,
              propagated: true,
              attempts: attempt
            });
            return;
          }
          
          debug(`DNS not yet propagated (${attempt}/${maxAttempts}): ${domain} → ${result || 'no result'}`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
        } catch (error) {
          debug(`DNS lookup failed (${attempt}/${maxAttempts}): ${error}`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
        }
      }
      
      reject(new Error(`DNS propagation timeout for ${domain} after ${maxAttempts} attempts`));
    });
  }

  /**
   * Get certificate information
   * Returns null if certificate doesn't exist
   */
  async get(domain: string): Promise<CertificateInfo | null> {
    debug(`Getting certificate info for: ${domain}`);
    
    if (!this.checkCertificateExists(domain)) {
      debug(`Certificate for ${domain} does not exist`);
      return null;
    }

    try {
      const paths = this.getCertificatePaths(domain);
      const certInfo = this.parseCertificateInfo(paths.certificate);
      const now = new Date();
      const daysLeft = Math.ceil((certInfo.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const info: CertificateInfo = {
        exists: true,
        domain,
        expiresAt: certInfo.expiresAt,
        daysLeft,
        path: paths
      };

      debug(`Certificate info for ${domain}: expires ${certInfo.expiresAt}, ${daysLeft} days left`);
      return info;
    } catch (error) {
      debug(`Error getting certificate info for ${domain}: ${error}`);
      throw new Error(`Failed to get certificate information: ${error}`);
    }
  }

  /**
   * Create SSL certificate for domain
   * Throws error if certificate already exists
   */
  async create(domain: string, email?: string): Promise<void> {
    debug(`Creating SSL certificate for: ${domain}`);
    
    this.validateCertbotAvailable();
    
    const certificateEmail = email || this.defaultEmail;
    if (!certificateEmail) {
      throw new Error('Email is required for SSL certificate creation. Provide via parameter or LETSENCRYPT_EMAIL env variable.');
    }

    if (this.checkCertificateExists(domain)) {
      throw new Error(`SSL certificate for ${domain} already exists`);
    }

    try {
      const certbotCommand = [
        this.certbotPath,
        'certonly',
        '--nginx',
        this.staging ? '--staging' : '',
        '--non-interactive',
        '--agree-tos',
        '--email', certificateEmail,
        '-d', domain
      ].filter(Boolean).join(' ');

      debug(`Running certbot command: ${certbotCommand}`);
      execSync(certbotCommand, { 
        stdio: 'inherit',
        timeout: 90000
      });
      
      debug(`SSL certificate created successfully for ${domain}`);
    } catch (error) {
      debug(`Error creating SSL certificate for ${domain}: ${error}`);
      throw new Error(`Failed to create SSL certificate: ${error}`);
    }
  }

  /**
   * Delete SSL certificate for domain
   * Throws error if certificate doesn't exist
   */
  async delete(domain: string): Promise<void> {
    debug(`Deleting SSL certificate for: ${domain}`);
    
    this.validateCertbotAvailable();

    if (!this.checkCertificateExists(domain)) {
      throw new Error(`SSL certificate for ${domain} does not exist`);
    }

    try {
      const certbotCommand = [
        this.certbotPath,
        'delete',
        '--non-interactive',
        '--cert-name', domain
      ].join(' ');

      debug(`Running certbot delete command: ${certbotCommand}`);
      execSync(certbotCommand, { stdio: 'inherit' });
      
      debug(`SSL certificate deleted successfully for ${domain}`);
    } catch (error) {
      debug(`Error deleting SSL certificate for ${domain}: ${error}`);
      throw new Error(`Failed to delete SSL certificate: ${error}`);
    }
  }

  /**
   * Define SSL certificate (delete if exists, then create)
   * Does not throw errors for non-existing certificates
   */
  async define(domain: string, email?: string): Promise<void> {
    debug(`Defining SSL certificate for: ${domain}`);
    
    try {
      await this.undefine(domain);
    } catch (error) {
      debug(`No existing certificate to delete for ${domain}`);
    }

    await this.create(domain, email);
  }

  /**
   * Undefine SSL certificate (delete if exists)
   * Does not throw errors for non-existing certificates
   */
  async undefine(domain: string): Promise<void> {
    debug(`Undefining SSL certificate for: ${domain}`);
    
    try {
      await this.delete(domain);
    } catch (error) {
      debug(`Certificate ${domain} does not exist or already deleted`);
    }
  }

  /**
   * Wait for DNS propagation before certificate creation
   */
  async wait(domain: string, ip: string, maxAttempts?: number): Promise<DNSPropagationResult> {
    debug(`Waiting for DNS propagation: ${domain} → ${ip}`);
    return this.waitForDnsPropagation(domain, ip, maxAttempts);
  }

  /**
   * Check certificate status and expiration
   */
  async check(domain: string): Promise<CertificateInfo> {
    debug(`Checking certificate status for: ${domain}`);
    
    const info = await this.get(domain);
    if (!info) {
      return {
        exists: false,
        domain
      };
    }
    
    return info;
  }

  /**
   * Renew certificate if it exists and is close to expiration
   */
  async renew(domain: string, daysBeforeExpiry: number = 30): Promise<boolean> {
    debug(`Checking if renewal needed for: ${domain}`);
    
    const info = await this.check(domain);
    if (!info.exists || !info.daysLeft) {
      debug(`Certificate for ${domain} does not exist, cannot renew`);
      return false;
    }

    if (info.daysLeft > daysBeforeExpiry) {
      debug(`Certificate for ${domain} still valid for ${info.daysLeft} days, no renewal needed`);
      return false;
    }

    try {
      this.validateCertbotAvailable();
      
      const renewCommand = [
        this.certbotPath,
        'renew',
        '--cert-name', domain,
        '--non-interactive'
      ].join(' ');

      debug(`Renewing certificate: ${renewCommand}`);
      execSync(renewCommand, { stdio: 'inherit' });
      
      debug(`Certificate renewed successfully for ${domain}`);
      return true;
    } catch (error) {
      debug(`Error renewing certificate for ${domain}: ${error}`);
      throw new Error(`Failed to renew SSL certificate: ${error}`);
    }
  }
}