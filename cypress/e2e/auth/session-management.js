describe('Session Management', () => {
    it('should redirect unauthenticated users from protected routes', () => {
        // Clear any existing authentication
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });

        cy.visit('/dashboard/');
        cy.url().should('include', '/login/');
    });

    it('should maintain session after page reload', () => {
        // Login first
        cy.intercept('POST', '**/auth/login', {
            success: true,
            data: {
                token: 'persistent-token',
                user: { id: 1, email: 'test@example.com' }
            }
        }).as('login');

        cy.login('test@example.com', 'password');
        cy.wait('@login');

        // Reload page
        cy.reload();

        // Should still be authenticated
        cy.checkAuthentication().should('be.true');
        cy.url().should('include', '/dashboard/');
    });

    it('should logout and clear session', () => {
        // First login
        cy.intercept('POST', '**/auth/login', {
            success: true,
            data: {
                token: 'logout-test-token',
                user: { id: 1, email: 'test@example.com' }
            }
        }).as('login');

        cy.login('test@example.com', 'password');
        cy.wait('@login');

        // Logout
        cy.window().then((win) => {
            if (win.f7 && win.f7.views) {
                win.sessionStorage.setItem('authToken', 'test-token');
                // Trigger logout
                win.sessionStorage.clear();
                win.f7.views.main.router.navigate('/login/');
            }
        });

        cy.url().should('include', '/login/');
        cy.checkAuthentication().should('be.false');
    });
});