-- =====================================================
-- Customer.io Person Attribute Sync
-- Does not change application logic
-- Only enriches Customer.io profiles
-- =====================================================


-- =====================================================
-- Trial Started
-- =====================================================

create or replace function public.customerio_trial_started()
returns trigger
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_plan_name text;
  v_patients_count integer;
  v_consultations_count integer;
begin

  if NEW.trial_start is not null then


    select auth_user_id
    into v_user_id
    from public.profiles
    where practice_id = NEW.practice_id
    limit 1;


    select name
    into v_plan_name
    from public.subscription_plans
    where id = NEW.plan_id;


    select count(*)
    into v_patients_count
    from public.patients
    where practice_id = NEW.practice_id;


    select count(*)
    into v_consultations_count
    from public.consultations
    where practice_id = NEW.practice_id;


    perform public.send_customerio_event(
      'trial_started',
      v_user_id,
      jsonb_build_object(

        'subscription_id',
        NEW.id,

        'subscription_status',
        NEW.status,

        'plan_name',
        v_plan_name,

        'trial_days',
        NEW.trial_days,

        'trial_end_date',
        NEW.trial_end,

        'patients_count',
        v_patients_count,

        'consultations_count',
        v_consultations_count,

        'referral_bonus_days',
        NEW.referral_bonus_days

      )
    );


  end if;


  return NEW;

end;
$$;



-- =====================================================
-- Patient Created
-- =====================================================

create or replace function public.customerio_patient_created()
returns trigger
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_patient_count integer;
begin


  select auth_user_id
  into v_user_id
  from public.profiles
  where practice_id = NEW.practice_id
  limit 1;


  select count(*)
  into v_patient_count
  from public.patients
  where practice_id = NEW.practice_id;


  perform public.send_customerio_event(
    'patient_created',
    v_user_id,
    jsonb_build_object(

      'patient_id',
      NEW.id,

      'species',
      NEW.species,

      'breed',
      NEW.breed,

      'patients_count',
      v_patient_count,

      'last_activity_date',
      now()

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
declare
 v_user_id uuid;
 v_consultation_count integer;
begin


 if OLD.status <> 'approved'
 and NEW.status = 'approved'
 then


 select auth_user_id
 into v_user_id
 from public.profiles
 where id = NEW.created_by;


 select count(*)
 into v_consultation_count
 from public.consultations
 where practice_id = NEW.practice_id;


 perform public.send_customerio_event(
   'consultation_approved',
   v_user_id,
   jsonb_build_object(

      'consultation_id',
      NEW.id,

      'patient_id',
      NEW.patient_id,

      'consultations_count',
      v_consultation_count,

      'last_activity_date',
      now()

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
declare
 v_user_id uuid;
begin


if OLD.approved_at is null
and NEW.approved_at is not null
then


select auth_user_id
into v_user_id
from public.profiles
where id = NEW.approved_by;


perform public.send_customerio_event(
'clinical_note_approved',
v_user_id,
jsonb_build_object(

 'clinical_note_id',
 NEW.id,

 'consultation_id',
 NEW.consultation_id,

 'patient_id',
 NEW.patient_id,

 'last_activity_date',
 now()

)
);


end if;


return NEW;

end;
$$;