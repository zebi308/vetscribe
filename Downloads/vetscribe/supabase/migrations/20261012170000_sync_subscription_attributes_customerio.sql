create or replace function public.sync_subscription_to_customerio()
returns trigger
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_plan_name text;
begin

  -- Find user connected to this practice
  select auth_user_id
  into v_user_id
  from public.profiles
  where practice_id = NEW.practice_id
  limit 1;


  -- Get plan name
  select name
  into v_plan_name
  from public.subscription_plans
  where id = NEW.plan_id;


  -- Update Customer.io user attributes
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
      v_user_id,

      'attributes',
      jsonb_build_object(

        'subscription_status',
        NEW.status,

        'plan_name',
        v_plan_name,

        'trial_days',
        NEW.trial_days,

        'trial_end_date',
        NEW.trial_end,

        'referral_bonus_days',
        NEW.referral_bonus_days

      )
    )
  );


  return NEW;

end;
$$;



drop trigger if exists sync_subscription_customerio_attributes
on public.subscriptions;


create trigger sync_subscription_customerio_attributes

after insert or update
on public.subscriptions

for each row

execute function public.sync_subscription_to_customerio();
