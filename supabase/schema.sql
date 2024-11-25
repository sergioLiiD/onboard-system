-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  phone_number text,
  company_name text,
  role text check (role in ('admin', 'managing_user', 'regular_user', 'invitee')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Workspaces table
create table if not exists workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  company_name text not null,
  owner_id uuid references auth.users not null,
  settings jsonb default '{"language": "en", "timezone": "UTC"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Workspace members junction table
create table if not exists workspace_members (
  workspace_id uuid references workspaces on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('managing_user', 'regular_user')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (workspace_id, user_id)
);

-- Workflows table
create table if not exists workflows (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces on delete cascade,
  name text not null,
  description text,
  is_template boolean default false,
  created_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Steps table
create table if not exists steps (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references workflows on delete cascade,
  title text not null,
  subtitle text,
  content jsonb,
  order_number integer not null,
  documents jsonb[], -- Array of document objects with metadata
  video_urls text[],
  tasks jsonb[], -- Array of task objects
  quiz jsonb,    -- Quiz object with questions and answers
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Workflow assignments table (for invitees)
create table if not exists workflow_assignments (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references workflows on delete cascade,
  invitee_id uuid references auth.users,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  progress jsonb default '{"completed_steps": []}'::jsonb,
  access_code text unique,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Messages table
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  step_id uuid references steps on delete cascade,
  workflow_assignment_id uuid references workflow_assignments on delete cascade,
  sender_id uuid references auth.users,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table workflows enable row level security;
alter table steps enable row level security;
alter table workflow_assignments enable row level security;
alter table messages enable row level security;

-- Create policies
-- Profiles: users can read all profiles but only update their own
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Workspaces: owners and members can view their workspaces
create policy "Workspace access for members"
  on workspaces for select
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from workspace_members
      where workspace_id = id and user_id = auth.uid()
    )
  );

-- More policies will be added as needed for other tables
