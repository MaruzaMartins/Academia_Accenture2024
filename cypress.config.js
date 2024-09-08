const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1280,
    viewportHeight: 720,
    watchForFileChanges: false,
    specPattern: 'cypress/e2e/tricentis-01.feature',
    baseUrl: 'http://sampleapp.tricentis.com/101/app.php',

    setupNodeEvents(on, config) {
      const cucumber = require('cypress-cucumber-preprocessor').default
      on('file:preprocessor', cucumber())

      // return {
      //   stepDefinitions: 'cypress/support/step_definitions'
      // };
    },
  },
});
