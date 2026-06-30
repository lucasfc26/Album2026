-- Álbum Copa 2026 — FCW (0-20), países (1-20), Coca-Cola (1-14)
-- Execute no SQL Editor do Supabase (apaga dados anteriores)

drop table if exists stickers cascade;

create table stickers (
  id bigint generated always as identity primary key,
  section_type text not null check (section_type in ('fcw', 'pais', 'cocacola')),
  section text not null,
  number integer not null,
  owned boolean not null default false,
  created_at timestamptz not null default now(),
  unique (section, number)
);

create index stickers_section_type_idx on stickers (section_type);
create index stickers_section_idx on stickers (section);
create index stickers_owned_idx on stickers (owned);

alter table stickers enable row level security;

create policy "Permitir leitura pública"
  on stickers for select
  using (true);

create policy "Permitir atualização pública"
  on stickers for update
  using (true)
  with check (true);

-- Depois de executar este arquivo, execute também supabase/seed.sql
