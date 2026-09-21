-- Fictional demo tenant. No passwords are seeded.
insert into public.practices (id,name,slug,subdomain,address_line_1,city,postcode,phone,email)
values ('00000000-0000-0000-0000-000000000001','Oakwood Veterinary Practice','oakwood-veterinary-practice','oakwood','18 Willow Lane','Manchester','M20 4AB','0161 555 0148','hello@oakwood-vet.example')
on conflict do nothing;

insert into public.profiles (id,auth_user_id,practice_id,first_name,last_name,email,role,is_active) values
('00000000-0000-0000-0000-000000000101',null,'00000000-0000-0000-0000-000000000001','Emily','Carter','emily.carter@oakwood-vet.example','vet',true),
('00000000-0000-0000-0000-000000000102',null,'00000000-0000-0000-0000-000000000001','Daniel','Reed','daniel.reed@oakwood-vet.example','vet',true),
('00000000-0000-0000-0000-000000000103',null,'00000000-0000-0000-0000-000000000001','Sophie','Morgan','sophie.morgan@oakwood-vet.example','nurse',true),
('00000000-0000-0000-0000-000000000104',null,'00000000-0000-0000-0000-000000000001','James','Wilson','james.wilson@oakwood-vet.example','practice_manager',true)
on conflict do nothing;

insert into public.clients (id,practice_id,first_name,last_name,address_line_1,city,postcode,phone,email) values
('00000000-0000-0000-0000-000000000201','00000000-0000-0000-0000-000000000001','Sarah','Williams','12 Meadow Close','Manchester','M20 3AB','0161 555 0111','sarah.williams@example.com'),
('00000000-0000-0000-0000-000000000202','00000000-0000-0000-0000-000000000001','James','Wilson','8 Park View','Manchester','M21 2CD','0161 555 0222','james.wilson@example.com'),
('00000000-0000-0000-0000-000000000203','00000000-0000-0000-0000-000000000001','Olivia','Brown','45 Oak Street','Manchester','M19 1EF','0161 555 0333','olivia.brown@example.com')
on conflict do nothing;

insert into public.patients (id,practice_id,client_id,name,species,breed,sex,neutered,date_of_birth,microchip_number,colour,weight_kg) values
('00000000-0000-0000-0000-000000000301','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000201','Max','Dog','Labrador Retriever','Male',true,'2020-06-14','985141000000001','Black',28.4),
('00000000-0000-0000-0000-000000000302','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000202','Luna','Cat','British Shorthair','Female',true,'2019-11-02','985141000000002','Blue',4.8),
('00000000-0000-0000-0000-000000000303','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000203','Bella','Dog','Cocker Spaniel','Female',true,'2021-03-21','985141000000003','Golden',12.7)
on conflict do nothing;

insert into public.practice_settings (practice_id,retention_period_years) values ('00000000-0000-0000-0000-000000000001',5) on conflict do nothing;
