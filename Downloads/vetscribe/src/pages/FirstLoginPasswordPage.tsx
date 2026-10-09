import { useState } from "react";

import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import { useAppState } from "../lib/AppState";

import { supabase } from "../lib/supabase/client";

import logo from "../assets/Logoo.png";



/**

 * First-login password change for newly created veterinarians.

 * This page does not change existing login, staff, or subscription logic.

 *

 * Integration prerequisites (delivered separately):

 * - public.profiles.must_change_password boolean, default false

 * - restricted complete_vet_password_setup() RPC for signed-in vets

 * - a protected route directing flagged vets here before app access

 */

export function FirstLoginPasswordPage() {

  const navigate = useNavigate();

  const { currentUser, logout } = useAppState();

  const [newPassword, setNewPassword] = useState("");

  const [confirmation, setConfirmation] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Remain on the flag-completion step if Auth has already accepted the password.

  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const isRecoveryFlow = window.location.hash.includes("type=recovery");



  async function submit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setError("");



    if (!supabase) {

      setError("Authentication service is unavailable. Please try again.");

      return;

    }

    if (!passwordUpdated && newPassword.length < 8) {

      setError("Use at least 8 characters for your new password.");

      return;

    }

    if (!passwordUpdated && newPassword !== confirmation) {

      setError("The passwords do not match.");

      return;

    }



    setLoading(true);

    try {

      const { data: userResult, error: userError } = await supabase.auth.getUser();

      if (userError || !userResult.user) {

        throw new Error("Your session has expired. Please sign in again.");

      }



      let mustCompleteSetup = true;



      if (!isRecoveryFlow) {

        const { data: profile, error: profileError } = await supabase

          .from("profiles")

          .select("id, role, must_change_password")

          .eq("auth_user_id", userResult.user.id)

          .single();



        if (profileError) throw profileError;



        if (profile?.role !== "vet") {

          throw new Error("Unable to verify your veterinarian account.");

        }



        if (profile.must_change_password !== true) {

          navigate("/dashboard", { replace: true });

          return;

        }

      } else {

        mustCompleteSetup = false;

      }



      // Supabase Auth must accept the new password before the requirement is cleared.

      if (!passwordUpdated) {

        const { error: passwordError } = await supabase.auth.updateUser({

          password: newPassword,

        });



        if (passwordError) throw passwordError;



        const { error: refreshError } = await supabase.auth.refreshSession();



        if (refreshError) {

          throw refreshError;

        }



        setPasswordUpdated(true);

        setNewPassword("");

        setConfirmation("");

      }



      if (mustCompleteSetup) {

        // Complete first-login setup through the restricted database RPC.

        const { data: completed, error: flagError } = await supabase.rpc(

          "complete_vet_password_setup"

        );



        if (flagError) {

          throw new Error(`Your password was changed, but account setup could not be completed: ${flagError.message}`);

        }



        if (completed !== true) {

          const { data: verification, error: verificationError } = await supabase

            .from("profiles")

            .select("must_change_password")

            .eq("auth_user_id", userResult.user.id)

            .single();



          if (verificationError || verification?.must_change_password !== false) {

            throw new Error("Your password was changed, but account setup could not be confirmed. Please try again or contact your Practice Manager.");

          }

        }

      }



      setPasswordUpdated(false);



      // Force a clean login after password recovery/setup.

      // This confirms the new password works outside the recovery session.

      await supabase.auth.signOut();



      navigate("/login", { replace: true });

    } catch (cause: unknown) {

      setError(cause instanceof Error ? cause.message : "Unable to change your password. Please try again.");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex justify-center">

          <img src={logo} alt="VetScribe" className="h-14 w-14 object-contain" />

        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-teal-700">

          <ShieldCheck size={22} aria-hidden="true" />

          <h1 className="text-2xl font-bold text-slate-900">Secure Your Account</h1>

        </div>

        <p className="mt-3 text-center text-sm leading-6 text-slate-600">

          You're signing in with a temporary password. Create a new password to finish

          setting up your veterinarian account and access VetScribe.

        </p>



        <form onSubmit={submit} className="mt-7 space-y-5">

          {passwordUpdated && (

            <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">

              Your new password has been saved. Complete account setup to continue; you do not need to enter it again.

            </p>

          )}

          {!passwordUpdated && <>

          <div>

            <label htmlFor="first-login-password" className="text-sm font-medium text-slate-700">

              New Password

            </label>

            <div className="mt-2 flex items-center rounded-xl border border-slate-200 focus-within:border-teal-500">

              <input

                id="first-login-password"

                type={showNewPassword ? "text" : "password"}

                autoComplete="new-password"

                required

                minLength={8}

                value={newPassword}

                disabled={loading}

                onChange={(event) => setNewPassword(event.target.value)}

                className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none"

              />

              <button

                type="button"

                aria-label={showNewPassword ? "Hide new password" : "Show new password"}

                aria-pressed={showNewPassword}

                onClick={() => setShowNewPassword((value) => !value)}

                className="p-3 text-slate-500 hover:text-teal-700"

              >

                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}

              </button>

            </div>

          </div>



          <div>

            <label htmlFor="first-login-confirm" className="text-sm font-medium text-slate-700">

              Confirm New Password

            </label>

            <div className="mt-2 flex items-center rounded-xl border border-slate-200 focus-within:border-teal-500">

              <input

                id="first-login-confirm"

                type={showConfirmation ? "text" : "password"}

                autoComplete="new-password"

                required

                minLength={8}

                value={confirmation}

                disabled={loading}

                onChange={(event) => setConfirmation(event.target.value)}

                className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none"

              />

              <button

                type="button"

                aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}

                aria-pressed={showConfirmation}

                onClick={() => setShowConfirmation((value) => !value)}

                className="p-3 text-slate-500 hover:text-teal-700"

              >

                {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}

              </button>

            </div>

          </div>



          </>}

          <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs leading-5 text-teal-800">

            You must change your temporary password before continuing to the dashboard.

          </p>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}



          <button

            type="submit"

            disabled={loading}

            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"

          >

            <LockKeyhole size={18} aria-hidden="true" />

            {loading ? "Updating account..." : passwordUpdated ? "Complete Account Setup" : "Set Password & Continue"}

          </button>

          <button

            type="button"

            disabled={loading}

            onClick={() => void logout().then(() => navigate("/login", { replace: true }))}

            className="w-full text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-60"

          >

            Sign out

          </button>

        </form>

      </div>

    </div>

  );

}
