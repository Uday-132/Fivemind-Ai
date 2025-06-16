// Health check script for deployment validation
const https = require('https');
const http = require('http');

class HealthChecker {
  constructor(url, timeout = 30000) {
    this.url = url;
    this.timeout = timeout;
    this.checks = [];
  }

  addCheck(name, checkFn) {
    this.checks.push({ name, checkFn });
    return this;
  }

  async runChecks() {
    console.log(`🏥 Running health checks for: ${this.url}`);
    const results = [];

    for (const check of this.checks) {
      try {
        console.log(`⏳ Running: ${check.name}`);
        const result = await check.checkFn();
        console.log(`✅ ${check.name}: PASSED`);
        results.push({ name: check.name, status: 'PASSED', result });
      } catch (error) {
        console.log(`❌ ${check.name}: FAILED - ${error.message}`);
        results.push({ name: check.name, status: 'FAILED', error: error.message });
      }
    }

    const passed = results.filter(r => r.status === 'PASSED').length;
    const total = results.length;
    
    console.log(`\n📊 Health Check Summary: ${passed}/${total} checks passed`);
    
    if (passed === total) {
      console.log('🎉 All health checks passed! Deployment is healthy.');
      process.exit(0);
    } else {
      console.log('💥 Some health checks failed. Please investigate.');
      process.exit(1);
    }
  }

  makeRequest(path = '/') {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.url);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.get(url, { timeout: this.timeout }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.timeout}ms`));
      });

      req.on('error', reject);
    });
  }
}

// Usage example
async function runHealthChecks() {
  const url = process.argv[2] || 'http://localhost:3000';
  
  const checker = new HealthChecker(url)
    .addCheck('Homepage loads', async () => {
      const response = await checker.makeRequest('/');
      if (response.statusCode !== 200) {
        throw new Error(`Expected 200, got ${response.statusCode}`);
      }
      return 'Homepage accessible';
    })
    .addCheck('API health endpoint', async () => {
      const response = await checker.makeRequest('/api/health');
      if (response.statusCode !== 200) {
        throw new Error(`Expected 200, got ${response.statusCode}`);
      }
      return 'API is responding';
    })
    .addCheck('Database connection', async () => {
      const response = await checker.makeRequest('/api/health/db');
      if (response.statusCode !== 200) {
        throw new Error(`Database connection failed`);
      }
      return 'Database connected';
    })
    .addCheck('Essential pages load', async () => {
      const pages = ['/agents', '/profile'];
      for (const page of pages) {
        const response = await checker.makeRequest(page);
        if (response.statusCode !== 200) {
          throw new Error(`Page ${page} returned ${response.statusCode}`);
        }
      }
      return 'All essential pages accessible';
    });

  await checker.runChecks();
}

if (require.main === module) {
  runHealthChecks().catch(console.error);
}

module.exports = HealthChecker;