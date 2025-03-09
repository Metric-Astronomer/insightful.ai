import { ManifestV3Export } from '@crxjs/vite-plugin';

// Change the module declaration to match the import path in vite.config.ts
declare module './src/manifest.json' {
  const manifest: ManifestV3Export;
  export default manifest;
}