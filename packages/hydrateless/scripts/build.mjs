import { execSync } from 'node:child_process';
import { readdirSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

for (const file of readdirSync('src').filter((f) => f.endsWith('.css'))) {
  execSync(`postcss src/${file} -o dist/${file}`, { stdio: 'inherit' });
}
