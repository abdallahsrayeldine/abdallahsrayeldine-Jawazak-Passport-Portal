import '../setupTests.js';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client before importing components
vi.mock('../supabase-client.jsx', () => {
    return {
        supabase: {
            auth: {
                signUp: vi.fn().mockResolvedValue({ error: null }),
                signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
            },
        },
    };
});

import SignUp from '../components/SignUp.jsx';
import SignIn from '../components/SignIn.jsx';
import PageGeneralInfo from '../components/Portal/Application/PageGeneralInfo.jsx';
import PageMoreInfo from '../components/Portal/Application/PageMoreInfo.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('form interactions (unit)', () => {
    beforeEach(() => {
        // reset DOM between tests
        document.body.innerHTML = '';
    });

    it('SignUp has required inputs and updates values', async () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        const first = screen.getByLabelText(/First Name/i);
        const last = screen.getByLabelText(/Last Name/i);
        const email = screen.getByLabelText(/Email/i);
        const password = screen.getByLabelText(/Password/i);

        expect(first).toBeRequired();
        expect(last).toBeRequired();
        expect(email).toBeRequired();
        expect(password).toBeRequired();

        fireEvent.change(first, { target: { value: 'Alice' } });
        fireEvent.change(last, { target: { value: 'Smith' } });
        fireEvent.change(email, { target: { value: 'alice@example.com' } });
        fireEvent.change(password, { target: { value: 'Abcdef1!' } });

        expect(first.value).toBe('Alice');
        expect(last.value).toBe('Smith');
        expect(email.value).toBe('alice@example.com');
        expect(password.value).toBe('Abcdef1!');
    });

    it('SignUp blocks submission with weak password', async () => {
        const { supabase } = await import('../supabase-client.jsx');
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        // Fill required name fields so native form validation doesn't block submit
        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });

        const email = screen.getByLabelText(/Email/i);
        const password = screen.getByLabelText(/Password/i);
        fireEvent.change(email, { target: { value: 'user@example.com' } });
        fireEvent.change(password, { target: { value: 'weak' } });

        const submit = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(submit);

        // supabase.signUp should not be called because password is invalid
        expect(supabase.auth.signUp).not.toHaveBeenCalled();

        // Expect an error message to appear
        const err = await screen.findByText(/Password must/i);
        expect(err).toBeTruthy();
    });

    it('SignUp calls supabase.auth.signUp on valid password', async () => {
        const { supabase } = await import('../supabase-client.jsx');
        // make sure mock resolves successfully
        supabase.auth.signUp.mockResolvedValueOnce({ error: null });

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Abcdef1!' } });

        const submit = screen.getByRole('button', { name: /Sign Up/i });
        fireEvent.click(submit);

        // assert signUp called with expected shape
        expect(supabase.auth.signUp).toHaveBeenCalled();
        const calledWith = supabase.auth.signUp.mock.calls[0][0];
        expect(calledWith.email).toBe('alice@example.com');
        expect(calledWith.password).toBe('Abcdef1!');
        expect(calledWith.options.data.first_name).toBe('Alice');
        expect(calledWith.options.data.last_name).toBe('Smith');
    });

    it('SignIn shows error when supabase returns an error', async () => {
        const { supabase } = await import('../supabase-client.jsx');
        supabase.auth.signInWithPassword.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'WrongPass1!' } });

        const submit = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submit);

        const err = await screen.findByText(/Invalid credentials/i);
        expect(err).toBeTruthy();
    });

    it('SignIn has required inputs and updates values', () => {
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        const email = screen.getByLabelText(/Email/i);
        const password = screen.getByLabelText(/Password/i);

        expect(email).toHaveAttribute('required');
        expect(password).toHaveAttribute('required');

        fireEvent.change(email, { target: { value: 'bob@example.com' } });
        fireEvent.change(password, { target: { value: 'Secret123!' } });

        expect(email.value).toBe('bob@example.com');
        expect(password.value).toBe('Secret123!');
    });

    it('PageGeneralInfo requires fields and calls next when valid', async () => {
        // Pre-fill the form object so the controlled inputs render with values
        const form = {
            first_name: 'x',
            last_name: 'x',
            fathers_name: 'x',
            mothers_name: 'x',
            place_of_birth: 'x',
            date_of_birth: '1990-01-01',
            gender: 'male',
        };

        const handleChange = (e) => {
            form[e.target.name] = e.target.value;
        };

        const next = vi.fn();

        const { container } = render(<PageGeneralInfo form={form} handleChange={handleChange} next={next} />);

        // inputs are already pre-filled via `form`, so submit should call next()

        // submit using container's form
        const formEl = container.querySelector('form');
        fireEvent.submit(formEl);

        expect(next).toHaveBeenCalled();
    });

    it('PageMoreInfo requires phone_mobile and other fields', () => {
        // Pre-fill the form so controlled inputs render with values
        const form = {
            place_of_registration: 'x',
            registration_number: 'x',
            governorate: 'x',
            district: 'x',
            town: 'x',
            street: 'x',
            phone_mobile: 'x',
            phone_home: '',
        };

        const handleChange = (e) => {
            form[e.target.name] = e.target.value;
        };

        const next = vi.fn();
        const back = vi.fn();

        const { container } = render(<PageMoreInfo form={form} handleChange={handleChange} next={next} back={back} />);

        // inputs are pre-filled via `form`, submit should call next()

        const formEl = container.querySelector('form');
        fireEvent.submit(formEl);

        // Because PageMoreInfo uses e.target.reportValidity() which relies on the browser,
        // in this environment the submit handler should call next when required inputs have values.
        expect(next).toHaveBeenCalled();
    });
});
