/**
 * Sample Security Audit Data
 * This provides demo data for the Security Audit Dashboard
 */

import { subDays, subHours, subMinutes } from 'date-fns';
import type { LoginAttempt, APIAccessLog } from '../hooks/useSecurityAudit';

// Generate sample login attempts
export function generateSampleLoginAttempts(): LoginAttempt[] {
  const now = new Date();
  const users = [
    { email: 'admin@klz.com', role: 'admin' as const, user_id: '1' },
    { email: 'owner@klz.com', role: 'owner' as const, user_id: '2' },
    { email: 'accountant@klz.com', role: 'accountant' as const, user_id: '3' },
    { email: 'owner2@klz.com', role: 'owner' as const, user_id: '4' },
  ];

  const ips = ['192.168.1.100', '192.168.1.101', '10.0.0.50', '172.16.0.1', '203.0.113.45'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  ];

  const attempts: LoginAttempt[] = [];

  // Generate successful logins
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 720); // Last 30 days
    
    attempts.push({
      id: `login-success-${i}`,
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      ip_address: ips[Math.floor(Math.random() * ips.length)],
      timestamp: subHours(now, hoursAgo).toISOString(),
      status: 'success',
      user_agent: userAgents[Math.floor(Math.random() * userAgents.length)],
    });
  }

  // Generate failed login attempts (fewer)
  for (let i = 0; i < 12; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
    
    attempts.push({
      id: `login-failed-${i}`,
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      ip_address: ips[Math.floor(Math.random() * ips.length)],
      timestamp: subHours(now, hoursAgo).toISOString(),
      status: 'failed',
      user_agent: userAgents[Math.floor(Math.random() * userAgents.length)],
    });
  }

  // Add some suspicious activity (multiple failed attempts from same IP)
  const suspiciousIP = '203.0.113.45';
  for (let i = 0; i < 5; i++) {
    attempts.push({
      id: `login-suspicious-${i}`,
      user_id: '999',
      email: 'attacker@test.com',
      role: 'admin',
      ip_address: suspiciousIP,
      timestamp: subMinutes(now, i * 5).toISOString(),
      status: 'failed',
      user_agent: userAgents[0],
    });
  }

  // Sort by timestamp descending
  return attempts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Generate sample API access logs
export function generateSampleAPILogs(): APIAccessLog[] {
  const now = new Date();
  const endpoints = [
    '/api/properties',
    '/api/maintenance',
    '/api/financial-reports',
    '/api/users',
    '/api/dashboard-kpis',
    '/api/clients',
    '/api/analytics',
  ];

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const users = [
    { id: '1', email: 'admin@klz.com' },
    { id: '2', email: 'owner@klz.com' },
    { id: '3', email: 'accountant@klz.com' },
  ];

  const logs: APIAccessLog[] = [];

  for (let i = 0; i < 100; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
    
    // Most responses are fast, some are slow
    let responseTime = Math.floor(Math.random() * 500) + 50; // 50-550ms
    if (Math.random() < 0.1) {
      responseTime = Math.floor(Math.random() * 2000) + 1000; // 1000-3000ms for slow requests
    }

    // Most responses are successful
    const statusCode = Math.random() < 0.95 ? 200 : (Math.random() < 0.5 ? 400 : 500);

    logs.push({
      id: `api-log-${i}`,
      endpoint,
      method,
      user_id: user.id,
      user_email: user.email,
      timestamp: subHours(now, hoursAgo).toISOString(),
      response_time: responseTime,
      status_code: statusCode,
    });
  }

  // Sort by timestamp descending
  return logs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Initialize sample data in KV store
export async function initializeSampleSecurityData() {
  // This would be called on first load to populate KV store with demo data
  // In a real implementation, this would use the KV store API
  const loginAttempts = generateSampleLoginAttempts();
  const apiLogs = generateSampleAPILogs();

  console.log('📊 Sample security audit data generated:');
  console.log(`  - ${loginAttempts.length} login attempts`);
  console.log(`  - ${apiLogs.length} API access logs`);

  return {
    loginAttempts,
    apiLogs,
  };
}
