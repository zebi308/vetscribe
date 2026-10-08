import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);

  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return reply({ error: "Sign in is required" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return reply({ error: "Server configuration missing" }, 500);

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const authClient = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });

  try {
    const { data: authenticated, error: userError } = await authClient.auth.getUser(token);
    if (userError || !authenticated.user) return reply({ error: "Not authenticated" }, 401);

    // Never trust role or practice_id sent by the browser.
    const { data: manager, error: managerError } = await admin
      .from("profiles")
      .select("id,practice_id,role,is_active")
      .eq("auth_user_id", authenticated.user.id)
      .single();
    if (managerError || !manager || manager.role !== "practice_manager" || manager.is_active === false || !manager.practice_id) {
      return reply({ error: "Only an active Practice Manager can create veterinarians" }, 403);
    }

    const input = await req.json().catch(() => null);
    const firstName = typeof input?.firstName === "string" ? input.firstName.trim() : "";
    const lastName = typeof input?.lastName === "string" ? input.lastName.trim() : "";
    const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input?.password === "string" ? input.password : "";

    if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) {
      return reply({ error: "Enter a valid name, email, and temporary password (8–128 characters)" }, 400);
    }

    // Server-side subscription and staff-limit checks. Existing front-end
    // checks remain unchanged and continue to provide immediate feedback.
    const { data: sub, error: subError } = await admin
      .from("subscriptions")
      .select("plan_id,status")
      .eq("practice_id", manager.practice_id)
      .in("status", ["active", "trialing"])
      .limit(1)
      .maybeSingle();
    if (subError || !sub?.plan_id) return reply({ error: "An active subscription is required" }, 403);

    const { data: plan, error: planError } = await admin
      .from("subscription_plans")
      .select("max_users")
      .eq("id", sub.plan_id)
      .single();
    if (planError || !plan) return reply({ error: "Unable to verify plan limits" }, 500);

    const { count, error: countError } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("practice_id", manager.practice_id)
      .eq("role", "vet");
    if (countError) return reply({ error: "Unable to verify staff count" }, 500);
    const maxUsers = Number(plan.max_users);
    if (plan.max_users !== null && plan.max_users !== undefined && maxUsers > 0 && (count ?? 0) >= maxUsers) {
      return reply({ error: "Veterinarian limit reached. Upgrade your subscription." }, 403);
    }

    // Service-role admin calls must run only in this authenticated server function.
    // email_confirm allows the manager-created temporary credential to work immediately.
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return reply({ error: createError?.message ?? "Unable to create veterinarian account" }, 400);
    }

    const { error: profileError } = await admin.from("profiles").insert({
      auth_user_id: created.user.id,
      practice_id: manager.practice_id,
      first_name: firstName,
      last_name: lastName,
      email,
      role: "vet",
      is_active: true,
      must_change_password: true,
    });

    if (profileError) {
      // Avoid leaving a new orphan auth account when its profile cannot be inserted.
      const { error: cleanupError } = await admin.auth.admin.deleteUser(created.user.id);
      if (cleanupError) console.error("VET CREATE ROLLBACK FAILED", cleanupError.message);
      return reply({ error: "Unable to create veterinarian profile" }, 500);
    }

    return reply({ userId: created.user.id });
  } catch (error) {
    console.error("CREATE VETERINARIAN ERROR", error instanceof Error ? error.message : "unknown error");
    return reply({ error: "Unable to create veterinarian. Please try again." }, 500);
  }
});
