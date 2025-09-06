create table project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member', -- e.g., 'member', 'manager'
  primary key (project_id, user_id)
);