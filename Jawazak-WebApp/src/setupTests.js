import { JSDOM } from 'jsdom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// extend Vitest's expect with testing-library matchers (guard if module shape differs)
if (matchers && Object.keys(matchers).length > 0) {
    expect.extend(matchers);
}

const dom = new JSDOM('<!doctype html><html><body></body></html>');

globalThis.window = dom.window;
globalThis.document = dom.window.document;
// Do not overwrite an existing navigator (may be read-only in some environments)
if (typeof globalThis.navigator === 'undefined') {
    try {
        globalThis.navigator = dom.window.navigator;
    } catch (e) {
        // ignore if not writable
    }
}

// Copy all properties from the window to the Node global object when they don't exist
// Do not mass-copy window properties — that can attempt to overwrite read-only globals.
// Expose only the minimal set of globals commonly used by tests.
// Provide a safe, test-friendly `location` object that accepts relative URLs
const safeLocation = {
    href: 'http://localhost/',
    assign(url) {
        this.href = typeof url === 'string' && url.startsWith('/') ? `http://localhost${url}` : String(url);
    },
    replace(url) {
        this.href = typeof url === 'string' && url.startsWith('/') ? `http://localhost${url}` : String(url);
    },
    toString() {
        return this.href;
    },
};

// Try to patch jsdom's location href setter so assignments like `window.location.href = '/sign-in'`
// don't trigger jsdom navigation (which is not implemented and throws).
try {
    // If we can redefine the href property on the jsdom Location object, do so and delegate
    // to our safeLocation. This avoids calling jsdom's navigate implementation.
    const domLocation = dom.window.location;
    Object.defineProperty(domLocation, 'href', {
        configurable: true,
        enumerable: true,
        get() {
            return safeLocation.href;
        },
        set(val) {
            safeLocation.assign(val);
        },
    });

    // Ensure assign/replace also delegate
    domLocation.assign = (u) => safeLocation.assign(u);
    domLocation.replace = (u) => safeLocation.replace(u);

    // expose the (patched) dom location on globals
    if (typeof globalThis.location === 'undefined') globalThis.location = dom.window.location;
} catch (e) {
    // Fallback: if we cannot patch jsdom internals, expose the safeLocation on globals instead.
    if (typeof globalThis.location === 'undefined') globalThis.location = safeLocation;
}
if (typeof globalThis.getComputedStyle === 'undefined') globalThis.getComputedStyle = dom.window.getComputedStyle;
if (typeof globalThis.Element === 'undefined') globalThis.Element = dom.window.Element;
if (typeof globalThis.HTMLElement === 'undefined') globalThis.HTMLElement = dom.window.HTMLElement;

globalThis.requestAnimationFrame = function (cb) {
    return setTimeout(cb, 0);
};

// Provide a no-op alert for tests that call alert()
if (typeof globalThis.alert === 'undefined') {
    globalThis.alert = () => { };
}
