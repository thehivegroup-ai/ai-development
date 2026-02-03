#!/usr/bin/env ts-node

/**
 * Visual Parity Compare Script
 * 
 * Compares screenshots between production and local environments
 */

import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';

interface CompareConfig {
  productionDir: string;
  localDir: string;
  outputDir: string;
  threshold: number; // 0.1 = 10% difference allowed
  ignoreAntialiasing: boolean;
}

interface ComparisonResult {
  page: string;
  viewport: string;
  identical: boolean;
  diffPixels: number;
  diffPercent: number;
  threshold: number;
  passed: boolean;
  diffImagePath?: string;
}

/**
 * Load and decode PNG image
 */
async function loadPNG(path: string): Promise<PNG> {
  const buffer = await readFile(path);
  return PNG.sync.read(buffer);
}

/**
 * Resize image to match dimensions
 */
async function resizeImage(inputPath: string, width: number, height: number): Promise<Buffer> {
  return await sharp(inputPath)
    .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
}

/**
 * Compare two images
 */
async function compareImages(
  productionPath: string,
  localPath: string,
  outputPath: string,
  threshold: number,
  ignoreAntialiasing: boolean
): Promise<{ diffPixels: number; diffPercent: number; identical: boolean }> {
  // Load images
  const img1 = await loadPNG(productionPath);
  const img2 = await loadPNG(localPath);

  // Ensure dimensions match
  let img2Resized = img2;
  if (img1.width !== img2.width || img1.height !== img2.height) {
    console.log(`      Resizing local image from ${img2.width}x${img2.height} to ${img1.width}x${img1.height}`);
    const resized = await resizeImage(localPath, img1.width, img1.height);
    img2Resized = PNG.sync.read(resized);
  }

  // Create diff image
  const diff = new PNG({ width: img1.width, height: img1.height });

  // Compare
  const diffPixels = pixelmatch(
    img1.data,
    img2Resized.data,
    diff.data,
    img1.width,
    img1.height,
    {
      threshold,
      includeAA: !ignoreAntialiasing,
    }
  );

  // Write diff image
  await writeFile(outputPath, PNG.sync.write(diff));

  const totalPixels = img1.width * img1.height;
  const diffPercent = (diffPixels / totalPixels) * 100;
  const identical = diffPixels === 0;

  return { diffPixels, diffPercent, identical };
}

/**
 * Find all screenshots to compare
 */
async function findScreenshots(dir: string): Promise<Map<string, string>> {
  const screenshots = new Map<string, string>();

  async function scan(currentDir: string, relativePath: string = '') {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      const relPath = relativePath ? join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await scan(fullPath, relPath);
      } else if (entry.name === 'screenshot.png') {
        screenshots.set(relativePath, fullPath);
      }
    }
  }

  await scan(dir);
  return screenshots;
}

/**
 * Compare all screenshots
 */
export async function compareAll(config: CompareConfig): Promise<ComparisonResult[]> {
  console.log(`\n🔍 Starting comparison\n`);
  console.log(`  Production: ${config.productionDir}`);
  console.log(`  Local: ${config.localDir}`);
  console.log(`  Threshold: ${config.threshold * 100}%\n`);

  // Find all screenshots
  const productionScreenshots = await findScreenshots(config.productionDir);
  const localScreenshots = await findScreenshots(config.localDir);

  const results: ComparisonResult[] = [];

  // Create output directory
  await mkdir(config.outputDir, { recursive: true });

  // Compare each screenshot
  for (const [pagePath, prodPath] of productionScreenshots) {
    const localPath = localScreenshots.get(pagePath);

    if (!localPath) {
      console.log(`  ⚠️  Missing local screenshot: ${pagePath}`);
      continue;
    }

    const [page, viewport] = pagePath.split('/');

    console.log(`  Comparing: ${page} / ${viewport}`);

    const diffPath = join(config.outputDir, page, viewport, 'diff.png');
    await mkdir(join(config.outputDir, page, viewport), { recursive: true });

    const comparison = await compareImages(
      prodPath,
      localPath,
      diffPath,
      config.threshold,
      config.ignoreAntialiasing
    );

    const passed = comparison.diffPercent <= config.threshold * 100;

    results.push({
      page,
      viewport,
      identical: comparison.identical,
      diffPixels: comparison.diffPixels,
      diffPercent: comparison.diffPercent,
      threshold: config.threshold * 100,
      passed,
      diffImagePath: passed ? undefined : diffPath,
    });

    if (comparison.identical) {
      console.log(`    ✅ Identical`);
    } else if (passed) {
      console.log(`    ✅ Passed (${comparison.diffPercent.toFixed(2)}% diff, under ${config.threshold * 100}% threshold)`);
    } else {
      console.log(`    ❌ Failed (${comparison.diffPercent.toFixed(2)}% diff, exceeds ${config.threshold * 100}% threshold)`);
      console.log(`       Diff: ${diffPath}`);
    }
  }

  return results;
}

