const { AuthService } = require('../authService');
const { ApiRepository } = require('../../repositories/apiRepository');

jest.mock('../../repositories/apiRepository');

describe('AuthService', () => {
    let authService;
    let mockApiRepository;

    beforeEach(() => {
        mockApiRepository = {
            post: jest.fn()
        };
        ApiRepository.mockImplementation(() => mockApiRepository);
        
        authService = new AuthService();
        
        // Clear mocks
        jest.clearAllMocks();
    });

    describe('login', () => {
        test('should login successfully with valid credentials', async () => {
            const mockResponse = {
                success: true,
                data: {
                    token: 'mockToken',
                    user: { id: 1, email: 'test@example.com' }
                }
            };
            
            mockApiRepository.post.mockResolvedValue(mockResponse);

            const result = await authService.login('test@example.com', 'password123');

            expect(mockApiRepository.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: expect.any(String) // encrypted password
            });
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockResponse.data);
        });

        test('should handle login failure', async () => {
            const mockResponse = {
                success: false,
                message: 'Invalid credentials'
            };
            
            mockApiRepository.post.mockResolvedValue(mockResponse);

            const result = await authService.login('test@example.com', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid credentials');
        });

        test('should handle network errors', async () => {
            mockApiRepository.post.mockRejectedValue(new Error('Network error'));

            const result = await authService.login('test@example.com', 'password123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Login failed. Please try again.');
        });
    });

    describe('registration', () => {
        test('should register merchant successfully', async () => {
            const merchantData = {
                name: 'Test Merchant',
                email: 'merchant@example.com',
                phone: '1234567890',
                businessName: 'Test Business'
            };
            
            const mockResponse = { success: true, data: { id: 1 } };
            mockApiRepository.post.mockResolvedValue(mockResponse);

            const result = await authService.register(merchantData);

            expect(mockApiRepository.post).toHaveBeenCalledWith('/auth/register', {
                ...merchantData,
                password: undefined
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('password reset', () => {
        test('should request password reset successfully', async () => {
            const mockResponse = { success: true };
            mockApiRepository.post.mockResolvedValue(mockResponse);

            const result = await authService.requestPasswordReset('test@example.com');

            expect(mockApiRepository.post).toHaveBeenCalledWith('/auth/forgot-password', {
                email: 'test@example.com'
            });
            expect(result).toEqual(mockResponse);
        });

        test('should reset password successfully', async () => {
            const mockResponse = { success: true };
            mockApiRepository.post.mockResolvedValue(mockResponse);

            const result = await authService.resetPassword('resetToken123', 'newPassword123');

            expect(mockApiRepository.post).toHaveBeenCalledWith('/auth/reset-password', {
                token: 'resetToken123',
                password: expect.any(String) // encrypted password
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('session management', () => {
        test('should store and retrieve auth data', async () => {
            const authData = {
                token: 'testToken',
                user: { id: 1, email: 'test@example.com' }
            };

            await authService.storeAuthData(authData);
            const storedData = await authService.getStoredAuthData();

            expect(storedData).toBeDefined();
        });

        test('should check authentication status', () => {
            // Mock sessionStorage
            Storage.prototype.getItem = jest.fn((key) => {
                if (key === 'authToken') return 'testToken';
                return null;
            });

            const isAuthenticated = authService.isAuthenticated();

            expect(isAuthenticated).toBe(true);
        });

        test('should logout correctly', async () => {
            Storage.prototype.removeItem = jest.fn();

            await authService.logout();

            expect(sessionStorage.removeItem).toHaveBeenCalledWith('authToken');
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('userData');
        });
    });
});