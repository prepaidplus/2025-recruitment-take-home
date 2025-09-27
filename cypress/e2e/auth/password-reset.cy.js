describe('Password Reset Flow', () => {
    describe('Forgot Password', () => {
        beforeEach(() => {
            cy.visit('/forgot-password/');
        });

        it('should display forgot password form', () => {
            cy.contains('Reset Password');
            cy.get('input[name="email"]').should('be.visible');
            cy.contains('Send Reset Link').should('be.visible');
        });

        it('should send reset link successfully', () => {
            cy.intercept('POST', '**/auth/forgot-password', {
                success: true,
                message: 'Reset link sent to your email'
            }).as('resetRequest');

            cy.get('input[name="email"]').type('test@example.com');
            cy.get('button[type="submit"]').click();

            cy.wait('@resetRequest');
            cy.get('.success-message').should('contain', 'sent to your email');
        });
    });

    describe('Reset Password', () => {
        it('should reset password with valid token', () => {
            cy.visit('/reset-password/?token=valid-reset-token');
            
            cy.intercept('POST', '**/auth/reset-password', {
                success: true,
                message: 'Password reset successful'
            }).as('resetPasswordRequest');

            cy.get('input[name="newPassword"]').type('newPassword123');
            cy.get('input[name="confirmPassword"]').type('newPassword123');
            cy.get('button[type="submit"]').click();

            cy.wait('@resetPasswordRequest');
            cy.get('.success-message').should('contain', 'reset successfully');
        });

        it('should show error for password mismatch', () => {
            cy.visit('/reset-password/?token=valid-token');
            
            cy.get('input[name="newPassword"]').type('password1');
            cy.get('input[name="confirmPassword"]').type('password2');
            cy.get('button[type="submit"]').click();

            cy.get('.error-message').should('contain', 'Passwords do not match');
        });
    });
});