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
  });

  describe('validateEmail', () => {
    test('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('should validate correct phone number', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('0123456789')).toBe(true);
      expect(validatePhone('+84 123 456 789')).toBe(true);
    });

    test('should reject invalid phone number', () => {
      expect(validatePhone('abc-def-ghij')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });
});