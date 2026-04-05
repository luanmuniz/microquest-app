import { promises as fs } from 'node:fs';
import { type Download } from '@playwright/test';
import type { QuestDataSnapshot } from './state';

export function createImportFile(
  name: string,
  content: string,
  mimeType = 'application/json',
) {
  return {
    name,
    mimeType,
    buffer: Buffer.from(content, 'utf8'),
  };
}

export function createSnapshotImportFile(name: string, snapshot: QuestDataSnapshot) {
  return createImportFile(name, JSON.stringify(snapshot, null, 2));
}

export function createCsvImportFile(name: string, csvContent: string) {
  return createImportFile(name, csvContent, 'text/csv');
}

export async function readDownloadText(download: Download): Promise<string> {
  const filePath = await download.path();
  if (filePath) {
    return fs.readFile(filePath, 'utf8');
  }

  const stream = await download.createReadStream();
  if (!stream) {
    throw new Error('Could not read downloaded file stream.');
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve());
    stream.on('error', (error) => reject(error));
  });

  return Buffer.concat(chunks).toString('utf8');
}

export async function readDownloadJson(download: Download): Promise<QuestDataSnapshot> {
  const text = await readDownloadText(download);
  return JSON.parse(text) as QuestDataSnapshot;
}
