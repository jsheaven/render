import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

import { mkdir, readdir, rename } from 'node:fs/promises';

async function copyFilesAndModifyPackageJson() {
  const filesToCopy = ['LICENSE', 'README.md'];
  const distDir = './dist';
  const subDistDir = join(distDir, 'dist');

  // create a subdirectory 'dist' inside the 'dist' directory
  await mkdir(subDistDir, { recursive: true });

  // move only files in the dist directory into the subdirectory dist
  const filesInDist = await readdir(distDir, { withFileTypes: true });
  for (const file of filesInDist) {
    if (file.isFile()) { // check if the entry is a file
      const filePath = join(distDir, file.name);
      const newFilePath = join(subDistDir, file.name);
      await rename(filePath, newFilePath);
    }
  }

  // copy LICENSE and README.md to the new dist directory
  for (const file of filesToCopy) {
    await copyFile(file, join(distDir, file));
  }

  // read, modify, and write package.json
  const packageJsonPath = 'package.json';
  const packageJsonDistPath = join(distDir, 'package.json');
  const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.exports = {
    ...packageJson.exports,
    "./server": {
      "require": {
        "types": "./dist/server.cjs.d.ts",
        "default": "./dist/server.cjs.js"
      },
      "import": {
        "types": "./dist/server.esm.d.ts",
        "default": "./dist/server.esm.js"
      }
    },
    "./client": {
      "require": {
        "types": "./dist/client.cjs.d.ts",
        "default": "./dist/client.cjs.js"
      },
      "import": {
        "types": "./dist/client.esm.d.ts",
        "default": "./dist/client.esm.js"
      }
    }
  };

  await writeFile(packageJsonDistPath, JSON.stringify(packageJson, null, 2));
}

copyFilesAndModifyPackageJson().catch(console.error);
