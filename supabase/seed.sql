-- ============================================================
-- CINQA TRACKER — SEED DATA
-- Run AFTER schema.sql and rls.sql
-- Creates the "ai-influencer" list with sample columns + records
-- ============================================================

-- Insert seed list
insert into lists (id, name, created_by) values
  ('00000000-0000-0000-0000-000000000001', 'ai-influencer', null)
on conflict (id) do nothing;

-- Insert columns
insert into list_columns (id, list_id, name, col_type, config, position) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Name',     'text',     '{}', 0),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Notes',    'text',     '{}', 1),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Assignee', 'user_ref', '{}', 2),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Status',   'status',
    '{"options": [{"label": "Todo", "color": "gray"}, {"label": "In Progress", "color": "yellow"}, {"label": "Done", "color": "green"}, {"label": "Blocked", "color": "red"}]}',
    3),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Script',   'url',      '{}', 4),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Clips',    'url',      '{}', 5)
on conflict (id) do nothing;

-- Insert 3 sample records
insert into list_records (id, list_id, position) values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 0),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 2)
on conflict (id) do nothing;

-- Record 1 values
insert into record_values (record_id, column_id, value) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lenny Rachitsky'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Product newsletter, 500k subscribers'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'In Progress'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'https://docs.google.com/script1')
on conflict (record_id, column_id) do nothing;

-- Record 2 values
insert into record_values (record_id, column_id, value) values
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Andrej Karpathy'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'AI research, ex-Tesla AI Director'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 'Todo'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'https://docs.google.com/script2')
on conflict (record_id, column_id) do nothing;

-- Record 3 values
insert into record_values (record_id, column_id, value) values
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Sam Altman'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'OpenAI CEO, high signal AI posts'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Done'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', 'https://drive.google.com/clips3')
on conflict (record_id, column_id) do nothing;
