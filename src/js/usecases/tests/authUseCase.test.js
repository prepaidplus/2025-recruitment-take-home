const { AuthUseCase } = require('../authUseCase');
const { AuthService } = require('../../services/authService');

jest.mock('../../services/authService');

describe('AuthUseCase', () => {
    let authUseCase;
    let mockAuthService;

    beforeEach(() => {
        mockAuthService = {
            login: jest.fn(),
            register: jest.fn(),
            requestPasswordReset: jest.fn(),
            resetPassword: jest.fn(),
            isAuthenticated: jest.fn(),
            getStoredAuthData: jest.fn()
        };
        
        AuthService.mockImplementation(() => mockAuthService);
        authUseCase = new AuthUseCase();
        
        jest.clearAllMocks();
    });

    describe('executeLogin', () => {
        test('should validate required fields', async () => {
            const result = await authUseCase.executeLogin('', '');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Email and password are required');
            expect(mockAuthService.login).not.toHaveBeenCalled();
        });

        test('should validate email format', async () => {
            const result = await authUseCase.executeLogin('invalid-email', 'password');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
        });

        test('should call auth service with valid data', async () => {
            mockAuthService.login.mockResolvedValue({
                success: true,
                data: { token: 'testToken' }
            });

            const result = await authUseCase.executeLogin('valid@example.com', 'password123');

            expect(mockAuthService.login).toHaveBeenCalledWith('valid@example.com', 'password123');
            expect(result.success).toBe(true);
        });
    });

    describe('executeRegistration', () => {
        test('should validate required fields', async () => {
            const incompleteData = { name: 'Test' };
            const result = await authUseCase.executeRegistration(incompleteData);

            expect(result.success).toBe(false);
            expect(result.error).toContain('is required');
        });

        test('should validate email format', async () => {
            const merchantData = {
                name: 'Test',
                email: 'invalid-email',
                phone: '123',
                businessName: 'Test Biz'
            };
            
            const result = await authUseCase.executeRegistration(merchantData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
        });
    });

    describe('executePasswordReset', () => {
        test('should validate password match', async () => {
            const result = await authUseCase.executePasswordReset(
                'token',
                'password1',
                'password2'
            );

            expect(result.success).toBe(false);
            expect(result.error).toBe('Passwords do not match');
        });

        test('should validate password length', async () => {
            const result = await authUseCase.executePasswordReset(
                'token',
                '123',
                '123'
            );

            expect(result.success).toBe(false);
            expect(result.error).toBe('Password must be at least 6 characters long');
        });
    });

    describe('email validation', () => {
        test('should validate correct email formats', () => {
            expect(authUseCase.isValidEmail('test@example.com')).toBe(true);
            expect(authUseCase.isValidEmail('user.name@domain.co.uk')).toBe(true);
        });

        test('should reject invalid email formats', () => {
            expect(authUseCase.isValidEmail('invalid-email')).toBe(false);
            expect(authUseCase.isValidEmail('@domain.com')).toBe(false);
            expect(authUseCase.isValidEmail('user@')).toBe(false);
        });
    });
});