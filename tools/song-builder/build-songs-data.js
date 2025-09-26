#!/usr/bin/env node
/**
 * songs-data.js 生成スクリプト（雛形・未統合）
 * - songs/*.json を読み込み、現行の songs-data.js 構造をstdoutに出力
 * - 現状は導入の雛形。CIやビルドには組み込みません。
 */

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const songsDir = path.join(root, 'songs');

function readSongs() {
  if (!fs.existsSync(songsDir)) {
    return [];
  }
  const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.json'));
  const items = [];
  for (const file of files) {
    const p = path.join(songsDir, file);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!data.id || !data.title || !data.reading || !data.releaseDate || !data.linkUrl) {
      console.error(`Invalid song JSON: ${file}`);
      process.exit(1);
    }
    items.push(data);
  }
  return items;
}

function toJsStringLiteral(text = '') {
  // バッククォートは許容しない前提
  if (text.includes('`')) {
    console.error('lyrics にバッククォートは使用できません');
    process.exit(1);
  }
  return text;
}

function buildJs(songs) {
  const lines = [];
  lines.push('// 自動生成: tools/song-builder/build-songs-data.js');
  lines.push('');
  lines.push('const songsData = {');
  for (const s of songs) {
    lines.push(`  ${s.id}: {`);
    lines.push(`    title: '${s.title}',`);
    lines.push(`    reading: '${s.reading}',`);
    lines.push(`    album: '${s.album || ''}',`);
    lines.push(`    albumReading: '${s.albumReading || ''}',`);
    lines.push(`    releaseDate: '${s.releaseDate}',`);
    lines.push(`    linkUrl: '${s.linkUrl}',`);
    lines.push('    lyrics: `' + toJsStringLiteral(s.lyrics || '') + '`,');
    lines.push('  },');
  }
  lines.push('};');
  lines.push('');
  lines.push('const searchSortConfig = {');
  lines.push("  defaultSort: 'releaseDate',");
  lines.push("  defaultOrder: 'desc',");
  lines.push("  searchFields: ['title', 'album'],");
  lines.push('  itemsPerPage: 20,');
  lines.push('};');
  lines.push('');
  lines.push('function getSongsArray() {');
  lines.push('  return Object.entries(songsData).map(([id, data]) => ({ id, ...data }));');
  lines.push('}');
  lines.push('');
  lines.push("if (typeof module !== 'undefined' && module.exports) {");
  lines.push('  module.exports = { songsData, searchSortConfig, getSongsArray };');
  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

const songs = readSongs();
const js = buildJs(songs);
process.stdout.write(js);
