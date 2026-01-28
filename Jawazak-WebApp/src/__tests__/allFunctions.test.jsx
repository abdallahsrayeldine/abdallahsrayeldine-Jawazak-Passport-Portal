import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import Portal from '../components/Portal/Portal.jsx';
import { StartApplication } from '../components/Portal/Application/StartApplication.jsx';
import ChatWithAI from '../components/ChatWithAI.jsx';
import PaymentSuccess from '../components/Portal/PaymentSuccess.jsx';
import PaymentCancelled from '../components/Portal/PaymentCancelled.jsx';
import SignUp from '../components/SignUp.jsx';
import SignIn from '../components/SignIn.jsx';
import HandleFacetecSuccess from '../components/NonPublic/HandleFacetecSuccess.jsx';
import { VerifiedSection } from '../components/Portal/VerifiedSection.jsx';
import { PendingSection } from '../components/Portal/PendingSection.jsx';
import { RejectedSection } from '../components/Portal/RejectedSection.jsx';
import { ApplicationInformation } from '../components/Portal/ApplicationInformation.jsx';
import Home from '../components/Home.jsx';
import PageMoreInfo from '../components/Portal/Application/PageMoreInfo.jsx';
import PageUploadDocuments from '../components/Portal/Application/PageUploadDocuments.jsx';
import PageGeneralInfo from '../components/Portal/Application/PageGeneralInfo.jsx';
import { supabase } from '../supabase-client.jsx';

const routerComponents = new Set(['PaymentSuccess', 'PaymentCancelled', 'SignUp', 'SignIn']);

function safeRender(Component, props = {}) {
    try {
        // Use server-side rendering to avoid needing a DOM (no useEffect runs)
        const element = React.createElement(
            routerComponents.has(Component.name) ? MemoryRouter : React.Fragment,
            null,
            React.createElement(Component, props)
        );

        // Suppress React warning about non-boolean `jsx` attribute used by some components
        const originalErr = console.error;
        console.error = (...args) => {
            const msg = args[0] && String(args[0]);
            if (msg && msg.includes('Received `true` for a non-boolean attribute `jsx`')) {
                return;
            }
            originalErr(...args);
        };

        renderToStaticMarkup(element);

        console.error = originalErr;
        return true;
    } catch (err) {
        console.error(`Error rendering ${Component.name}:`, err && (err.stack || err.message || err));
        throw err;
    }
}

describe('Project exports smoke tests', () => {
    it('supabase is defined', () => {
        expect(supabase).toBeDefined();
    });

    it('Portal component is a function and renders', () => {
        expect(typeof Portal).toBe('function');
        const ok = safeRender(Portal, { session: null });
        expect(ok).toBe(true);
    });

    it('StartApplication renders or is defined', () => {
        expect(typeof StartApplication).toBe('function');
        const ok = safeRender(StartApplication, { setApplicationStarted: () => { }, session: null });
        expect(ok).toBe(true);
    });

    const componentsToTest = [
        [ChatWithAI, {}],
        [PaymentSuccess, {}],
        [PaymentCancelled, {}],
        [SignUp, {}],
        [SignIn, {}],
        [Home, { session: null }],
        [PageMoreInfo, { form: {}, handleChange: () => { }, next: () => { }, back: () => { } }],
        [PageUploadDocuments, { form: {}, handleChange: () => { }, next: () => { } }],
        [PageGeneralInfo, { form: {}, handleChange: () => { }, next: () => { } }],
    ];

    componentsToTest.forEach(([Comp, props]) => {
        it(`${Comp.name} is importable and renders`, () => {
            expect(typeof Comp).toBe('function');
            const ok = safeRender(Comp, props);
            expect(ok).toBe(true);
        });
    });

    it('HandleFacetecSuccess is defined (default export)', () => {
        expect(typeof HandleFacetecSuccess).toBe('function');
    });

    it('VerifiedSection, PendingSection, RejectedSection, ApplicationInformation render', () => {
        expect(typeof VerifiedSection).toBe('function');
        expect(typeof PendingSection).toBe('function');
        expect(typeof RejectedSection).toBe('function');
        expect(typeof ApplicationInformation).toBe('function');

        expect(safeRender(VerifiedSection, { session: null })).toBe(true);
        expect(safeRender(PendingSection, { onVerify: () => { } })).toBe(true);
        expect(safeRender(RejectedSection, { supportEmail: 'x@example.com' })).toBe(true);
        expect(safeRender(ApplicationInformation, { setApplicationStarted: () => { } })).toBe(true);
    });
});
