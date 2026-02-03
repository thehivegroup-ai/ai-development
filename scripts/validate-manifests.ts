#!/usr/bin/env node

/**
 * Validate module.json manifests against schema
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import Ajv from 'ajv';

const ajv = new Ajv({ strict: false });

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: any[];
}

/**
 * Find all module.json files recursively
 */
async function findManifests(dir: string, results: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await findManifests(fullPath, results);
    } else if (entry.name === 'module.json') {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Validate a single manifest file
 */
async function validateManifest(
  manifestPath: string,
  schema: any
): Promise<ValidationResult> {
  try {
    const content = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    const validate = ajv.compile(schema);
    const valid = validate(manifest);
    
    return {
      file: manifestPath,
      valid,
      errors: validate.errors || undefined,
    };
  } catch (error) {
    return {
      file: manifestPath,
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
    };
  }
}

/**
 * Main validation function
 */
async function main() {
  const projectRoot = join(process.cwd(), '..');
  const schemaPath = join(projectRoot, 'schemas', 'module.schema.json');
  const modulesDir = join(projectRoot, 'modules');
  
  console.log('Loading schema...');
  const schemaContent = await readFile(schemaPath, 'utf-8');
  const schema = JSON.parse(schemaContent);
  
  console.log('Finding manifests...');
  const manifests = await findManifests(modulesDir);
  console.log(`Found ${manifests.length} manifest files\n`);
  
  const results: ValidationResult[] = [];
  
  for (const manifestPath of manifests) {
    const result = await validateManifest(manifestPath, schema);
    results.push(result);
    
    if (result.valid) {
      console.log(`✅ ${manifestPath.replace(projectRoot + '/', '')}`);
    } else {
      console.log(`❌ ${manifestPath.replace(projectRoot + '/', '')}`);
      if (result.errors) {
        for (const error of result.errors) {
          console.log(`   ${error.instancePath || '/'}: ${error.message}`);
        }
      }
    }
  }
  
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;
  
  console.log(`\n---\nTotal: ${results.length} | Valid: ${validCount} | Invalid: ${invalidCount}`);
  
  if (invalidCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
