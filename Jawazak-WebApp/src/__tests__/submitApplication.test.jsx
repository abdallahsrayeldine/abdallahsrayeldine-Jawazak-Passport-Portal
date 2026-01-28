import '../setupTests.js';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client before importing components
vi.mock('../supabase-client.jsx', () => {
    return {
        supabase: {
            from: (table) => {
                if (table === 'profile_public_view') {
                    return {
                        select: () => ({
                            eq: () => ({
                                single: async () => ({ data: { profile_status: 'verified' }, error: null }),
                            }),
                        }),
                    };
                }
                // Default chain for other uses
                return {
                    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
                };
            },
            storage: {
                from: (bucket) => ({
                    upload: vi.fn().mockImplementation(async (path, file) => ({ data: { path: `${bucket}/${file.name}` }, error: null })),
                }),
            },
        },
    };
});

import Portal from '../components/Portal/Portal.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Portal end-to-end submission', () => {
    beforeEach(() => {
        // reset location
        if (typeof globalThis.location !== 'undefined') {
            globalThis.location.href = 'http://localhost/';
        }

        // Set a safe global location (do not assign to window.location — that can trigger jsdom navigation)
        if (typeof globalThis.location === 'undefined') {
            globalThis.location = { href: 'http://localhost/' };
        } else {
            globalThis.location.href = 'http://localhost/';
        }

        // Provide a test-safe navigation hook used by StartApplication to avoid jsdom navigation
        globalThis.__TEST_SAFE_NAV__ = (url) => { globalThis.location.href = String(url); };

        // stub fetch to handle upload and checkout; respond based on call order
        let fetchCall = 0;
        vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url, opts) => {
            fetchCall += 1;
            if (fetchCall === 1) {
                // first fetch: upload application -> return application_id
                return { ok: true, json: async () => ({ success: true, application_id: 'app-test-123' }) };
            }
            if (fetchCall === 2) {
                // second fetch: create checkout -> return checkout_url
                return { ok: true, json: async () => ({ checkout_url: 'https://checkout.example/session/123' }) };
            }
            return { ok: true, json: async () => ({}) };
        }));
    });

    it('walks StartApplication flow and submits, calling uploads and redirecting to checkout', async () => {
        const session = { user: { id: 'user123' }, access_token: 'token' };

        render(
            <MemoryRouter>
                <Portal session={session} />
            </MemoryRouter>
        );

        // Wait for ApplicationInformation to render
        const startBtn = await screen.findByRole('button', { name: /Start Passport Application/i });
        fireEvent.click(startBtn);

        // Page 1: fill general info
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Fathers name/i), { target: { value: 'Bob' } });
        fireEvent.change(screen.getByLabelText(/Mothers name/i), { target: { value: 'Carol' } });
        fireEvent.change(screen.getByLabelText(/Place of birth/i), { target: { value: 'Beirut' } });
        fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });

        // click Next
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));

        // Page 2: fill more info
        fireEvent.change(screen.getByLabelText(/place of registration/i), { target: { value: 'RegPlace' } });
        fireEvent.change(screen.getByLabelText(/registration number/i), { target: { value: 'RN123' } });
        fireEvent.change(screen.getByLabelText(/governorate/i), { target: { value: 'Gov' } });
        fireEvent.change(screen.getByLabelText(/district/i), { target: { value: 'Dist' } });
        fireEvent.change(screen.getByLabelText(/town/i), { target: { value: 'Town' } });
        fireEvent.change(screen.getByLabelText(/street/i), { target: { value: 'Main St' } });
        fireEvent.change(screen.getByLabelText(/phone mobile/i), { target: { value: '+96170000000' } });

        // click Next
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));

        // Page 3: upload required passport photo file
        const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
        const passportInput = screen.getByLabelText(/document passport photo/i);
        // fire change event with files
        fireEvent.change(passportInput, { target: { files: [file] } });

        // submit form (trigger submit on the form element directly)
        const formEl = screen.queryByRole('form') || document.querySelector('form');
        if (!formEl) throw new Error('form element not found');
        fireEvent.submit(formEl);

        // Wait for fetch calls to complete and for redirection to be performed
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled();
        });

        // After success, checkout_url should have been assigned to location.href
        expect(globalThis.location.href).toContain('https://checkout.example/session/123');
    });
});
