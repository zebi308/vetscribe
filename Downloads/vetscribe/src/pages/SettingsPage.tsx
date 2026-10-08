import { useEffect, useState } from "react";
import { Building2, Eye, EyeOff, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAppState } from "../lib/AppState";
import { supabase } from "../lib/supabase/client";

/** Only the settings screen is changed. Server-side permissions must be enforced by Supabase RLS. */
export function SettingsPage() {
  const { practice, currentUser, updatePractice } = useAppState();
  const isPracticeManager = currentUser?.role === "practice_manager";

  const [practiceForm, setPracticeForm] = useState({
    name: "", email: "", phone: "", address_line_1: "", city: "", postcode: "", logo_url: "",
  });
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirm: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState<"practice" | "profile" | "password" | null>(null);
  const [feedback, setFeedback] = useState<{ section: string; message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!practice) return;
    const p = practice as any;
    setPracticeForm({
      name: p.name ?? "", email: p.email ?? "", phone: p.phone ?? "",
      address_line_1: p.address_line_1 ?? p.address ?? "",
      city: p.city ?? "", postcode: p.postcode ?? "", logo_url: p.logo_url ?? "",
    });
  }, [practice]);

  useEffect(() => {
    setProfileForm({ firstName: currentUser?.firstName ?? "", lastName: currentUser?.lastName ?? "" });
  }, [currentUser]);

  const report = (section: string, message: string, success = false) =>
    setFeedback({ section, message, success });

  async function savePractice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPracticeManager || !practice) return;
    if (!practiceForm.name.trim()) return report("practice", "Practice name is required.");
    try {
      setSaving("practice");
      setFeedback(null);
      await updatePractice({
        name: practiceForm.name.trim(),
        email: practiceForm.email.trim(),
        phone: practiceForm.phone.trim(),
        address_line_1: practiceForm.address_line_1.trim(),
        city: practiceForm.city.trim(),
        postcode: practiceForm.postcode.trim(),
        logo_url: practiceForm.logo_url.trim(),
      });
      report("practice", "Practice profile updated.", true);
    } catch (error: any) {
      report("practice", error?.message || "Unable to save practice details.");
    } finally {
      setSaving(null);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !currentUser?.id) return report("profile", "Account is not available.");
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim())
      return report("profile", "First and last name are required.");
    try {
      setSaving("profile");
      setFeedback(null);
      // This update must be restricted to the signed-in user's profile by database RLS.
      const { error } = await supabase.from("profiles").update({
        first_name: profileForm.firstName.trim(),
        last_name: profileForm.lastName.trim(),
      }).eq("id", currentUser.id);
      if (error) throw error;
      report("profile", "Profile updated. Refresh the page to see your new name in the sidebar.", true);
    } catch (error: any) {
      report("profile", error?.message || "Unable to update profile.");
    } finally {
      setSaving(null);
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return report("password", "Authentication is not available.");
    if (passwordForm.password.length < 8)
      return report("password", "Use a password with at least 8 characters.");
    if (passwordForm.password !== passwordForm.confirm)
      return report("password", "Passwords do not match.");
    try {
      setSaving("password");
      setFeedback(null);
      const { error } = await supabase.auth.updateUser({ password: passwordForm.password });
      if (error) throw error;
      setPasswordForm({ password: "", confirm: "" });
      report("password", "Password updated successfully.", true);
    } catch (error: any) {
      report("password", error?.message || "Unable to update password. You may need to sign in again.");
    } finally {
      setSaving(null);
    }
  }

  const inputClass = "mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10";
  const buttonClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60";
  const sectionClass = "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

  function message(section: string) {
    if (feedback?.section !== section) return null;
    return (
      <p role="status" className={`mt-4 rounded-lg px-3 py-2 text-sm ${feedback.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-700"}`}>
        {feedback.message}
      </p>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your profile, practice details and account security.</p>
      </header>

      {isPracticeManager && (
        <section className={sectionClass}>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Building2 size={22} /></div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Practice Profile</h2>
              <p className="text-sm text-slate-500">Clinic information · Practice Manager only</p>
            </div>
          </div>
          <form onSubmit={savePractice} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                ["name", "Practice Name", "text"],
                ["email", "Contact Email", "email"],
                ["phone", "Phone Number", "tel"],
                ["address_line_1", "Practice Address", "text"],
                ["city", "City", "text"],
                ["postcode", "Postcode", "text"],
              ] as const).map(([key, label, type]) => (
                <label key={key} className="block min-w-0 text-sm font-medium text-slate-800">
                  {label}
                  <input type={type} className={inputClass} value={practiceForm[key]}
                    onChange={(e) => setPracticeForm((prev) => ({ ...prev, [key]: e.target.value }))} />
                </label>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className={buttonClass} disabled={saving !== null || !practice}>
                {saving === "practice" ? "Saving..." : <><Save size={17} /> Save Practice Profile</>}
              </button>
            </div>
          </form>
          {message("practice")}
        </section>
      )}

      <section className={sectionClass}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><UserRound size={22} /></div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">My Profile</h2>
            <p className="text-sm text-slate-500">Your personal account details · All users</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-800">First Name
              <input className={inputClass} value={profileForm.firstName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))} />
            </label>
            <label className="block text-sm font-medium text-slate-800">Last Name
              <input className={inputClass} value={profileForm.lastName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))} />
            </label>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">Email Address</p>
              <p className="mt-2 break-words rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{currentUser?.email || "—"}</p>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">Assigned Role</p>
              <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-600">{currentUser?.role?.replace(/_/g, " ") || "—"}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">Practice: {practice?.name || "—"}. Email and role changes are not available here.</p>
          <div className="flex justify-end">
            <button type="submit" className={buttonClass} disabled={saving !== null || !currentUser}>
              {saving === "profile" ? "Saving..." : <><Save size={17} /> Save My Profile</>}
            </button>
          </div>
        </form>
        {message("profile")}
      </section>

      <section className={sectionClass}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><ShieldCheck size={22} /></div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Account Security</h2>
            <p className="text-sm text-slate-500">Change your sign-in password · All users</p>
          </div>
        </div>
        <form onSubmit={changePassword} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="block min-w-0 text-sm font-medium text-slate-800">
              <label htmlFor="settings-new-password">New Password</label>
              <div className="relative">
                <input id="settings-new-password" type={showNewPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required className={`${inputClass} pr-12`}
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))} />
                <button type="button" onClick={() => setShowNewPassword((visible) => !visible)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  aria-pressed={showNewPassword}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                  {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>
            <div className="block min-w-0 text-sm font-medium text-slate-800">
              <label htmlFor="settings-confirm-password">Confirm New Password</label>
              <div className="relative">
                <input id="settings-confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required className={`${inputClass} pr-12`}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))} />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className={buttonClass} disabled={saving !== null || !currentUser}>
              {saving === "password" ? "Updating..." : <><LockKeyhole size={17} /> Change Password</>}
            </button>
          </div>
        </form>
        {message("password")}
      </section>
    </div>
  );
}
