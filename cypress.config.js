const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports',
    reportPageTitle: 'FoodDash UI',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  video: false,
  viewportWidth: 1366,
  viewportHeight: 900,
  retries: { runMode: 1, openMode: 0 },
  e2e: {
    // Override with CYPRESS_BASE_URL to run against a local or staging build.
    baseUrl: 'https://www.practiceqaautomation.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      require('@cypress/grep/plugin').plugin(config);
      return config;
    },
  },
});
