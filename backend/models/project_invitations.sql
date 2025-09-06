-- Project Invitations Table
-- This table manages invitations sent to users to join projects
create table project_invitations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  inviter_id uuid references profiles(id) on delete cascade not null,
  invitee_email text not null,
  invitee_id uuid references profiles(id) on delete cascade, -- null if user doesn't exist yet
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  role text default 'member' check (role in ('member', 'manager')),
  invitation_token uuid default gen_random_uuid() unique not null,
  expires_at timestamp default (now() + interval '7 days'),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create indexes for better performance
create index idx_project_invitations_project_id on project_invitations(project_id);
create index idx_project_invitations_invitee_email on project_invitations(invitee_email);
create index idx_project_invitations_token on project_invitations(invitation_token);
create index idx_project_invitations_status on project_invitations(status);

-- Add RLS (Row Level Security) policies
alter table project_invitations enable row level security;

-- Policy: Users can see invitations for projects they're members of or invitations sent to their email
create policy "Users can view relevant invitations" on project_invitations
  for select using (
    invitee_email = auth.jwt() ->> 'email' or
    inviter_id = auth.uid() or
    project_id in (
      select project_id from project_members where user_id = auth.uid()
    )
  );

-- Policy: Only project managers can create invitations
create policy "Project managers can create invitations" on project_invitations
  for insert with check (
    project_id in (
      select p.id from projects p
      left join project_members pm on p.id = pm.project_id
      where (p.project_manager = auth.uid() or (pm.user_id = auth.uid() and pm.role = 'manager'))
    )
  );

-- Policy: Users can update invitations sent to their email or that they created
create policy "Users can update relevant invitations" on project_invitations
  for update using (
    invitee_email = auth.jwt() ->> 'email' or
    inviter_id = auth.uid()
  );
