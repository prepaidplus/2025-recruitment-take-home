Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login/');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
    cy.window().then((win) => {
        if (win.f7 && win.f7.views) {
            win.f7.views.main.router.navigate('/logout/');
        }
    });
});

Cypress.Commands.add('checkAuthentication', () => {
    return cy.window().then((win) => {
        return win.sessionStorage.getItem('authToken') !== null;
    });
});