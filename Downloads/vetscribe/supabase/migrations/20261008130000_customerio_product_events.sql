-- ============================================
-- Customer.io Product Event Tracking
-- VetScribe lifecycle events
-- ============================================


-- Generic helper for sending events to Customer.io

create or replace function public.send_customerio_event(
  event_name text,
  user_id uuid,
  event_properties jsonb default '{}'::jsonb
)
returns void
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
      'track_event',

      'event',
      event_name,

      'user_id',
      user_id,

      'properties',
      event_properties
    )
  );

end;
$$;



-- ============================================
-- 1. Patient Created Event
-- ============================================


create or replace function public.customerio_patient_created()
returns trigger
language plpgsql
security definer
as $$
begin

  perform public.send_customerio_event(
    'patient_created',
    (
      select auth_user_id
      from profiles
      where practice_id = NEW.practice_id
      limit 1
    ),
    jsonb_build_object(
      'patient_id',
      NEW.id,

      'species',
      NEW.species,

      'breed',
      NEW.breed,

      'practice_id',
      NEW.practice_id
    )
  );

  return NEW;

end;
$$;


create trigger on_patient_created_customerio
after insert on public.patients
for each row
execute function public.customerio_patient_created();



-- ============================================
-- 2. Consultation Approved Event
-- ============================================


create or replace function public.customerio_consultation_approved()
returns trigger
language plpgsql
security definer
as $$
begin

  if OLD.status <> 'approved'
  and NEW.status = 'approved'
  then

    perform public.send_customerio_event(
      'consultation_approved',

      (
        select auth_user_id
        from profiles
        where id = NEW.created_by
      ),

      jsonb_build_object(
        'consultation_id',
        NEW.id,

        'patient_id',
        NEW.patient_id,

        'consultation_date',
        NEW.consultation_date
      )
    );

  end if;


  return NEW;

end;
$$;


create trigger on_consultation_approved_customerio
after update on public.consultations
for each row
execute function public.customerio_consultation_approved();



-- ============================================
-- 3. Clinical Note Approved Event
-- ============================================


create or replace function public.customerio_clinical_note_approved()
returns trigger
language plpgsql
security definer
as $$
begin

  if OLD.approved_at is null
  and NEW.approved_at is not null
  then

    perform public.send_customerio_event(
      'clinical_note_approved',

      (
        select auth_user_id
        from profiles
        where id = NEW.approved_by
      ),

      jsonb_build_object(
        'clinical_note_id',
        NEW.id,

        'consultation_id',
        NEW.consultation_id,

        'patient_id',
        NEW.patient_id
      )
    );

  end if;


  return NEW;

end;
$$;


create trigger on_clinical_note_approved_customerio
after update on public.clinical_notes
for each row
execute function public.customerio_clinical_note_approved();



-- ============================================
-- 4. Trial Started Event
-- ============================================


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
        from profiles
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


create trigger on_trial_started_customerio
after insert on public.subscriptions
for each row
execute function public.customerio_trial_started();



-- ============================================
-- 5. Subscription Cancelled Event
-- ============================================


create or replace function public.customerio_subscription_cancelled()
returns trigger
language plpgsql
security definer
as $$
begin

  if OLD.cancelled_at is null
  and NEW.cancelled_at is not null
  then

    perform public.send_customerio_event(
      'subscription_cancelled',

      (
        select auth_user_id
        from profiles
        where practice_id = NEW.practice_id
        limit 1
      ),

      jsonb_build_object(
        'subscription_id',
        NEW.id,

        'plan_id',
        NEW.plan_id
      )
    );

  end if;


  return NEW;

end;
$$;


create trigger on_subscription_cancelled_customerio
after update on public.subscriptions
for each row
execute function public.customerio_subscription_cancelled();