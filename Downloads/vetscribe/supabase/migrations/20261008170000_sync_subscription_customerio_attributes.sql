create or replace function public.sync_subscription_to_customerio()
returns trigger
language plpgsql
security definer
as $$

declare
  v_user_id uuid;
  v_plan_name text;

begin

  select auth_user_id
  into v_user_id
  from public.profiles
  where practice_id = NEW.practice_id
  limit 1;


  select name
  into v_plan_name
  from public.subscription_plans
  where id = NEW.plan_id;


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

        'trial_start_date',
        NEW.trial_start,

        'trial_end_date',
        NEW.trial_end,

        'trial_days',
        NEW.trial_days,

        'referral_bonus_days',
        NEW.referral_bonus_days,

        'voucher_code',
        NEW.voucher_code

      )

    )

  );


  return NEW;

end;

$$;



drop trigger if exists sync_subscription_customerio_trigger
on public.subscriptions;


create trigger sync_subscription_customerio_trigger

after insert or update
on public.subscriptions

for each row

execute function public.sync_subscription_to_customerio();