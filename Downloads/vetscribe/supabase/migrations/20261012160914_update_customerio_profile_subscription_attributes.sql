CREATE OR REPLACE FUNCTION public.sync_profile_to_customerio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$

declare
  v_subscription_status text;
  v_plan_name text;
  v_trial_end timestamptz;

begin

  select
    s.status,
    sp.name,
    s.trial_end
  into
    v_subscription_status,
    v_plan_name,
    v_trial_end

  from public.subscriptions s
  left join public.subscription_plans sp
    on sp.id = s.plan_id

  where s.practice_id = NEW.practice_id

  limit 1;


  perform net.http_post(
    url := 'https://kjhmvekhqwetbtkoxrvf.supabase.co/functions/v1/customerio-event',

    headers := jsonb_build_object(
      'Content-Type',
      'application/json',
      'x-customerio-webhook-secret',
      'vts_ci_5d72k3h7x91m_secure'
    ),

    body := jsonb_build_object(

      'action',
      'identify_user',

      'user_id',
      NEW.auth_user_id,

      'email',
      NEW.email,

      'attributes',

      jsonb_build_object(

        'first_name',
        NEW.first_name,

        'last_name',
        NEW.last_name,

        'role',
        NEW.role,

        'practice_id',
        NEW.practice_id,

        'subscription_status',
        v_subscription_status,

        'plan_name',
        v_plan_name,

        'trial_end_date',
        v_trial_end

      )
    )
  );


  return NEW;

end;

$function$;