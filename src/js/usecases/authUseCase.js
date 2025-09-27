import { AuthService } from '../services/authService';

export class AuthUseCase {
    constructor() {
        this.authService = new AuthService();
    }

    async executeLogin(email, password) {
        // Basic validation
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, error: 'Please enter a valid email address' };
        }

        return await this.authService.login(email, password);
    }

    async executeRegistration(merchantData) {
        // Basic validation
        const requiredFields = ['name', 'email', 'phone', 'businessName'];
        for (const field of requiredFields) {
            if (!merchantData[field]) {
                return { success: false, error: `${field} is required` };
            }
        }

        if (!this.isValidEmail(merchantData.email)) {
            return { success: false, error: 'Please enter a valid email address' };
        }

        return await this.authService.register(merchantData);
    }

    async executePasswordResetRequest(email) {
        if (!email || !this.isValidEmail(email)) {
            return { success: false, error: 'Please enter a valid email address' };
        }

        return await this.authService.requestPasswordReset(email);
    }

    async executePasswordReset(token, newPassword, confirmPassword) {
        if (!newPassword || !confirmPassword) {
            return { success: false, error: 'Please enter and confirm your new password' };
        }

        if (newPassword !== confirmPassword) {
            return { success: false, error: 'Passwords do not match' };
        }

        if (newPassword.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters long' };
        }

        return await this.authService.resetPassword(token, newPassword);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    checkAuthentication() {
        return this.authService.isAuthenticated();
    }

    async initializeAuth() {
        const authData = await this.authService.getStoredAuthData();
        if (authData) {
            this.authService.storeAuthData(authData);
        }
        return authData;
    }
}