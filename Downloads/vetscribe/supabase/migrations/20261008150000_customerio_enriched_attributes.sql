-- =====================================================
-- Customer.io enriched lifecycle event attributes
-- Only updates Customer.io payloads
-- No application logic changes
-- =====================================================


-- =====================================================
-- Patient Created
-- =====================================================

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
      from public.profiles
      where practice_id = NEW.practice_id
      limit 1
    ),

    jsonb_build_object(

      'patient_id',
      NEW.id,

      'patient_name',
      NEW.name,

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



-- =====================================================
-- Consultation Approved
-- =====================================================

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
        from public.profiles
        where id = NEW.created_by
      ),

      jsonb_build_object(

        'consultation_id',
        NEW.id,

        'patient_id',
        NEW.patient_id,

        'consultation_date',
        NEW.consultation_date,

        'status',
        NEW.status
      )
    );

  end if;


  return NEW;

end;
$$;



-- =====================================================
-- Clinical Note Approved
-- =====================================================

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
        from public.profiles
        where id = NEW.approved_by
      ),

      jsonb_build_object(

        'clinical_note_id',
        NEW.id,

        'consultation_id',
        NEW.consultation_id,

        'patient_id',
        NEW.patient_id,

        'version',
        NEW.version
      )
    );

  end if;


  return NEW;

end;
$$;



-- =====================================================
-- Trial Started
-- =====================================================

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
        NEW.plan_id,

        'trial_end',
        NEW.trial_end,

        'voucher_code',
        NEW.voucher_code,

        'referral_bonus_days',
        NEW.referral_bonus_days
      )
    );

  end if;


  return NEW;

end;
$$;



-- =====================================================
-- Subscription Cancelled
-- =====================================================

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
        from public.profiles
        where practice_id = NEW.practice_id
        limit 1
      ),

      jsonb_build_object(

        'subscription_id',
        NEW.id,

        'plan_id',
        NEW.plan_id,

        'cancelled_at',
        NEW.cancelled_at,

        'status',
        NEW.status
      )
    );

  end if;


  return NEW;

end;
$$;