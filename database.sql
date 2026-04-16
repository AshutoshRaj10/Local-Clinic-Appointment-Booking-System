create table public.doctors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  timing text not null,
  rating integer not null,
  avatar text not null
);

create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid references public.doctors(id) not null,
  time_slot text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.doctors (name, specialty, timing, rating, avatar) values
  ('Dr. Shankar', 'Dentist', '09:00 AM - 04:00 PM', 5, '👨‍⚕️'),
  ('Dr. Ashutosh Raj', 'Surgeon', '10:00 AM - 06:00 PM', 5, '👨‍⚕️'),
  ('Dr. Raj Patel', 'General Physician', '08:00 AM - 08:00 PM', 4, '👨‍⚕️');
