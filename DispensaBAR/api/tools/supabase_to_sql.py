"""
One-off migration: Supabase export -> SQL for the new PostgreSQL database.

1. In the Supabase SQL Editor run the export query (see DEPLOY.md) and download the result as CSV.
2. python supabase_to_sql.py export.csv dispensa-import.sql
3. On the server: docker exec -i dispensa-db psql -U dispensa dispensa < dispensa-import.sql

The output contains password hashes: keep it out of the repository and delete it afterwards.
The script REPLACES the current data (the demo account is kept). Use --dialect sqlite only for local tests.
"""
import argparse
import csv
import json
from datetime import datetime, timezone

parser = argparse.ArgumentParser()
parser.add_argument('export_csv')
parser.add_argument('output_sql')
parser.add_argument('--dialect', choices=['postgres', 'sqlite'], default='postgres')
args = parser.parse_args()
sqlite = args.dialect == 'sqlite'

csv.field_size_limit(10**9)
with open(args.export_csv, encoding='utf-8-sig', newline='') as f:
    rows = list(csv.reader(f))
data = {key: value or [] for key, value in json.loads(rows[1][0]).items()}


# ---- Value formatting ----

def text(value):
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"


def number(value):
    if value is None:
        return 'NULL'
    value = round(float(value), 2)
    return f"'{value}'" if sqlite else str(value)  # EF stores decimals as text in SQLite


def timestamp(value):
    if value is None:
        return 'NULL'
    utc = datetime.fromisoformat(value).astimezone(timezone.utc)
    formatted = utc.strftime('%Y-%m-%d %H:%M:%S.%f')
    return f"'{formatted}'" if sqlite else f"'{formatted}+00'"


def uuid(value):
    if value is None:
        return 'NULL'
    return text(value.upper() if sqlite else value)  # EF stores Guids uppercase in SQLite


def insert(table, columns, values):
    if not values:
        return []
    lines = [f"INSERT INTO {table} ({', '.join(columns)}) VALUES"]
    lines.append(',\n'.join('  (' + ', '.join(v) + ')' for v in values) + ';')
    return lines


now = datetime.now(timezone.utc).isoformat()
sql = ['BEGIN;', '',
       '-- Replace the current data (keep the demo account)',
       'DELETE FROM activity_log;', 'DELETE FROM products;', 'DELETE FROM categories;',
       'DELETE FROM locations;', 'DELETE FROM users WHERE NOT is_demo;', '']

sql += insert('categories', ['id', 'name', 'created_at'],
              [[str(c['id']), text(c['name'].strip()), timestamp(now)] for c in data['categories']])

sql += insert('locations', ['id', 'name', 'created_at'],
              [[str(l['id']), text(l['name'].strip()), timestamp(now)] for l in data['locations']])

sql += insert('products',
              ['id', 'name', 'quantity', 'category_id', 'location_id', 'origin', 'aroma', 'description', 'created_at', 'updated_at'],
              [[str(p['id']), text(p['name'].strip()), number(p['quantity'] or 0),
                str(p['category_id']) if p['category_id'] else 'NULL',
                str(p['location_id']) if p['location_id'] else 'NULL',
                text(p['origin']), text(p['aroma']), text(p['description']),
                timestamp(p['created_at']), timestamp(p['updated_at'] or p['created_at'])]
               for p in data['products']])

# Supabase keeps the profile (name, role) and the password (auth.users) in two tables: merge them
passwords = {u['id']: u['encrypted_password'] for u in data['users']}
users = []
for p in data['profiles']:
    if not passwords.get(p['id']):
        print('Skipped (no password):', p['id'])
        continue
    approved = p['role'] in ('user', 'admin')
    users.append([uuid(p['id']), text(p['email'].strip().lower()), text(passwords[p['id']]),
                  text((p['display_name'] or '').strip() or None), text(p['role']),
                  'FALSE', timestamp(p['created_at']),
                  timestamp(p['updated_at'] or p['created_at']) if approved else 'NULL'])
sql += insert('users', ['id', 'email', 'password_hash', 'display_name', 'role', 'is_demo', 'created_at', 'approved_at'], users)

sql += insert('activity_log',
              ['id', 'user_id', 'user_name', 'product_id', 'product_name', 'action',
               'previous_value', 'new_value', 'details', 'created_at'],
              [[str(a['id']), uuid(a['user_id']), text(a['user_name']),
                str(a['product_id']) if a['product_id'] else 'NULL', text(a['product_name']),
                text(a['action']), number(a['previous_value']), number(a['new_value']),
                text(json.dumps(a['details'])) if a['details'] is not None else 'NULL',
                timestamp(a['created_at'])]
               for a in data['activity_log']])

if not sqlite:
    # The ids were copied from Supabase: move the counters past them, so new rows don't collide
    sql += ['', '-- Continue the id counters after the imported rows']
    for table in ['categories', 'locations', 'products', 'activity_log']:
        sql.append(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), (SELECT COALESCE(MAX(id), 1) FROM {table}));")

sql += ['', 'COMMIT;', '']
with open(args.output_sql, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(sql))

print(f"categories {len(data['categories'])}, locations {len(data['locations'])}, products {len(data['products'])}, "
      f"users {len(users)}, activity {len(data['activity_log'])} -> {args.output_sql}")
