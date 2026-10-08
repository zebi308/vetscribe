create or replace function public.customerio_trial_started()
returns trigger
language plpgsql
security definer
as $$
begin

  if NEW.trial_start is not null
  then

    perform public.send_customerio_event(
      'trial_started',

      (
        select auth_user_id
        from public.profiles
        where practice_id = NEW.practice_id
        limit 1
      ),

      jsonb_build_object(
        'subscription_id',
        NEW.id,

        'trial_days',
        NEW.trial_days,

        'plan_id',
        NEW.plan_id
      )
    );

  end if;


  return NEW;

end;
$$;
