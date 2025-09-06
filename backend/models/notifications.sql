-- NOTIFICATIONS
-- Notifications for project updates, task assignments, etc.
-- Drop the existing table if it exists
DROP TABLE IF EXISTS notifications;

-- Create the corrected notifications table
CREATE TABLE notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade, -- Fixed: tasks not task
  type text not null check (type in (
    'task_assigned', 
    'task_updated', 
    'task_status_changed',
    'project_invited', 
    'project_updated',
    'deadline_reminder'
  )),
  message text not null,
  is_read boolean default false,
  created_at timestamp default now()
);

-- Add indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);