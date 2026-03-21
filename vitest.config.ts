import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        tsconfigPaths: true
    },
    test: {
        environment: 'node',
        include: [
            'app/**/*.test.ts',
            'app/**/*.test.tsx',
            'database/**/*.test.ts',
            'database/**/*.test.tsx',
            'tests/**/*.test.ts',
            'tests/**/*.test.tsx'
        ],
        exclude: ['**/*.integration.test.ts']
    }
})