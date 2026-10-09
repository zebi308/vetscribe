import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase/client";
import logo from "../assets/Logoo.png";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // In case the event fired before this page loaded
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!supabase) return;

    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (newPassword !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      await supabase.auth.signOut({ scope: "global" });
      navigate("/login?reset=success", { replace: true });
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Could not reset your password. Please try again.");
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
          <h1 className="text-2xl font-bold text-slate-900">Reset Your Password</h1>
        </div>

        {!ready ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            Checking your reset link… If this takes more than a few seconds, the link may have
            expired. Please request a new one.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="reset-password" className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="mt-2 flex items-center rounded-xl border border-slate-200 focus-within:border-teal-500">
                <input
                  id="reset-password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  disabled={loading}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label={showNew ? "Hide password" : "Show password"}
                  onClick={() => setShowNew((v) => !v)}
                  className="p-3 text-slate-500 hover:text-teal-700"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm" className="text-sm font-medium text-slate-700">
                Confirm New Password
              </label>
              <div className="mt-2 flex items-center rounded-xl border border-slate-200 focus-within:border-teal-500">
                <input
                  id="reset-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmation}
                  disabled={loading}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="p-3 text-slate-500 hover:text-teal-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole size={18} aria-hidden="true" />
              {loading ? "Saving..." : "Save New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}