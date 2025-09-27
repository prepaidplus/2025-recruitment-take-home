describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login/');
    });

    it('should display login page correctly', () => {
        cy.contains('Login');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        cy.contains('Forgot Password?').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
        cy.get('button[type="submit"]').click();
        
        // Framework7 typically shows validation errors
        cy.get('input[name="email"]').should('have.class', 'invalid');
        cy.get('input[name="password"]').should('have.class', 'invalid');
    });

    it('should show error for invalid email format', () => {
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click();
        
        cy.get('.error-message').should('be.visible');
    });

    it('should successfully login with valid credentials', () => {
        // Mock successful API response
        cy.intercept('POST', '**/auth/login', {
            success: true,
            data: {
                token: 'mock-jwt-token',
                user: {
                    id: 1,
                    email: Cypress.env('testEmail'),
                    name: 'Test User'
                }
            }
        }).as('loginRequest');

        cy.get('input[name="email"]').type(Cypress.env('testEmail'));
        cy.get('input[name="password"]').type('testPassword123');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard/');
    });

    it('should show error message for invalid credentials', () => {
        cy.intercept('POST', '**/auth/login', {
            success: false,
            message: 'Invalid email or password'
        }).as('loginRequest');

        cy.get('input[name="email"]').type('wrong@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');
        cy.get('.error-message').should('contain', 'Invalid email or password');
    });

    it('should navigate to forgot password page', () => {
        cy.contains('Forgot Password?').click();
        cy.url().should('include', '/forgot-password/');
    });
});