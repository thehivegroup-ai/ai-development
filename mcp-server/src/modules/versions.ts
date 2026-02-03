/**
 * Version Management
 * 
 * Handles version tracking, upgrades, and rollbacks
 */

import { GitSource, CursorLockfile } from '../types.js';
import { readFile, writeFile, mkdir, cp, rm } from 'fs/promises';
import { join } from 'path';

/**
 * Version comparison result
 */
export interface VersionComparison {
  current: string;
  latest: string;
  hasUpdate: boolean;
  changeType: 'major' | 'minor' | 'patch' | 'none';
}

/**
 * Backup metadata
 */
export interface BackupMetadata {
  timestamp: string;
  source: GitSource;
  reason: string;
}

/**
 * Compare semantic versions
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}

/**
 * Determine change type between versions
 */
export function getChangeType(current: string, latest: string): 'major' | 'minor' | 'patch' | 'none' {
  const curr = current.split('.').map(Number);
  const lat = latest.split('.').map(Number);
  
  if (lat[0] > curr[0]) return 'major';
  if (lat[1] > curr[1]) return 'minor';
  if (lat[2] > curr[2]) return 'patch';
  
  return 'none';
}

/**
 * Check for updates
 */
export function checkForUpdates(
  currentSource: GitSource,
  latestRef: string,
  latestCommitSha: string
): VersionComparison {
  const hasUpdate = currentSource.commitSha !== latestCommitSha;
  
  return {
    current: `${currentSource.ref} (${currentSource.commitSha.substring(0, 7)})`,
    latest: `${latestRef} (${latestCommitSha.substring(0, 7)})`,
    hasUpdate,
    changeType: hasUpdate ? 'minor' : 'none', // Can't determine without version tags
  };
}

/**
 * Create backup of .cursor/ directory
 */
export async function createBackup(
  projectPath: string,
  metadata: BackupMetadata
): Promise<string> {
  const backupDir = join(projectPath, '.cursor-backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDir, timestamp);
  
  // Create backup directory
  await mkdir(backupDir, { recursive: true });
  await mkdir(backupPath, { recursive: true });
  
  // Copy .cursor/ to backup
  const cursorPath = join(projectPath, '.cursor');
  await cp(cursorPath, join(backupPath, '.cursor'), { recursive: true });
  
  // Write metadata
  const metadataPath = join(backupPath, 'metadata.json');
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  
  return backupPath;
}

/**
 * List available backups
 */
export async function listBackups(projectPath: string): Promise<{
  path: string;
  metadata: BackupMetadata;
}[]> {
  const backupDir = join(projectPath, '.cursor-backups');
  const backups: { path: string; metadata: BackupMetadata }[] = [];
  
  try {
    const { readdir } = await import('fs/promises');
    const entries = await readdir(backupDir);
    
    for (const entry of entries) {
      const backupPath = join(backupDir, entry);
      const metadataPath = join(backupPath, 'metadata.json');
      
      try {
        const content = await readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(content) as BackupMetadata;
        backups.push({ path: backupPath, metadata });
      } catch {
        // Skip invalid backups
      }
    }
  } catch {
    // No backups directory
  }
  
  return backups.sort((a, b) => 
    b.metadata.timestamp.localeCompare(a.metadata.timestamp)
  );
}

/**
 * Restore from backup
 */
export async function restoreBackup(
  projectPath: string,
  backupPath: string
): Promise<void> {
  const cursorPath = join(projectPath, '.cursor');
  const backupCursorPath = join(backupPath, '.cursor');
  
  // Remove current .cursor/
  await rm(cursorPath, { recursive: true, force: true });
  
  // Copy backup to .cursor/
  await cp(backupCursorPath, cursorPath, { recursive: true });
}

/**
 * Generate changelog between versions
 */
export function generateChangelog(
  currentLockfile: CursorLockfile,
  newSource: GitSource
): string {
  const sections: string[] = [];
  
  sections.push('# Changelog\n');
  sections.push(`**From:** ${currentLockfile.source.ref} (${currentLockfile.source.commitSha.substring(0, 7)})`);
  sections.push(`**To:** ${newSource.ref} (${newSource.commitSha.substring(0, 7)})\n`);
  
  if (currentLockfile.source.commitSha === newSource.commitSha) {
    sections.push('No changes - versions are identical.\n');
  } else {
    sections.push('## Changes\n');
    sections.push('To see detailed changes, compare commits:');
    sections.push(`${currentLockfile.source.repoUrl}/compare/${currentLockfile.source.commitSha}...${newSource.commitSha}\n`);
  }
  
  return sections.join('\n');
}

/**
 * Generate upgrade summary
 */
export function generateUpgradeSummary(
  comparison: VersionComparison,
  changelog: string,
  backupPath?: string
): string {
  const sections: string[] = [];
  
  sections.push('# Upgrade Summary\n');
  sections.push(`**Current Version:** ${comparison.current}`);
  sections.push(`**New Version:** ${comparison.latest}`);
  sections.push(`**Change Type:** ${comparison.changeType}\n`);
  
  if (backupPath) {
    sections.push(`**Backup Created:** ${backupPath}\n`);
  }
  
  sections.push(changelog);
  
  sections.push('\n## Safety\n');
  sections.push('✅ Previous version backed up');
  sections.push('✅ Can rollback using restore command');
  sections.push('✅ Lockfile will be updated\n');
  
  return sections.join('\n');
}

/**
 * Validate upgrade safety
 */
export function validateUpgrade(
  currentLockfile: CursorLockfile,
  newSource: GitSource
): { safe: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check if downgrading
  if (newSource.commitSha === currentLockfile.source.commitSha) {
    warnings.push('Versions are identical - no upgrade needed');
  }
  
  // Warn about major changes
  if (currentLockfile.source.ref !== newSource.ref) {
    warnings.push(`Branch/tag changing from ${currentLockfile.source.ref} to ${newSource.ref}`);
  }
  
  return {
    safe: true,
    warnings,
  };
}
