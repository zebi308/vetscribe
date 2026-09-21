-- VetScribe initial production-oriented schema
create extension if not exists pgcrypto;

create type public.user_role as enum ('vet','nurse','practice_manager','super_admin');
create type public.consultation_status as enum ('draft','transcribing','generating','awaiting_review','approved','cancelled');
create type public.capture_type as enum ('audio','typed','mixed');
create type public.medicine_category as enum ('POM-V','POM-VPS','Cascade','Other');

create table public.practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subdomain text unique,
  logo_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#115e59',
  address_line_1 text,
  address_line_2 text,
  city text,
  postcode text,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  practice_id uuid references public.practices(id) on delete restrict,
  first_name text not null,
  last_name text not null,
  email text not null,
  role public.user_role not null,
  professional_registration_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint normal_user_requires_practice check (role = 'super_admin' or practice_id is not null)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(), practice_id uuid not null references public.practices(id) on delete restrict,
  first_name text not null,last_name text not null,address_line_1 text,address_line_2 text,city text,postcode text,phone text,email text,
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index clients_practice_idx on public.clients(practice_id);

create table public.patients (
  id uuid primary key default gen_random_uuid(), practice_id uuid not null references public.practices(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,name text not null,species text not null,breed text,sex text,neutered boolean,
  date_of_birth date,microchip_number text,colour text,weight_kg numeric(7,2) check (weight_kg is null or weight_kg > 0),
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index patients_practice_idx on public.patients(practice_id);
create index patients_client_idx on public.patients(client_id);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete restrict,client_id uuid not null references public.clients(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,treating_vet_id uuid not null references public.profiles(id) on delete restrict,
  consultation_date timestamptz not null,status public.consultation_status not null default 'draft',capture_type public.capture_type not null default 'audio',
  audio_storage_path text,transcript text,ai_generation_status text,started_at timestamptz,ended_at timestamptz,
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index consultations_practice_idx on public.consultations(practice_id);
create index consultations_patient_idx on public.consultations(patient_id, consultation_date desc);

create table public.clinical_notes (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  consultation_id uuid not null unique references public.consultations(id) on delete restrict,patient_id uuid not null references public.patients(id) on delete restrict,
  subjective text,objective text,assessment text,plan text,diagnostic_tests jsonb not null default '[]'::jsonb,diagnoses jsonb not null default '[]'::jsonb,
  differentials jsonb not null default '[]'::jsonb,treatment_given jsonb not null default '[]'::jsonb,medicines jsonb not null default '[]'::jsonb,
  client_advice text,follow_up text,structured_content jsonb not null default '{}'::jsonb,
  ai_generated boolean not null default false,ai_model text,ai_generated_at timestamptz,reviewed_by uuid references public.profiles(id),reviewed_at timestamptz,
  approved_by uuid references public.profiles(id),approved_at timestamptz,version integer not null default 0 check (version >= 0),
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index clinical_notes_practice_idx on public.clinical_notes(practice_id);

create table public.clinical_note_versions (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  clinical_note_id uuid not null references public.clinical_notes(id) on delete restrict,version_number integer not null check(version_number > 0),
  content_json jsonb not null,changed_by uuid not null references public.profiles(id) on delete restrict,change_reason text not null,created_at timestamptz not null default now(),
  unique(clinical_note_id, version_number)
);
create index clinical_note_versions_practice_idx on public.clinical_note_versions(practice_id);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  actor_user_id uuid references public.profiles(id) on delete set null,entity_type text not null,entity_id uuid,action text not null,
  before_json jsonb,after_json jsonb,ip_address inet,user_agent text,created_at timestamptz not null default now()
);
create index audit_logs_practice_created_idx on public.audit_logs(practice_id,created_at desc);

create table public.owner_summaries (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  consultation_id uuid not null references public.consultations(id) on delete restrict,patient_id uuid not null references public.patients(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,summary_text text not null,structured_content jsonb not null default '{}'::jsonb,
  ai_model text,generated_at timestamptz not null default now(),generated_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index owner_summaries_practice_idx on public.owner_summaries(practice_id);

create table public.medicines (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null references public.practices(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete restrict,client_id uuid not null references public.clients(id) on delete restrict,
  consultation_id uuid references public.consultations(id) on delete restrict,prescribing_vet_id uuid not null references public.profiles(id) on delete restrict,
  medicine_name text not null,medicine_category public.medicine_category not null,quantity numeric not null check(quantity > 0),unit text,
  batch_number text not null,prescribed_date date not null,withdrawal_period text,instructions text,created_at timestamptz not null default now()
);
create index medicines_practice_idx on public.medicines(practice_id);

create table public.practice_settings (
  id uuid primary key default gen_random_uuid(),practice_id uuid not null unique references public.practices(id) on delete cascade,
  default_note_template jsonb not null default '{}'::jsonb,owner_summary_template jsonb not null default '{}'::jsonb,
  retention_period_years integer not null default 5 check(retention_period_years > 0),created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);

-- Resolve tenant membership without trusting any client-supplied practice_id.
create or replace function public.get_user_practice_id()
returns uuid language sql stable security definer set search_path=public as $$
  select practice_id from public.profiles where auth_user_id = auth.uid() and is_active = true limit 1;
$$;
revoke all on function public.get_user_practice_id() from public;
grant execute on function public.get_user_practice_id() to authenticated;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where auth_user_id=auth.uid() and role='super_admin' and is_active=true);
$$;
revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

create or replace function public.is_practice_manager()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where auth_user_id=auth.uid() and role='practice_manager' and is_active=true and practice_id=public.get_user_practice_id());
$$;
revoke all on function public.is_practice_manager() from public;
grant execute on function public.is_practice_manager() to authenticated;

create or replace function public.current_profile_id()
returns uuid language sql stable security definer set search_path=public as $$
  select id from public.profiles where auth_user_id=auth.uid() and is_active=true limit 1;
$$;
revoke all on function public.current_profile_id() from public;
grant execute on function public.current_profile_id() to authenticated;


create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where auth_user_id=auth.uid() and is_active=true limit 1;
$$;
revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.prevent_practice_id_change()
returns trigger language plpgsql as $$
begin
  if tg_op='UPDATE' and new.practice_id is distinct from old.practice_id then
    raise exception 'practice_id cannot be changed';
  end if;
  return new;
end; $$;

-- Cross-record tenant integrity: the selected patient/client/staff must belong to the same practice.
create or replace function public.validate_consultation_tenant_links()
returns trigger language plpgsql as $$
begin
  if not exists(select 1 from public.patients p where p.id=new.patient_id and p.practice_id=new.practice_id) then raise exception 'patient is outside practice'; end if;
  if not exists(select 1 from public.clients c where c.id=new.client_id and c.practice_id=new.practice_id) then raise exception 'client is outside practice'; end if;
  if not exists(select 1 from public.profiles p where p.id=new.created_by and p.practice_id=new.practice_id) then raise exception 'creator is outside practice'; end if;
  if not exists(select 1 from public.profiles p where p.id=new.treating_vet_id and p.practice_id=new.practice_id and p.role='vet' and p.is_active) then raise exception 'treating vet is invalid'; end if;
  return new;
end; $$;
create trigger consultations_tenant_links before insert or update on public.consultations for each row execute function public.validate_consultation_tenant_links();

create or replace function public.validate_approval()
returns trigger language plpgsql as $$
declare n public.clinical_notes; approver public.profiles;
begin
  if new.status='approved' and old.status is distinct from 'approved' then
    select * into n from public.clinical_notes where consultation_id=new.id;
    if n.id is null then raise exception 'clinical note required before approval'; end if;
    if coalesce(trim(n.objective),'')='' then raise exception 'clinical findings required before approval'; end if;
    if coalesce(trim(n.assessment),'')='' and jsonb_array_length(n.differentials)=0 and jsonb_array_length(n.diagnoses)=0 then raise exception 'assessment, diagnosis or differential required before approval'; end if;
    if coalesce(trim(n.plan),'')='' and jsonb_array_length(n.treatment_given)=0 then raise exception 'treatment or plan required before approval'; end if;
    if n.approved_by is null or n.approved_at is null then raise exception 'approval metadata required'; end if;
    select * into approver from public.profiles where id=n.approved_by;
    if approver.role is distinct from 'vet' or approver.practice_id is distinct from new.practice_id or not approver.is_active then raise exception 'only active veterinary surgeons in the practice can approve'; end if;
    if approver.auth_user_id is distinct from auth.uid() then raise exception 'approving vet must match authenticated user'; end if;
  end if;
  return new;
end; $$;
create trigger consultation_approval_guard before update of status on public.consultations for each row execute function public.validate_approval();


create or replace function public.guard_clinical_approval_metadata()
returns trigger language plpgsql as $$
declare me public.profiles;
begin
  if (new.approved_by is distinct from old.approved_by) or (new.approved_at is distinct from old.approved_at) then
    if new.approved_by is null or new.approved_at is null then
      if old.approved_by is not null and exists(select 1 from public.consultations c where c.id=new.consultation_id and c.status='approved') then
        raise exception 'Start an amendment before clearing approval metadata';
      end if;
      return new;
    end if;
    select * into me from public.profiles where auth_user_id=auth.uid() and is_active=true;
    if me.id is null or me.role is distinct from 'vet' or me.id is distinct from new.approved_by or me.practice_id is distinct from new.practice_id then
      raise exception 'approval metadata may only be set by the authenticated veterinary surgeon';
    end if;
  end if;
  return new;
end; $$;
create trigger clinical_note_approval_metadata_guard before update on public.clinical_notes for each row execute function public.guard_clinical_approval_metadata();

-- Make clinical-note versions append-only at database level.
create or replace function public.block_version_mutation()
returns trigger language plpgsql as $$ begin raise exception 'clinical note versions are append-only'; end; $$;
create trigger clinical_versions_no_update before update or delete on public.clinical_note_versions for each row execute function public.block_version_mutation();


-- Cross-record tenant integrity for remaining tenant tables.
create or replace function public.validate_patient_tenant_link()
returns trigger language plpgsql as $$ begin
  if not exists(select 1 from public.clients c where c.id=new.client_id and c.practice_id=new.practice_id) then raise exception 'client is outside practice'; end if;
  return new;
end; $$;
create trigger patient_tenant_link before insert or update on public.patients for each row execute function public.validate_patient_tenant_link();

create or replace function public.validate_clinical_note_tenant_links()
returns trigger language plpgsql as $$ begin
  if not exists(select 1 from public.consultations c where c.id=new.consultation_id and c.practice_id=new.practice_id and c.patient_id=new.patient_id) then raise exception 'consultation/patient is outside practice'; end if;
  return new;
end; $$;
create trigger clinical_note_tenant_links before insert or update on public.clinical_notes for each row execute function public.validate_clinical_note_tenant_links();

create or replace function public.validate_owner_summary_tenant_links()
returns trigger language plpgsql as $$ begin
  if not exists(select 1 from public.consultations c where c.id=new.consultation_id and c.practice_id=new.practice_id and c.patient_id=new.patient_id and c.client_id=new.client_id and c.status='approved') then raise exception 'owner summary must reference an approved consultation in the same practice'; end if;
  return new;
end; $$;
create trigger owner_summary_tenant_links before insert or update on public.owner_summaries for each row execute function public.validate_owner_summary_tenant_links();

create or replace function public.validate_medicine_tenant_links()
returns trigger language plpgsql as $$ begin
  if not exists(select 1 from public.patients p where p.id=new.patient_id and p.practice_id=new.practice_id and p.client_id=new.client_id) then raise exception 'medicine patient/client is outside practice'; end if;
  if not exists(select 1 from public.profiles p where p.id=new.prescribing_vet_id and p.practice_id=new.practice_id and p.role='vet' and p.is_active) then raise exception 'prescribing vet is invalid'; end if;
  if new.consultation_id is not null and not exists(select 1 from public.consultations c where c.id=new.consultation_id and c.practice_id=new.practice_id and c.patient_id=new.patient_id) then raise exception 'medicine consultation is outside practice'; end if;
  return new;
end; $$;
create trigger medicine_tenant_links before insert or update on public.medicines for each row execute function public.validate_medicine_tenant_links();

-- Prevent tenant key mutation on tenant-specific tables.
do $$ declare t text; begin
  foreach t in array array['clients','patients','consultations','clinical_notes','clinical_note_versions','audit_logs','owner_summaries','medicines','practice_settings'] loop
    execute format('create trigger %I_practice_immutable before update on public.%I for each row execute function public.prevent_practice_id_change()',t,t);
  end loop;
end $$;

-- RLS
alter table public.practices enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.patients enable row level security;
alter table public.consultations enable row level security;
alter table public.clinical_notes enable row level security;
alter table public.clinical_note_versions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.owner_summaries enable row level security;
alter table public.medicines enable row level security;
alter table public.practice_settings enable row level security;

create policy practice_read on public.practices for select to authenticated using (id=public.get_user_practice_id() or public.is_super_admin());
create policy profile_read on public.profiles for select to authenticated using (practice_id=public.get_user_practice_id() or auth_user_id=auth.uid() or public.is_super_admin());
create policy profile_update_manager on public.profiles for update to authenticated using (practice_id=public.get_user_practice_id() and public.is_practice_manager()) with check (practice_id=public.get_user_practice_id());
create policy profile_insert_manager on public.profiles for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.is_practice_manager());
create policy practice_update_manager on public.practices for update to authenticated using (id=public.get_user_practice_id() and public.is_practice_manager()) with check (id=public.get_user_practice_id());
create policy practice_superadmin_insert on public.practices for insert to authenticated with check (public.is_super_admin());
create policy practice_superadmin_update on public.practices for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Tenant reads are scoped to the authenticated practice; writes are additionally role-gated.
do $$ declare t text; begin
  foreach t in array array['clients','patients','consultations','clinical_notes','owner_summaries','medicines'] loop
    execute format('create policy %I_select on public.%I for select to authenticated using (practice_id=public.get_user_practice_id() or public.is_super_admin())',t,t);
  end loop;
end $$;

create policy clients_insert on public.clients for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse','practice_manager') or public.is_super_admin());
create policy clients_update on public.clients for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse','practice_manager') or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy patients_insert on public.patients for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse','practice_manager') or public.is_super_admin());
create policy patients_update on public.patients for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse','practice_manager') or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy consultations_insert on public.consultations for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse') or public.is_super_admin());
create policy consultations_update on public.consultations for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse') or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy clinical_notes_insert on public.clinical_notes for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse') or public.is_super_admin());
create policy clinical_notes_update on public.clinical_notes for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role() in ('vet','nurse') or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy owner_summaries_insert on public.owner_summaries for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role()='vet' or public.is_super_admin());
create policy owner_summaries_update on public.owner_summaries for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role()='vet' or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy medicines_insert on public.medicines for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role()='vet' or public.is_super_admin());
create policy medicines_update on public.medicines for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role()='vet' or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy practice_settings_select on public.practice_settings for select to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role()='practice_manager' or public.is_super_admin());
create policy practice_settings_insert on public.practice_settings for insert to authenticated with check (practice_id=public.get_user_practice_id() and public.current_user_role()='practice_manager' or public.is_super_admin());
create policy practice_settings_update on public.practice_settings for update to authenticated using (practice_id=public.get_user_practice_id() and public.current_user_role()='practice_manager' or public.is_super_admin()) with check (practice_id=public.get_user_practice_id() or public.is_super_admin());

