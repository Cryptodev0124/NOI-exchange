import { defineConfig } from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] }), react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@pancakeswap/wagmi/connectors/binanceWallet': r('../../packages/wagmi/connectors/binanceWallet/index.ts'),
      '@pancakeswap/wagmi/connectors/bloom': r('../../packages/wagmi/connectors/bloom/index.ts'),
      '@pancakeswap/wagmi/connectors/miniProgram': r('../../packages/wagmi/connectors/miniProgram/index.ts'),
      '@pancakeswap/wagmi/connectors/trustWallet': r('../../packages/wagmi/connectors/trustWallet/index.ts'),
      '@pancakeswap/uikit': r('../../packages/uikit/src'),
      '@pancakeswap/localization': r('../../packages/localization/src'),
    },
  },
  test: {
    setupFiles: ['./vitest.setup.js'],
    environment: 'jsdom',
    globals: true,
    dangerouslyIgnoreUnhandledErrors: true, // wallet connect v2
    exclude: ['src/config/__tests__', 'node_modules'],
  },
})
