-- Send new VetScribe profiles to Customer.io

create or replace function public.sync_profile_to_customerio()
returns trigger
language plpgsql
security definer
as $$
begin

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
        NEW.practice_id
      )
    )
  );

  return NEW;

end;
$$;


create trigger on_profile_created_customerio
after insert on public.profiles
for each row
execute function public.sync_profile_to_customerio();