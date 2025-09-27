const { encryptString, decryptString } = require('../crypto');

describe('Crypto Utilities', () => {
    const testString = 'testPassword123';
    const secret = 'thisIsASecret';

    test('should encrypt a string', () => {
        const encrypted = encryptString(testString, secret);
        
        expect(encrypted).toBeDefined();
        expect(typeof encrypted).toBe('string');
        expect(encrypted).toContain(':');
    });

    test('should decrypt an encrypted string correctly', () => {
        const encrypted = encryptString(testString, secret);
        const decrypted = decryptString(encrypted, secret);
        
        expect(decrypted).toBe(testString);
    });

    test('should return false for invalid encrypted string', () => {
        const invalidEncrypted = 'invalidStringWithoutColon';
        const result = decryptString(invalidEncrypted, secret);
        
        expect(result).toBe(false);
    });

    test('should handle different secrets correctly', () => {
        const differentSecret = 'differentSecret';
        const encrypted = encryptString(testString, secret);
        const decryptedWithDifferentSecret = decryptString(encrypted, differentSecret);
        
        expect(decryptedWithDifferentSecret).not.toBe(testString);
    });
});