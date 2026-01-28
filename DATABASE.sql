-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE app_user_role AS ENUM (
  'citizen',
  'admin_verifier',
  'department_officer',
  'super_admin'
);

CREATE TYPE account_status AS ENUM ('pending_facetec_scan', 'pending_admin_verification', 'verified','rejected', 'deactivated');
CREATE TYPE application_status AS ENUM ('started', 'pending_payment', 'pending_facetec_scan', 'pending_admin_verification', 'accepted','rejected');
-- ============================================
-- TABLES
-- ============================================

CREATE TABLE profiles (
  unique_user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL, 
  email TEXT NOT NULL UNIQUE,
  role app_user_role DEFAULT 'citizen' NOT NULL,
  profile_status account_status DEFAULT 'pending_facetec_scan' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE facetec_profile (
  unique_user_id UUID NOT NULL PRIMARY KEY REFERENCES profiles(unique_user_id) ON DELETE CASCADE,
  enrollment_identifier TEXT UNIQUE NOT NULL,
    user_confirmed_extracted_data_full_name TEXT,
    liveness_3d_performed BOOLEAN NOT NULL DEFAULT FALSE,
    reference_2d_image TEXT,
    id_face_crop_image TEXT,
    id_document_type TEXT,
    id_front_image TEXT,
    id_back_image TEXT,
  national_id_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signed_up_new_user (
  id uuid primary key default gen_random_uuid(),
  enrollment_identifier TEXT UNIQUE NOT NULL,
  unique_user_id uuid REFERENCES profiles(unique_user_id) on DELETE CASCADE,
  ip_address TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE decision_on_signed_up_new_user (
    id uuid primary key DEFAULT gen_random_uuid(),
    unique_user_id uuid REFERENCES profiles(unique_user_id) ON DELETE CASCADE,
    action_result TEXT NOT NULL,
    action_by_id uuid REFERENCES profiles(auth_user_id) ON DELETE SET NULL,
    action_by_email TEXT NOT NULL,
    rejection_reason TEXT DEFAULT 'Not applicable',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE decision_on_application_submission (
    id uuid primary key DEFAULT gen_random_uuid(),
    application_submission_id uuid REFERENCES application_submissions(id) ON DELETE CASCADE,
    action_result TEXT NOT NULL,
    action_by_id uuid REFERENCES profiles(auth_user_id) ON DELETE SET NULL,
    action_by_email TEXT NOT NULL,
    rejection_reason TEXT DEFAULT 'Not applicable',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE login_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_identifier text UNIQUE NOT NULL,
  unique_user_id uuid REFERENCES profiles(unique_user_id) on DELETE CASCADE,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE application_submissions (
  id uuid primary key default gen_random_uuid(),
  unique_user_id uuid REFERENCES profiles(unique_user_id) on DELETE CASCADE,
  application_status application_status DEFAULT 'started' NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  fathers_name TEXT NOT NULL,
  mothers_name TEXT NOT NULL,
  place_of_birth TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  place_of_registration TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  governorate TEXT NOT NULL,
  district TEXT NOT NULL,
  town TEXT NOT NULL,
  street TEXT NOT NULL,
  phone_mobile TEXT NOT NULL,
  phone_home TEXT,
  document_lebanese_id TEXT,
  document_civil_status TEXT,
  document_passport_photo TEXT NOT NULL,
  document_old_passport TEXT,
  payment_reference TEXT,
  liveness_3d_performed BOOLEAN DEFAULT FALSE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


-- ============================================
-- VIEWS
-- ============================================

-- (auth users) (check their own profile)
CREATE OR REPLACE VIEW profile_public_view AS
SELECT
    p.unique_user_id,
    p.auth_user_id,
    p.first_name || ' ' || p.last_name AS full_name,
    p.email,
    p.role,
    p.profile_status
FROM profiles p;

-- (admin-only) (for testing)
CREATE OR REPLACE VIEW profile_facetec_view AS
SELECT
    p.unique_user_id AS id,
    p.first_name || ' ' || p.last_name AS full_name,
    fp.enrollment_identifier,
    fp.user_confirmed_extracted_data_full_name,
    fp.liveness_3d_performed,
    fp.reference_2d_image,
    fp.id_face_crop_image,
    fp.id_document_type,
    fp.id_front_image,
    fp.id_back_image,
    fp.national_id_number
FROM facetec_profile fp
JOIN profiles p ON fp.unique_user_id = p.unique_user_id;

CREATE OR REPLACE VIEW all_signed_up_new_user_view AS
SELECT 
  p.unique_user_id AS id,
  p.first_name || ' ' || p.last_name AS full_name,
  fp.enrollment_identifier,
  fp.user_confirmed_extracted_data_full_name,
  fp.liveness_3d_performed,
  fp.reference_2d_image,
  fp.id_face_crop_image,
  fp.id_document_type,
  fp.id_front_image,
  fp.id_back_image,
  fp.national_id_number
FROM facetec_profile fp
JOIN profiles p ON fp.unique_user_id = p.unique_user_id;

CREATE OR REPLACE VIEW pending_signed_up_new_user_view AS
SELECT 
  p.unique_user_id AS id,
  p.first_name || ' ' || p.last_name AS full_name,
  fp.enrollment_identifier,
  fp.user_confirmed_extracted_data_full_name,
  fp.liveness_3d_performed,
  fp.reference_2d_image,
  fp.id_face_crop_image,
  fp.id_document_type,
  fp.id_front_image,
  fp.id_back_image,
  fp.national_id_number
FROM facetec_profile fp
JOIN profiles p ON fp.unique_user_id = p.unique_user_id
WHERE p.profile_status = 'pending_admin_verification';


CREATE OR REPLACE VIEW verified_signed_up_new_user_view AS
SELECT 
  p.unique_user_id AS id,
  p.first_name || ' ' || p.last_name AS full_name,
  fp.enrollment_identifier,
  fp.user_confirmed_extracted_data_full_name,
  fp.liveness_3d_performed,
  fp.reference_2d_image,
  fp.id_face_crop_image,
  fp.id_document_type,
  fp.id_front_image,
  fp.id_back_image,
  fp.national_id_number
FROM facetec_profile fp
JOIN profiles p ON fp.unique_user_id = p.unique_user_id
WHERE p.profile_status = 'verified';

CREATE OR REPLACE VIEW rejected_signed_up_new_user_view AS
SELECT
  p.unique_user_id AS id,
  p.first_name || ' ' || p.last_name AS full_name,
  fp.enrollment_identifier,
  fp.user_confirmed_extracted_data_full_name,
  fp.liveness_3d_performed,
  fp.reference_2d_image,
  fp.id_face_crop_image,
  fp.id_document_type,
  fp.id_front_image,
  fp.id_back_image,
  fp.national_id_number
FROM facetec_profile fp
JOIN profiles p ON fp.unique_user_id = p.unique_user_id
WHERE p.profile_status = 'rejected';


CREATE OR REPLACE VIEW pending_admin_verification_application_submission_view AS
SELECT
    a.id,
    p.unique_user_id,
    p.first_name || ' ' || p.last_name AS full_name,
    a.application_status,
    a.liveness_3d_performed,
    a.first_name,
    a.last_name,
    a.fathers_name,
    a.mothers_name,
    a.place_of_birth,
    a.date_of_birth,
    a.gender,
    a.place_of_registration,
    a.registration_number,
    a.governorate,
    a.district,
    a.town,
    a.street,
    a.phone_mobile,
    a.document_lebanese_id,
    a.document_civil_status,
    a.document_passport_photo,
    a.document_old_passport,
    a.created_at,
    a.updated_at
FROM application_submissions a
JOIN profiles p ON a.unique_user_id = p.unique_user_id
WHERE a.application_status = 'pending_admin_verification';

CREATE OR REPLACE VIEW accepted_application_submission_view AS
SELECT
    a.id,
    p.unique_user_id,
    p.first_name || ' ' || p.last_name AS full_name,
    a.application_status,
    a.liveness_3d_performed,
    a.first_name,
    a.last_name,
    a.fathers_name,
    a.mothers_name,
    a.place_of_birth,
    a.date_of_birth,
    a.gender,
    a.place_of_registration,
    a.registration_number,
    a.governorate,
    a.district,
    a.town,
    a.street,
    a.phone_mobile,
    a.document_lebanese_id,
    a.document_civil_status,
    a.document_passport_photo,
    a.document_old_passport,
    a.created_at,
    a.updated_at
FROM application_submissions a
JOIN profiles p ON a.unique_user_id = p.unique_user_id
WHERE a.application_status = 'accepted';

CREATE OR REPLACE VIEW rejected_application_submission_view AS
SELECT
    a.id,
    p.unique_user_id,
    p.first_name || ' ' || p.last_name AS full_name,
    a.application_status,
    a.liveness_3d_performed,
    a.first_name,
    a.last_name,
    a.fathers_name,
    a.mothers_name,
    a.place_of_birth,
    a.date_of_birth,
    a.gender,
    a.place_of_registration,
    a.registration_number,
    a.governorate,
    a.district,
    a.town,
    a.street,
    a.phone_mobile,
    a.document_lebanese_id,
    a.document_civil_status,
    a.document_passport_photo,
    a.document_old_passport,
    a.created_at,
    a.updated_at
FROM application_submissions a
JOIN profiles p ON a.unique_user_id = p.unique_user_id
WHERE a.application_status = 'rejected';

CREATE OR REPLACE VIEW all_application_submission_view AS
SELECT
    a.id,
    p.unique_user_id,
    p.first_name || ' ' || p.last_name AS full_name,
    a.application_status,
    a.liveness_3d_performed,
    a.first_name,
    a.last_name,
    a.fathers_name,
    a.mothers_name,
    a.place_of_birth,
    a.date_of_birth,
    a.gender,
    a.place_of_registration,
    a.registration_number,
    a.governorate,
    a.district,
    a.town,
    a.street,
    a.phone_mobile,
    a.document_lebanese_id,
    a.document_civil_status,
    a.document_passport_photo,
    a.document_old_passport,
    a.created_at,
    a.updated_at
FROM application_submissions a
JOIN profiles p ON a.unique_user_id = p.unique_user_id;

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facetec_profile_updated_at
    BEFORE UPDATE ON facetec_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_submissions_updated_at
    BEFORE UPDATE ON application_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- FUNCTION TO CREATE PROFILE ON USER SIGNUP
-- ============================================

-- This function automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'), 
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE facetec_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE signed_up_new_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_on_signed_up_new_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_submissions ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------
"
workflow:

sign up (mail + password + full name)
verify mail
access portal
verify account with facetec (on sucess, create a new entrty in signed_up_new_user)
receive confiramation 


Start an application (account must be verified)
Upload necessary documents
Make payment
Perform 3D Liveness
(Immediatly followed by)
Submit application
Receive notification when done


log-signing is an edge funtion that calls another edge function, that reaches facetec db, receives json, macthes ip 
admin fetches profiles that are pending verification and joins them with signed_up_new_user to get the ip and date of registration, and search the facetec database for relevant users (done through a supabase edge function).
admin makes a decision and changes user's profile_status to 'verified' or 'rejected'


Views:
  - profile_public_view (for auth users): user can see their own profile info

  - profile_facetec_view (for admins): holds facetec info for admins to verify users 

  - pending_signed_up_new_user_view (for admins): holds pending user signup info
  - verified_signed_up_new_user_view (for admins): holds new user signup info 
  - rejected_signed_up_new_user_view (for admins): holds rejected user signup info
  - all_signed_up_new_user_view (for admins): holds all user's signup info

  - pending_application_submission_view (for admins): holds pending application submission info
  - accepted_application_submission_view (for admins): holds application submission info 
  - rejected_application_submission_view (for admins): holds rejected application submission info
  - all_application_submission_view (for admins): holds all application submission info

------------------------------------------------------


PASSPORT APPLICATION:

First name
Last name
Father's name
Mother's name
Place of birth
Date of birth
Gender (M/F)

Place of registration !!!
Number of registration

Address:
 - Governorate
 - District
 - Town
 - Street

Phone number
  - Mobile
  - Home

ATTACHED DOCUMENTS NEEDED
------------------------
  - Lebanese ID
	- Civil Status (Ikhraj kayd)
	- Photo passport
	- old passport if available
  - Additional documents (if any) (type: ... , number: ... , issue date: ... , expiry date: ... )


DROP TYPE IF EXISTS type_name_here CASCADE;
ALTER TABLE table_name_here DROP COLUMN column_name_here;
ALTER TABLE table_name_here ADD COLUMN column_name_here data_type_here;
DROP VIEW IF EXISTS view_name_here CASCADE;


DROP TABLE IF EXISTS application_submissions CASCADE;
DROP TABLE IF EXISTS decision_on_signed_up_new_user CASCADE;
DROP TABLE IF EXISTS facetec_profile CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS signed_up_new_user CASCADE;
DROP TABLE IF EXISTS login_sessions CASCADE;
"
