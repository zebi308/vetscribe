import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import { AppStateProvider } from "./lib/AppState";

import { ProtectedRoute } from "./components/ProtectedRoute";


// Layout

import { AppShell } from "./components/layout/AppShell";


// Public Pages

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";


// Dashboard Pages

import { DashboardPage } from "./pages/DashboardPage";
import { ConsultationsPage } from "./pages/ConsultationsPage";
import { PatientsPage } from "./pages/PatientsPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ClientProfilePage } from "./pages/ClientProfilePage";
import { OwnerSummariesPage } from "./pages/OwnerSummariesPage";
// Create / Workflow Pages

import { AddClientPage } from "./pages/AddClientPage";
import { AddPatientPage } from "./pages/AddPatientPage";
import { NewConsultationPage } from "./pages/NewConsultationPage";
import { ConsultationRoomPage } from "./pages/ConsultationRoomPage";


// Settings

import { SettingsPage } from "./pages/SettingsPage";
import { PracticeSettingsPage } from "./pages/PracticeSettingsPage";
import { StaffPage } from "./pages/StaffPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { AuditPage } from "./pages/AuditPage";


// Admin

import { AdminPage } from "./pages/AdminPage";
import { PatientHistoryPage } from "./pages/PatientHistoryPage";







export function App(){



return (

<AppStateProvider>


<BrowserRouter>


<Routes>





{/* =====================
        PUBLIC ROUTES
===================== */}



<Route

path="/"

element={<LandingPage/>}

/>



<Route

path="/login"

element={<LoginPage/>}

/>



<Route

path="/register"

element={<RegisterPage/>}

/>



<Route

path="/start-free-trial"

element={<RegisterPage/>}

/>



<Route

path="/forgot-password"

element={<ForgotPasswordPage/>}

/>









{/* =====================
        PROTECTED APP
===================== */}



<Route

element={<ProtectedRoute/>}

>


<Route

path="/dashboard"

element={<AppShell/>}

>





{/* Dashboard Home */}

<Route

index

element={<DashboardPage/>}

/>









{/* =====================
        CONSULTATIONS
===================== */}



<Route

path="consultations"

element={<ConsultationsPage/>}

/>



<Route

path="consultations/new"

element={<NewConsultationPage/>}

/>



<Route

path="consultations/:id"

element={<ConsultationRoomPage/>}

/>


<Route
path="patients/:id/history"
element={<PatientHistoryPage/>}
/>






{/* =====================
        PATIENTS
===================== */}



<Route

path="patients"

element={<PatientsPage/>}

/>



<Route

path="patients/new"

element={<AddPatientPage/>}

/>

{/* =====================
        CLIENTS
===================== */}


<Route

path="clients"

element={<ClientsPage/>}

/>

<Route

path="clients/new"

element={<AddClientPage/>}

/>

<Route

path="clients/:id"

element={<ClientProfilePage/>}

/>







{/* =====================
        OWNER SUMMARIES
===================== */}



<Route

path="owner-summaries"

element={<OwnerSummariesPage/>}

/>









{/* =====================
        SETTINGS
===================== */}



<Route

path="settings"

element={<SettingsPage/>}

/>



<Route

path="settings/practice"

element={<PracticeSettingsPage/>}

/>






<Route

element={
<ProtectedRoute

allowedRoles={[
"practice_manager",
"super_admin"
]}

/>

}

>


<Route

path="settings/staff"

element={<StaffPage/>}

/>


</Route>








<Route

element={
<ProtectedRoute

allowedRoles={[
"practice_manager",
"super_admin"
]}

/>

}

>


<Route

path="settings/templates"

element={<TemplatesPage/>}

/>


</Route>








<Route

element={
<ProtectedRoute

allowedRoles={[
"practice_manager",
"super_admin"
]}

/>

}

>


<Route

path="settings/privacy"

element={<PrivacyPage/>}

/>


</Route>








<Route

element={
<ProtectedRoute

allowedRoles={[
"practice_manager",
"super_admin"
]}

/>

}

>


<Route

path="settings/audit"

element={<AuditPage/>}

/>


</Route>









{/* =====================
        ADMIN
===================== */}



<Route

element={
<ProtectedRoute

allowedRoles={[
"super_admin"
]}

/>

}

>


<Route

path="admin"

element={<AdminPage/>}

/>


</Route>








</Route>


</Route>







</Routes>


</BrowserRouter>


</AppStateProvider>


);


}