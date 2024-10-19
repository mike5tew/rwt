
 import { defineConfig } from 'vite'
 // Import the NodeGlobalsPolyfillPlugin
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// Export the Vite config

export default defineConfig({
    plugins: [
        // Add the NodeGlobalsPolyfillPlugin to the plugins array
        NodeGlobalsPolyfillPlugin()
    ]
    })
// This will fix the issue with the environment variables not being loaded in the esbuild

