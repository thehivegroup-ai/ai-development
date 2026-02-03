#!/usr/bin/env ts-node

/**
 * Visual Parity Capture Script
 * 
 * Captures screenshots from production and local environments for comparison
 */

import { chromium, Browser, Page } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

interface PageConfig {
  path: string;
  name: string;
  waitFor?: string; // CSS selector to wait for
  waitTimeout?: number;
}

interface CaptureConfig {
  baseUrl: string;
  outputDir: string;
  pages: PageConfig[];
  viewports: ViewportConfig[];
  authentication?: {
    loginUrl: string;
    username: string;
    password: string;
    usernameSelector: string;
    passwordSelector: string;
    submitSelector: string;
  };
}

/**
 * Authenticate if needed
 */
async function authenticate(page: Page, auth: CaptureConfig['authentication']): Promise<void> {
  if (!auth) return;

  console.log(`  Authenticating at ${auth.loginUrl}...`);
  
  await page.goto(auth.loginUrl);
  await page.fill(auth.usernameSelector, auth.username);
  await page.fill(auth.passwordSelector, auth.password);
  await page.click(auth.submitSelector);
  
  // Wait for navigation after login
  await page.waitForLoadState('networkidle');
  
  console.log(`  ✅ Authenticated`);
}

/**
 * Capture screenshots for a page across viewports
 */
async function capturePage(
  browser: Browser,
  config: CaptureConfig,
  pageConfig: PageConfig,
  viewport: ViewportConfig
): Promise<string> {
  const context = await browser.newContext({
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
  });

  const page = await context.newPage();

  try {
    // Authenticate if needed
    await authenticate(page, config.authentication);

    // Navigate to page
    const url = `${config.baseUrl}${pageConfig.path}`;
    console.log(`    Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for specific element if specified
    if (pageConfig.waitFor) {
      await page.waitForSelector(pageConfig.waitFor, {
        timeout: pageConfig.waitTimeout || 10000,
      });
    }

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Create output directory
    const outputDir = join(config.outputDir, pageConfig.name, viewport.name);
    await mkdir(outputDir, { recursive: true });

    // Capture screenshot
    const screenshotPath = join(outputDir, 'screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`    ✅ Captured: ${screenshotPath}`);

    return screenshotPath;
  } finally {
    await context.close();
  }
}

/**
 * Capture all screenshots
 */
export async function captureAll(config: CaptureConfig): Promise<void> {
  console.log(`\n📸 Starting capture for ${config.baseUrl}\n`);

  const browser = await chromium.launch();

  try {
    for (const pageConfig of config.pages) {
      console.log(`\n  Page: ${pageConfig.name}`);

      for (const viewport of config.viewports) {
        console.log(`    Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
        await capturePage(browser, config, pageConfig, viewport);
      }
    }

    console.log(`\n✅ All captures complete\n`);
  } finally {
    await browser.close();
  }
}

/**
 * Generate capture report
 */
async function generateCaptureReport(config: CaptureConfig, duration: number): Promise<void> {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: config.baseUrl,
    pages: config.pages.length,
    viewports: config.viewports.length,
    totalScreenshots: config.pages.length * config.viewports.length,
    duration,
  };

  const reportPath = join(config.outputDir, 'capture-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n📊 Report: ${reportPath}`);
  console.log(`   Pages: ${report.pages}`);
  console.log(`   Viewports: ${report.viewports}`);
  console.log(`   Screenshots: ${report.totalScreenshots}`);
  console.log(`   Duration: ${report.duration}ms\n`);
}

/**
 * Main function
 */
async function main() {
  const configPath = process.argv[2] || './visual-parity.config.json';

  console.log(`Loading config from ${configPath}...`);

  const { readFile } = await import('fs/promises');
  const configContent = await readFile(configPath, 'utf-8');
  const config = JSON.parse(configContent) as CaptureConfig;

  const startTime = Date.now();

  await captureAll(config);

  const duration = Date.now() - startTime;
  await generateCaptureReport(config, duration);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Capture failed:', error);
    process.exit(1);
  });
}

export { captureAll, CaptureConfig, PageConfig, ViewportConfig };
