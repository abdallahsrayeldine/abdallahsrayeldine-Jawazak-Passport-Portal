import { describe, it, expect } from 'vitest';
import { isPasswordValid, allFieldsFilled } from '../utils/validation';

describe('validation utilities', () => {
    it('validates a good password', () => {
        const pw = 'Abcdef1!';
        const res = isPasswordValid(pw);
        expect(res.valid).toBe(true);
        expect(res.reasons).toHaveLength(0);
    });

    it('rejects short or weak passwords', () => {
        expect(isPasswordValid('short').valid).toBe(false);
        expect(isPasswordValid('alllowercase1').valid).toBe(false);
        expect(isPasswordValid('ALLUPPER1!').valid).toBe(false);
        expect(isPasswordValid('NoNumber!').valid).toBe(false);
    });

    it('checks that required fields are non-empty', () => {
        const obj = { a: 'x', b: ' ', c: 'value' };
        expect(allFieldsFilled(obj, ['a', 'c'])).toBe(true);
        expect(allFieldsFilled(obj, ['a', 'b', 'c'])).toBe(false);
    });
});
