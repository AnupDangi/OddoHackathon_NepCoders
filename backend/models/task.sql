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