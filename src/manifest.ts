import { defineManifest, ManifestV3Export } from '@crxjs/vite-plugin';

const manifest = {
  manifest_version: 3,
  name: "insightful.ai",
  version: "1.0.0",
  description: "Chrome extension for content extraction and search",
  
  action: {
    default_popup: "popup/index.html",
    default_icon: {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },

  background: {
    service_worker: "background/index.js",
    type: "module" as const
  },

  content_scripts: [{
    matches: ["<all_urls>"],
    js: ["content/contentScript.js"]
  }],

  permissions: [
    "storage",
    "activeTab"
  ],

  host_permissions: [
    "<all_urls>"
  ]
} satisfies ManifestV3Export

export default defineManifest(manifest);

// Add this to prevent TypeScript from generating declarations
// @ts-ignore
export const __PREVENT_DECLARATION__ = true;