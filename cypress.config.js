const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8080',
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        viewportWidth: 375,
        viewportHeight: 667,
        experimentalStudio: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        }
    },
    env: {
        apiUrl: 'http://localhost:3000/api',
        testEmail: 'testing.user@prepaidplus.co.bw',
        testPassword: 'aP+gUFV7ArbEZx+4GfvpaA==:GHfqQIKB0kxvblc4fdQ/jg=='
    }
});