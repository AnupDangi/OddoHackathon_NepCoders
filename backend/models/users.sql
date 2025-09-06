create table profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null,
  last_name text not null,
  avatar_url text, -- optional (profile picture)
  created_at timestamp default now()
);
