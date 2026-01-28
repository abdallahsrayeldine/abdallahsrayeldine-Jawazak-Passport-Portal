import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  CreateGuesser,
  EditGuesser,
  ForgotPasswordPage,
  ListGuesser,
  LoginPage,
  SetPasswordPage,
  ShowGuesser,
  supabaseDataProvider,
  supabaseAuthProvider,
} from "ra-supabase";

import Layout from "./Layout";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";

// @ts-ignore: no declaration file for this JS module
import Facetec_profileList from "./Lists/FaceTecProfile_List";
// @ts-ignore: no declaration file for this JS module
import PassportApplicationList from "./Lists/PassportApplication_List";

// @ts-ignore: no declaration file for this JS module
import Facetec_profileShow from "./Shows/FaceTecProfile_Show";
// @ts-ignore: no declaration file for this JS module
import PassportApplicationShow from "./Shows/PassportApplication_Show";

const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabaseClient = createClient(instanceUrl, apiKey);
const dataProvider = supabaseDataProvider({
  instanceUrl,
  apiKey,
  supabaseClient,
});
const authProvider = supabaseAuthProvider(supabaseClient, {});

interface adminData {
  id: string;
  email?: string;
  role?: string;
}

export const App = () => {
  return (
    <BrowserRouter>
      <AuthLoader />
    </BrowserRouter>
  );
};
const AuthLoader = () => {
  const [adminData, setAdminData] = useState<adminData | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setAdminData(session?.user ?? null);
      },
    );

    supabaseClient.auth.getSession().then(({ data }) => {
      setAdminData(data.session?.user ?? null);
      setFetched(true); 
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!fetched) {
    return <div style={{ padding: 20 }}>Loading authentication…</div>;
  }

  return (
    <Admin
      requireAuth
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={Layout}
    >
      <Resource
        name="all_signed_up_new_user_view"
        icon={PersonIcon}
        options={{ label: "All Profiles" }}
        list={Facetec_profileList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <Facetec_profileShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="pending_signed_up_new_user_view"
        icon={PersonIcon}
        options={{ label: "Pending Profiles" }}
        list={Facetec_profileList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <Facetec_profileShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="verified_signed_up_new_user_view"
        icon={PersonIcon}
        options={{ label: "Verified Profiles" }}
        list={Facetec_profileList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <Facetec_profileShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="rejected_signed_up_new_user_view"
        icon={PersonIcon}
        options={{ label: "Rejected Profiles" }}
        list={Facetec_profileList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <Facetec_profileShow {...props} adminData={adminData} />
        )}
      />

      <Resource
        name="all_application_submission_view"
        icon={DescriptionIcon}
        options={{ label: "All Applications" }}
        list={PassportApplicationList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <PassportApplicationShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="pending_admin_verification_application_submission_view"
        icon={DescriptionIcon}
        options={{ label: "Pending Applications" }}
        list={PassportApplicationList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <PassportApplicationShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="accepted_application_submission_view"
        icon={DescriptionIcon}
        options={{ label: "Accepted Applications" }}
        list={PassportApplicationList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <PassportApplicationShow {...props} adminData={adminData} />
        )}
      />
      <Resource
        name="rejected_application_submission_view"
        icon={DescriptionIcon}
        options={{ label: "Rejected Applications" }}
        list={PassportApplicationList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={(props) => (
          <PassportApplicationShow {...props} adminData={adminData} />
        )}
      />

      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
    </Admin>
  );
};