create policy versions_select on public.clinical_note_versions for select to authenticated using (practice_id=public.get_user_practice_id() or public.is_super_admin());
create policy versions_insert on public.clinical_note_versions for insert to authenticated with check ((practice_id=public.get_user_practice_id() and changed_by=public.current_profile_id() and public.current_user_role()='vet') or public.is_super_admin());
create policy audits_select on public.audit_logs for select to authenticated using ((practice_id=public.get_user_practice_id() and public.current_user_role()='practice_manager') or public.is_super_admin());
create policy audits_insert on public.audit_logs for insert to authenticated with check ((practice_id=public.get_user_practice_id() and actor_user_id=public.current_profile_id()) or public.is_super_admin());

-- Storage bucket for consultation audio. Storage object names should begin with practice UUID.
insert into storage.buckets (id,name,public) values ('consultation-audio','consultation-audio',false) on conflict (id) do nothing;
create policy audio_select on storage.objects for select to authenticated using (bucket_id='consultation-audio' and (storage.foldername(name))[1]=public.get_user_practice_id()::text);
create policy audio_insert on storage.objects for insert to authenticated with check (bucket_id='consultation-audio' and (storage.foldername(name))[1]=public.get_user_practice_id()::text);

-- Useful timestamps
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
do $$ declare t text; begin
  foreach t in array array['practices','profiles','clients','patients','consultations','clinical_notes','owner_summaries','practice_settings'] loop
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()',t,t);
  end loop;
