-- USERS / PROFILES
-- Supabase Auth manages email & password (and Google OAuth if enabled).
-- We'll extend it with profile info.

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null,
  last_name text not null,
  created_at timestamp default now()
);

-- PROJECTS
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

-- PROJECT MEMBERS
create table project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member', -- e.g., 'member', 'manager'
  primary key (project_id, user_id)
);

-- TASKS
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  assignee uuid references profiles(id), -- single selection
  tags text[], -- array of tags
  deadline date,
  image text, -- URL (Supabase storage)
  description text,
  status text default 'To-Do' check (status in ('To-Do','In Progress','Done')),
  created_at timestamp default now()
);
