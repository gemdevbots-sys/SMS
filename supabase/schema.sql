-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Staffs Table
create table if not exists staffs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table staffs enable row level security;

create policy "Staffs are viewable by authenticated users" on staffs
  for select using (auth.role() = 'authenticated');

create policy "Staffs are insertable by authenticated users" on staffs
  for insert with check (auth.role() = 'authenticated');

create policy "Staffs are updateable by authenticated users" on staffs
  for update using (auth.role() = 'authenticated');

-- 2. Participants Table
create table if not exists participants (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references staffs(id) on delete cascade not null,
  fio text not null,
  phone text not null,
  position text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table participants enable row level security;

create index participants_staff_id_idx on participants(staff_id);

create policy "Participants are viewable by authenticated users" on participants
  for select using (auth.role() = 'authenticated');

create policy "Participants are insertable by authenticated users" on participants
  for insert with check (auth.role() = 'authenticated');

create policy "Participants are updateable by authenticated users" on participants
  for update using (auth.role() = 'authenticated');

create policy "Participants are deletable by authenticated users" on participants
  for delete using (auth.role() = 'authenticated');


-- 3. Message Templates Table
create table if not exists message_templates (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references staffs(id) on delete cascade not null,
  template_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table message_templates enable row level security;

create policy "Templates are viewable by authenticated users" on message_templates
  for select using (auth.role() = 'authenticated');

create policy "Templates are insertable by authenticated users" on message_templates
  for insert with check (auth.role() = 'authenticated');

create policy "Templates are updateable by authenticated users" on message_templates
  for update using (auth.role() = 'authenticated');

create policy "Templates are deletable by authenticated users" on message_templates
  for delete using (auth.role() = 'authenticated');


-- 4. Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references staffs(id) on delete cascade not null,
  participant_id uuid references participants(id) on delete set null,
  message_text text not null,
  status text not null check (status in ('scheduled', 'pending', 'sent', 'delivered', 'failed', 'error')),
  scheduled_time timestamp with time zone,
  sent_at timestamp with time zone,
  error_message text,
  external_id text,
  api_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table notifications enable row level security;

create index notifications_staff_id_idx on notifications(staff_id);
create index notifications_status_idx on notifications(status);
create index notifications_scheduled_time_idx on notifications(scheduled_time);

create policy "Notifications are viewable by authenticated users" on notifications
  for select using (auth.role() = 'authenticated');

create policy "Notifications are insertable by authenticated users" on notifications
  for insert with check (auth.role() = 'authenticated');

create policy "Notifications are updateable by authenticated users" on notifications
  for update using (auth.role() = 'authenticated');


-- 5. Event Logs Table
create table if not exists event_logs (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references staffs(id) on delete cascade,
  participant_id uuid references participants(id) on delete set null,
  notification_id uuid references notifications(id) on delete set null,
  action_type text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table event_logs enable row level security;

create policy "Logs are viewable by authenticated users" on event_logs
  for select using (auth.role() = 'authenticated');

create policy "Logs are insertable by authenticated users" on event_logs
  for insert with check (auth.role() = 'authenticated');
