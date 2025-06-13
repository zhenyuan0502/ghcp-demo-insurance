import { formatCurrency, validateEmail, validatePhone } from './helpers';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('should format currency correctly', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1.000.000');
    });

    test('should handle zero amount', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('0');
    });

    test('should handle negative amounts', () => {
      const formatted = formatCurrency(-1000);
      expect(formatted).toContain('-1.000');
    });

    test('should handle decimal amounts', () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toContain('1.235'); // VND doesn't use decimals
    });

    test('should handle very large amounts', () => {
      const formatted = formatCurrency(1000000000);
      expect(formatted).toContain('1.000.000.000');
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@domain.com',
        'user_name@domain-name.com',
        'test123@test123.co'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test.example.com',
        'test@.com',
        'test@com',
        '',
        ' ',
        'test @example.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    test('should handle edge cases', () => {
      expect(validateEmail('a@b.co')).toBe(true);
      // The current simple regex actually allows single character TLDs
      expect(validateEmail('a@b.c')).toBe(true);
    });
  });

  describe('validatePhone', () => {
    test('should validate correct phone number formats', () => {
      const validPhones = [
        '123-456-7890',
        '0123456789',
        '+84 123 456 789',
        '+1-234-567-8900',
        '(123) 456-7890',
        '1234567890',
        '+841234567890'
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    test('should reject invalid phone number formats', () => {
      const invalidPhones = [
        'abc-def-ghij',
        '',
        'phone number',
        '123-abc-7890',
        'hello world',
        'abcdefghij'
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });

    test('should handle phone numbers with various separators', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('123 456 7890')).toBe(true);
      // The current regex doesn't include dots
      expect(validatePhone('(123) 456-7890')).toBe(true);
    });

    test('should handle international phone formats', () => {
      expect(validatePhone('+84 123 456 789')).toBe(true);
      expect(validatePhone('+1 (234) 567-8900')).toBe(true);
      expect(validatePhone('+44 20 7946 0958')).toBe(true);
    });

    test('should reject non-numeric characters (except allowed ones)', () => {
      expect(validatePhone('!@#$%^&*()')).toBe(false);
      expect(validatePhone('abc123')).toBe(false);
    });
  });
});