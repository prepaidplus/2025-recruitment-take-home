import { ApiRepository } from '../repositories/apiRepository';
import { encryptString, decryptString } from '../utils/crypto';

export class AuthService {
    constructor() {
        this.apiRepository = new ApiRepository();
        this.tokenKey = 'authToken';
        this.userKey = 'userData';
    }

    async login(email, password) {
        try {
            // Encrypt password before sending
            const encryptedPassword = encryptString(password);
            
            const response = await this.apiRepository.post('/auth/login', {
                email,
                password: encryptedPassword
            });

            if (response.success) {
                await this.storeAuthData(response.data);
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    async register(merchantData) {
        try {
            // Encrypt password if present
            if (merchantData.password) {
                merchantData.password = encryptString(merchantData.password);
            }

            const response = await this.apiRepository.post('/auth/register', merchantData);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    }

    async requestPasswordReset(email) {
        try {
            const response = await this.apiRepository.post('/auth/forgot-password', { email });
            return response;
        } catch (error) {
            console.error('Password reset request error:', error);
            return { success: false, error: 'Password reset request failed.' };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const encryptedPassword = encryptString(newPassword);
            const response = await this.apiRepository.post('/auth/reset-password', {
                token,
                password: encryptedPassword
            });
            return response;
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: 'Password reset failed.' };
        }
    }

    async storeAuthData(authData) {
        try {
            // Store in IndexedDB
            if (window.indexedDB) {
                const db = await this.getDB();
                const transaction = db.transaction(['auth'], 'readwrite');
                const store = transaction.objectStore('auth');
                
                await store.put(authData, 'currentUser');
            }
            
            // Also store in session storage for immediate access
            sessionStorage.setItem(this.tokenKey, authData.token);
            sessionStorage.setItem(this.userKey, JSON.stringify(authData.user));
        } catch (error) {
            console.error('Storage error:', error);
        }
    }

    async getStoredAuthData() {
        try {
            if (window.indexedDB) {
                const db = await this.getDB();
                const transaction = db.transaction(['auth'], 'readonly');
                const store = transaction.objectStore('auth');
                
                return new Promise((resolve) => {
                    const request = store.get('currentUser');
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => resolve(null);
                });
            }
            
            const token = sessionStorage.getItem(this.tokenKey);
            const user = sessionStorage.getItem(this.userKey);
            
            if (token && user) {
                return { token, user: JSON.parse(user) };
            }
            
            return null;
        } catch (error) {
            console.error('Retrieve auth data error:', error);
            return null;
        }
    }

    async logout() {
        try {
            if (window.indexedDB) {
                const db = await this.getDB();
                const transaction = db.transaction(['auth'], 'readwrite');
                const store = transaction.objectStore('auth');
                await store.delete('currentUser');
            }
            
            sessionStorage.removeItem(this.tokenKey);
            sessionStorage.removeItem(this.userKey);
            
            // Redirect to login page
            window.location.href = '/login/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    isAuthenticated() {
        return !!sessionStorage.getItem(this.tokenKey);
    }

    getToken() {
        return sessionStorage.getItem(this.tokenKey);
    }

    getUser() {
        const userStr = sessionStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    getDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AuthDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('auth')) {
                    db.createObjectStore('auth');
                }
            };
        });
    }
}