end $$;

-- Atomic veterinary approval. The authenticated vet is the signer; the client cannot choose another approver.
create or replace function public.approve_clinical_record(
  p_consultation_id uuid,
  p_structured_content jsonb,
  p_change_reason text default 'Reviewed and approved'
) returns integer
language plpgsql
security invoker
set search_path=public
as $$
declare
  me public.profiles;
  con public.consultations;
  note public.clinical_notes;
  next_version integer;
begin
  select * into me from public.profiles where auth_user_id=auth.uid() and is_active=true limit 1;
  if me.id is null or me.role is distinct from 'vet' then raise exception 'Only an authenticated veterinary surgeon may approve'; end if;

  select * into con from public.consultations where id=p_consultation_id for update;
  if con.id is null or con.practice_id is distinct from me.practice_id then raise exception 'Consultation not accessible'; end if;
  if con.treating_vet_id is null then raise exception 'Treating vet required'; end if;

  select * into note from public.clinical_notes where consultation_id=p_consultation_id for update;
  if note.id is null then raise exception 'Clinical note required before approval'; end if;

  next_version := greatest(coalesce(note.version,0),0)+1;
  update public.clinical_notes set
    structured_content=p_structured_content,
    subjective=coalesce(p_structured_content #>> '{subjective,presenting_complaint}','') || E'\n' || coalesce(p_structured_content #>> '{subjective,history}','') || E'\n' || coalesce(p_structured_content #>> '{subjective,owner_observations}',''),
    objective=coalesce(p_structured_content #>> '{objective,clinical_findings}',''),
    assessment=coalesce(p_structured_content #>> '{assessment,primary_assessment}',''),
    plan=coalesce(p_structured_content #>> '{plan,client_advice}','') || E'\n' || coalesce(p_structured_content #>> '{plan,follow_up}',''),
    diagnostic_tests=coalesce(p_structured_content #> '{objective,diagnostic_tests}','[]'::jsonb),
    diagnoses=coalesce(p_structured_content #> '{assessment,diagnoses}','[]'::jsonb),
    differentials=coalesce(p_structured_content #> '{assessment,differentials}','[]'::jsonb),
    treatment_given=coalesce(p_structured_content #> '{plan,treatment_given}','[]'::jsonb),
    medicines=coalesce(p_structured_content #> '{plan,medications}','[]'::jsonb),
    client_advice=coalesce(p_structured_content #>> '{plan,client_advice}',''),
    follow_up=coalesce(p_structured_content #>> '{plan,follow_up}',''),
    reviewed_by=me.id, reviewed_at=now(), approved_by=me.id, approved_at=now(), version=next_version
  where id=note.id
  returning * into note;

  insert into public.clinical_note_versions(practice_id,clinical_note_id,version_number,content_json,changed_by,change_reason)
  values(me.practice_id,note.id,next_version,p_structured_content,me.id,coalesce(nullif(trim(p_change_reason),''),'Reviewed and approved'));

  update public.consultations set status='approved' where id=p_consultation_id;
  insert into public.audit_logs(practice_id,actor_user_id,entity_type,entity_id,action,after_json)
  values(me.practice_id,me.id,'clinical_note',note.id,'approved',jsonb_build_object('version',next_version,'consultation_id',p_consultation_id));
  return next_version;
end;
$$;
grant execute on function public.approve_clinical_record(uuid,jsonb,text) to authenticated;

-- Approved content cannot be changed while the consultation remains approved.
-- To amend: first move the consultation back to awaiting_review; the previous approved version remains append-only.
create or replace function public.protect_approved_clinical_note()
returns trigger language plpgsql as $$
declare con_status public.consultation_status;
begin
  if old.approved_at is not null and (
    new.structured_content is distinct from old.structured_content or
    new.subjective is distinct from old.subjective or new.objective is distinct from old.objective or
    new.assessment is distinct from old.assessment or new.plan is distinct from old.plan or
    new.diagnostic_tests is distinct from old.diagnostic_tests or new.diagnoses is distinct from old.diagnoses or
    new.differentials is distinct from old.differentials or new.treatment_given is distinct from old.treatment_given or
    new.medicines is distinct from old.medicines or new.client_advice is distinct from old.client_advice or new.follow_up is distinct from old.follow_up
  ) then
    select status into con_status from public.consultations where id=old.consultation_id;
    if con_status='approved' then raise exception 'Start an amendment before changing an approved clinical note'; end if;
    -- An authenticated vet may atomically re-approve through approve_clinical_record.
    if new.approved_by=public.current_profile_id() and new.approved_at is not null and public.current_user_role()='vet' then return new; end if;
    new.approved_by=null; new.approved_at=null;
    new.reviewed_by=public.current_profile_id(); new.reviewed_at=now();
  end if;
  return new;
end; $$;
create trigger clinical_note_protect_approved before update on public.clinical_notes for each row execute function public.protect_approved_clinical_note();
