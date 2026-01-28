export function isPasswordValid(password) {
    const reasons = [];
    if (typeof password !== 'string' || password.length < 8) {
        reasons.push('minLength');
    }
    if (!/[a-z]/.test(password)) reasons.push('lowercase');
    if (!/[A-Z]/.test(password)) reasons.push('uppercase');
    if (!/[0-9]/.test(password)) reasons.push('number');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) reasons.push('special');

    return { valid: reasons.length === 0, reasons };
}

export function allFieldsFilled(obj, fields) {
    return fields.every((f) => {
        const v = obj?.[f];
        return v !== undefined && v !== null && String(v).trim() !== '';
    });
}
