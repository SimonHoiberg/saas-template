import * as fs from 'fs';
import { resolve } from 'path';

/**
 * When 'amplify codegen' generates GraphQL files, it also generates an annoying
 * 'schema.json' file. This file is not used in this setup, and the order of
 * properties keeps changing every time the command is run - leaving a lot
 * of "noise" in each commit / PR.
 *
 * We run this script after each generation to simply delete this file.
 *
 * You can choose to remove the 'schema.json' file specifically, or remove
 * the entire 'src' folder.
 */

/**
 * Delete the 'schema.json' file specifically.
 */
function deleteSchema() {
  const APIPath = resolve(__dirname, '../src/graphql/schema.json');

  if (fs.existsSync(APIPath)) {
    fs.unlinkSync(APIPath);
  }
}

/**
 * Delete the entire source folder
 */
function deleteSource() {
  const srcPath = resolve(__dirname, '../src');

  fs.rmSync(srcPath, { recursive: true });
}

/**
 * Cleanup the GraphQL files
 */
deleteSource();