/**
 * Generate HTML report
 */
async function generateHTMLReport(
  config: CompareConfig,
  results: ComparisonResult[]
): Promise<string> {
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Parity Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; background: #f5f5f5; }
    .header { background: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    .summary { display: flex; gap: 2rem; margin-top: 1rem; }
    .stat { padding: 1rem; background: #f9f9f9; border-radius: 4px; }
    .stat-label { font-size: 0.875rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 2rem; font-weight: bold; margin-top: 0.5rem; }
    .stat.passed .stat-value { color: #22c55e; }
    .stat.failed .stat-value { color: #ef4444; }
    .result { background: white; padding: 2rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .result.failed { border-left: 4px solid #ef4444; }
    .result.passed { border-left: 4px solid #22c55e; }
    .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .result-title { font-size: 1.25rem; font-weight: 600; }
    .result-status { padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; }
    .result-status.passed { background: #dcfce7; color: #166534; }
    .result-status.failed { background: #fee2e2; color: #991b1b; }
    .result-meta { color: #666; font-size: 0.875rem; margin-bottom: 1rem; }
    .images { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .image-container { }
    .image-label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.875rem; }
    .image-container img { width: 100%; border: 1px solid #e5e5e5; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Parity Report</h1>
    <p>Generated: ${new Date().toISOString()}</p>
    <div class="summary">
      <div class="stat">
        <div class="stat-label">Total</div>
        <div class="stat-value">${total}</div>
      </div>
      <div class="stat passed">
        <div class="stat-label">Passed</div>
        <div class="stat-value">${passed}</div>
      </div>
      <div class="stat failed">
        <div class="stat-label">Failed</div>
        <div class="stat-value">${failed}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Threshold</div>
        <div class="stat-value">${config.threshold * 100}%</div>
      </div>
    </div>
  </div>

  ${results.map(result => `
    <div class="result ${result.passed ? 'passed' : 'failed'}">
      <div class="result-header">
        <div class="result-title">${result.page} - ${result.viewport}</div>
        <div class="result-status ${result.passed ? 'passed' : 'failed'}">
          ${result.passed ? '✅ PASSED' : '❌ FAILED'}
        </div>
      </div>
      <div class="result-meta">
        ${result.identical ? 'Pixel-perfect match' : `${result.diffPixels.toLocaleString()} pixels different (${result.diffPercent.toFixed(2)}%)`}
      </div>
      ${!result.identical ? `
        <div class="images">
          <div class="image-container">
            <div class="image-label">Production</div>
            <img src="../${config.productionDir}/${result.page}/${result.viewport}/screenshot.png" alt="Production">
          </div>
          <div class="image-container">
            <div class="image-label">Local</div>
            <img src="../${config.localDir}/${result.page}/${result.viewport}/screenshot.png" alt="Local">
          </div>
          ${result.diffImagePath ? `
            <div class="image-container">
              <div class="image-label">Difference</div>
              <img src="${result.page}/${result.viewport}/diff.png" alt="Diff">
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `).join('')}

</body>
</html>
  `;

  const reportPath = join(config.outputDir, 'report.html');
  await writeFile(reportPath, html, 'utf-8');

  return reportPath;
}

/**
 * Main comparison function
 */
async function main() {
  const configPath = process.argv[2] || './visual-compare.config.json';

  console.log(`Loading comparison config from ${configPath}...`);

  const configContent = await readFile(configPath, 'utf-8');
  const config = JSON.parse(configContent) as CompareConfig;

  const startTime = Date.now();

  const results = await compareAll(config);

  const duration = Date.now() - startTime;

  // Generate HTML report
  const reportPath = await generateHTMLReport(config, results);

  // Generate JSON report
  const jsonReportPath = join(config.outputDir, 'results.json');
  await writeFile(
    jsonReportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        config,
        results,
        summary: {
          total: results.length,
          passed: results.filter(r => r.passed).length,
          failed: results.filter(r => !r.passed).length,
          identical: results.filter(r => r.identical).length,
        },
        duration,
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log(`\n📊 HTML Report: ${reportPath}`);
  console.log(`📊 JSON Report: ${jsonReportPath}\n`);

  const failedCount = results.filter(r => !r.passed).length;

  if (failedCount > 0) {
    console.log(`\n❌ ${failedCount} comparison(s) failed\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ All comparisons passed\n`);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Comparison failed:', error);
    process.exit(1);
  });
}

export { compareAll, CompareConfig, ComparisonResult };
