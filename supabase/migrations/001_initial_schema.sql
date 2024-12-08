-- Create users table (handled by Supabase Auth, we just need to extend it)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create vocabulary documents table
create table if not exists public.vocabulary_docs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  lang text not null,
  user_id uuid references auth.users not null,
  unique(url, user_id)
);

-- Set up RLS for vocabulary_docs
alter table public.vocabulary_docs enable row level security;

create policy "Users can view own vocabulary docs"
  on vocabulary_docs for select
  using ( auth.uid() = user_id );

create policy "Users can create own vocabulary docs"
  on vocabulary_docs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own vocabulary docs"
  on vocabulary_docs for update
  using ( auth.uid() = user_id );

create policy "Users can delete own vocabulary docs"
  on vocabulary_docs for delete
  using ( auth.uid() = user_id );

-- Create vocabulary words table
create table if not exists public.vocabulary (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  word text not null,
  translation text not null,
  notes text,
  url text not null,
  user_id uuid references auth.users not null,
  doc_id uuid references vocabulary_docs(id) on delete cascade not null
);

-- Set up RLS for vocabulary
alter table public.vocabulary enable row level security;

create policy "Users can view own vocabulary"
  on vocabulary for select
  using ( auth.uid() = user_id );

create policy "Users can create own vocabulary"
  on vocabulary for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own vocabulary"
  on vocabulary for update
  using ( auth.uid() = user_id );

create policy "Users can delete own vocabulary"
  on vocabulary for delete
  using ( auth.uid() = user_id );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
