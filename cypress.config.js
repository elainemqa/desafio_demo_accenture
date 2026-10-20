const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    responseTimeout: 30000,
    defaultCommandTimeout: 15000,
    retries: { runMode: 2, openMode: 0 },
  },
});
