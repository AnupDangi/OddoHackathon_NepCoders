create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tags text[], -- array of tags
  project_manager uuid references profiles(id) not null,
  deadline date,
  priority text check (priority in ('Low','Medium','High')),
  image text, -- store URL from Supabase Storage
  description text,
  created_at timestamp default now()
);