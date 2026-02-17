import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { request } from 'https';
import { request as httpRequest } from 'http';
import { resolve } from 'path';

// Load env files (.env.local first, then .env.production as fallback)
// Earlier files take priority — existing vars are not overwritten
for (const envFile of ['.env.local', '.env.production']) {
  try {
    const envContent = readFileSync(resolve(process.cwd(), envFile), 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch {
    // env file may not exist
  }
}

const CNAME_DOMAIN = 'uno.leoleal.dev';

// ── Helpers ──────────────────────────────────────────────

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function run(cmd: string): void {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
}

// ── GitHub Pages Deploy ──────────────────────────────────

async function deployWebApp(): Promise<void> {
  console.log('\n--- Deploying Web App to GitHub Pages ---\n');

  // Build
  run('npx vite build');

  // Write CNAME file into dist/
  const distPath = resolve(process.cwd(), 'dist');
  writeFileSync(resolve(distPath, 'CNAME'), CNAME_DOMAIN);
  console.log(`  Wrote CNAME (${CNAME_DOMAIN}) to dist/`);

  // Push to gh-pages branch
  run('npx gh-pages -d dist');

  console.log(`\n  Web app deployed to https://${CNAME_DOMAIN}`);
}

// ── Render Deploy ────────────────────────────────────────

function deploySignalingServer(): Promise<void> {
  console.log('\n--- Deploying Signaling Server to Render ---\n');

  const hookUrl = process.env.RENDER_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    console.error('  Error: RENDER_DEPLOY_HOOK_URL is not set in .env.local');
    console.error('  Get your deploy hook URL from Render dashboard:');
    console.error('  Service → Settings → Deploy Hook');
    return Promise.reject(new Error('Missing RENDER_DEPLOY_HOOK_URL'));
  }

  return new Promise((resolve, reject) => {
    const url = new URL(hookUrl);
    const reqFn = url.protocol === 'https:' ? request : httpRequest;

    const req = reqFn(url, { method: 'POST' }, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`  Deploy triggered successfully (HTTP ${res.statusCode})`);
        console.log('  Render will rebuild from the latest push to main.');
        resolve();
      } else {
        console.error(`  Deploy hook returned HTTP ${res.statusCode}`);
        reject(new Error(`Deploy hook failed with status ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.error(`  Error triggering deploy hook: ${err.message}`);
      reject(err);
    });

    req.end();
  });
}

// ── Main ─────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('P2P Uno — Deploy\n');
  console.log('  1) Web app → GitHub Pages (uno.leoleal.dev)');
  console.log('  2) Signaling server → Render');
  console.log('  3) Both\n');

  const choice = await ask('Select an option (1/2/3): ');

  switch (choice) {
    case '1':
      await deployWebApp();
      break;
    case '2':
      await deploySignalingServer();
      break;
    case '3':
      await deployWebApp();
      await deploySignalingServer();
      break;
    default:
      console.error(`Invalid option: "${choice}". Expected 1, 2, or 3.`);
      process.exit(1);
  }

  console.log('\nDone!');
  process.exit(0);
}

main().catch((err) => {
  console.error('\nDeploy failed:', err.message);
  process.exit(1);
});
