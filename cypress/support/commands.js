/** The app marks every interactive element with data-testid, so that is the only locator strategy used. */
Cypress.Commands.add('getByTestId', (id, options) => cy.get(`[data-testid="${id}"]`, options));
