import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
  
    include: [
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts',
    ],

    coverage: {
      provider: 'v8',           
      enabled: true,             
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'], 


      include: ['src/**/*.ts'],
      exclude: [
        'src/tests/**',
        'tests/**',
        'dist/**',
        '**/*.d.ts',
        'vitest.config.*',
        'src/config/Config.ts',
        'src/app.ts',
        'src/mocks/**',                       //  excluidos mocks
        'src/core/payments/PaymentTypes.ts',  // sólo tipos
        'src/core/payments/strategies/PaymentStrategy.ts', // interfaz
        'src/core/payments/adapters/PaymentProvider.ts', // interfaz
        'src/core/commands/Command.ts' // interfaz
      ],
    },
  },
});
