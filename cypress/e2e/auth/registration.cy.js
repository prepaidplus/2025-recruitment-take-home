describe('Registration Flow', () => {
    beforeEach(() => {
        cy.visit('/register/');
    });

    it('should display registration form correctly', () => {
        cy.contains('Register Merchant');
        cy.get('input[name="businessName"]').should('be.visible');
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="phone"]').should('be.visible');
    });

    it('should show validation errors for required fields', () => {
        cy.get('button[type="submit"]').click();
        
        // Check that required fields show validation errors
        cy.get('input[name="businessName"]').should('have.class', 'invalid');
        cy.get('input[name="name"]').should('have.class', 'invalid');
        cy.get('input[name="email"]').should('have.class', 'invalid');
        cy.get('input[name="phone"]').should('have.class', 'invalid');
    });

    it('should successfully register a merchant', () => {
        cy.intercept('POST', '**/auth/register', {
            success: true,
            data: { id: 123, message: 'Merchant registered successfully' }
        }).as('registerRequest');

        const merchantData = {
            businessName: 'Test Business',
            name: 'Test Merchant',
            email: 'merchant@test.com',
            phone: '1234567890',
            address: 'Test Address'
        };

        cy.get('input[name="businessName"]').type(merchantData.businessName);
        cy.get('input[name="name"]').type(merchantData.name);
        cy.get('input[name="email"]').type(merchantData.email);
        cy.get('input[name="phone"]').type(merchantData.phone);
        cy.get('input[name="address"]').type(merchantData.address);
        
        cy.get('button[type="submit"]').click();

        cy.wait('@registerRequest');
        cy.get('.success-message').should('contain', 'registered successfully');
    });

    it('should show error for invalid email during registration', () => {
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('button[type="submit"]').click();
        
        cy.get('.error-message').should('contain', 'valid email address');
    });
});