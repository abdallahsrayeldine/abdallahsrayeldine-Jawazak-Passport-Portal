# JAWAZAK — Digital Passport Portal

JAWAZAK is a fully digital passport-application platform for the Lebanese Ministry of Interior. It provides a user portal for online passport applications, biometric verification, document upload, payment, and an admin dashboard for staff review. The project is modular: the user portal, FaceTec biometric module, admin dashboard, and other pieces are developed as separate modules and integrated into a single workflow. The full project report with timeline, testing, and PM artifacts is in the project PDF. 

---

# Project summary

JAWAZAK enables citizens to apply for passports end-to-end: account registration, face verification, document upload, Stripe payment, and admin approval. AI-powered OCR and a RAG-based AI assistant are used to help users and analyze documents; AI OCR and Stripe logic run in Supabase via TypeScript Edge Functions. The system was delivered, tested, and documented according to the final project plan. 

---

# Modules & key components

* **User Portal (frontend)**

  * Registration, email verification, file upload (passport photos, documents), UI for the application workflow.
  * Calls Supabase APIs / Edge Functions for OCR, payment, and persistence.

* **Supabase backend**

  * Database (Postgres), auth, storage, and TypeScript Edge Functions.
  * **AI OCR & Stripe** are implemented inside Supabase edge functions (TypeScript) to process uploaded documents and handle payments.

* **FaceTec biometric module (separate)**

  * Face verification and liveness check. Implemented as an independent module and integrated as a service in the workflow.

* **Admin dashboard (separate)**

  * Workflow for MoI staff: review applications, view biometric/OCR results, approve/reject, and audit logs. Implemented as an independent module and integrated with the Supabase backend.

* **RAG-based AI assistant**

  * Provides guided help to applicants and clarifies steps/requirements.

---

# How it works (flow)

1. User registers and verifies email.
2. User starts a passport application: uploads documents and photos.
3. Uploaded documents are sent to Supabase; edge functions run OCR and validation.
4. Face verification (FaceTec module) completes biometric identity verification.
5. Payment processed via Stripe logic inside Supabase TypeScript edge functions.
6. Admin dashboard receives application for review; staff approve/reject and record decisions.
7. Audit logs / status updates are persisted and surfaced to the user.

Key design: **modular integration** (service calls between independent modules), secure storage, and centralized orchestration through Supabase.

---

# Testing & quality

* Unit tests and integration tests were run across modules. End-to-end flows covering registration → biometric verification → document OCR → payment → admin approval were executed successfully. The project report contains the full test matrix, test outcomes, and acceptance criteria. 

---

# Security & privacy

* Sensitive data is stored in Supabase with security policies; file uploads and biometric data are handled with encryption and access control.
* Payments use Stripe (tokenized flows).
* Follow local privacy regulations for biometric data handling and retention.

---

# Deployment notes

* Deploy Supabase (hosted or managed) for production DB & edge functions.
* Host user frontend and admin dashboard on your preferred hosting (Vercel, Netlify, or traditional servers).
* Ensure FaceTec integration endpoints are reachable and keys are securely stored (env manager / secrets).
* Use HTTPS and secure cookie/session practices.

---

# Project timeline & status

The project completed planned milestones (SRS, UI wireframes, Supabase setup, integration, system testing, documentation) and concluded with a full submission and final report. See the project report for milestone dates and change-request details (e.g., switching fingerprint → FaceTec and local payment providers → Stripe). 

---

# Lessons learned & future improvements

* Test third-party SDKs early (FaceTec, local payment gateways).
* Keep modules decoupled so tech changes (e.g., replacing fingerprint with FaceTec) are manageable.
* Future work: advanced fraud detection, more robust audit trails, multi-region deployment, improved AI OCR accuracy.

---

# Credits & authors

Project team and contributors are listed in the final report. Refer to the report for PM artifacts, team roles, and authorship. 
