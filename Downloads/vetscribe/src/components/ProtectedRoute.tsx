import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppState } from "../lib/AppState";
import { supabase } from "../lib/supabase/client";
import type { Role } from "../types/models";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

/**
 * Preserves existing login and role protection. In addition, vets with an
 * outstanding first-login password change cannot access protected app pages.
 * The flag is read from Supabase (not localStorage or client-only state).
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, authLoading } = useAppState();
  const [passwordCheck, setPasswordCheck] = useState<
    "checking" | "required" | "complete" | "error"
  >("checking");

  useEffect(() => {
    let cancelled = false;

    // The first-login requirement is only for veterinarian accounts.
    if (authLoading || !currentUser) {
      setPasswordCheck("checking");
      return () => { cancelled = true; };
    }
    if (currentUser.role !== "vet") {
      setPasswordCheck("complete");
      return () => { cancelled = true; };
    }

    setPasswordCheck("checking");

    async function checkFirstLoginPassword() {
      try {
        if (!supabase) throw new Error("Authentication is not available.");

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) throw authError || new Error("Session expired");

        const { data, error } = await supabase
          .from("profiles")
          .select("must_change_password")
          .eq("id", currentUser!.id)
          .eq("auth_user_id", authData.user.id)
          .single();

        if (error || !data) throw error || new Error("Unable to verify account");
        if (!cancelled) {
          setPasswordCheck(data.must_change_password === true ? "required" : "complete");
        }
      } catch (error) {
        console.error("FIRST LOGIN PASSWORD CHECK ERROR:", error);
        // Fail closed: never grant protected app access if the requirement
        // could not be verified.
        if (!cancelled) setPasswordCheck("error");
      }
    }

    void checkFirstLoginPassword();
    return () => { cancelled = true; };
  }, [authLoading, currentUser?.id, currentUser?.role]);

  // Existing authentication loading behaviour.
  if (authLoading) {
    return <div className="min-h-screen grid place-items-center text-slate-600">Loading...</div>;
  }

  // Existing unauthenticated redirect.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // New: block veterinarian app access until their first-login password
  // change has been completed successfully in Supabase.
  if (currentUser.role === "vet") {
    if (passwordCheck === "checking") {
      return <div className="min-h-screen grid place-items-center text-slate-600">Checking account security...</div>;
    }
    if (passwordCheck === "error") {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-50 p-5 text-center">
          <div className="max-w-md rounded-xl border border-red-200 bg-white p-6">
            <p className="font-semibold text-slate-900">Unable to verify account security</p>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page and try again. If the issue continues, contact your Practice Manager.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
          </div>
        </div>
      );
    }
    if (passwordCheck === "required") {
      return <Navigate to="/first-login-password" replace />;
    }
  }

  // Existing role restriction preserved.
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
