from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = '/data/zomba.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ── seed the database on first run ──────────────────────────
def init_db():
    if os.path.exists(DB_PATH):
        return  # already seeded

    conn = get_db()
    c = conn.cursor()

    # Schools table
    c.execute('''
        CREATE TABLE IF NOT EXISTS schools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, ward TEXT,
            lat REAL, lng REAL,
            enrollment INTEGER, teachers INTEGER, type TEXT
        )
    ''')

    # Health facilities table
    c.execute('''
        CREATE TABLE IF NOT EXISTS health_facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, ward TEXT,
            lat REAL, lng REAL,
            type TEXT, beds INTEGER, monthly_visits INTEGER
        )
    ''')

    # Population table
    c.execute('''
        CREATE TABLE IF NOT EXISTS population (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ward TEXT, population INTEGER,
            area_km2 REAL, households INTEGER,
            under5 INTEGER, school_age INTEGER, adults INTEGER
        )
    ''')

    # ── seed data ───────────────────────────────────────────
    schools = [
        ('Zomba Primary School',       'Zomba Central', -15.3833, 35.3167, 850, 18, 'Primary'),
        ('Naisi Primary School',        'Naisi',         -15.4012, 35.2890, 620, 14, 'Primary'),
        ('Domasi Secondary School',     'Domasi',        -15.2741, 35.4123, 430, 22, 'Secondary'),
        ('Likangala Primary School',    'Likangala',     -15.3560, 35.2650, 710, 16, 'Primary'),
        ('Malemia Primary School',      'Malemia',       -15.4234, 35.3456, 540, 12, 'Primary'),
        ('Mpemba Primary School',       'Mpemba',        -15.4567, 35.2345, 390,  9, 'Primary'),
        ('Chikanda Secondary School',   'Chikanda',      -15.3100, 35.3890, 280, 18, 'Secondary'),
        ('Machinjiri Primary School',   'Machinjiri',    -15.3678, 35.2123, 960, 21, 'Primary'),
        ('Songani Primary School',      'Songani',       -15.4890, 35.3210, 470, 11, 'Primary'),
        ('Thondwe Secondary School',    'Thondwe',       -15.3234, 35.4560, 380, 20, 'Secondary'),
        ('Chingwe Primary School',      'Chingwe',       -15.2980, 35.2780, 510, 13, 'Primary'),
        ('Chiradzulu Road Primary',     'Zomba Central', -15.3750, 35.3300, 720, 17, 'Primary'),
    ]

    health_facilities = [
        ('Zomba Central Hospital',    'Zomba Central', -15.3850, 35.3200, 'Hospital',      400,  3200),
        ('Naisi Health Centre',        'Naisi',         -15.4020, 35.2900, 'Health Centre',  20,   480),
        ('Domasi Community Hospital',  'Domasi',        -15.2750, 35.4130, 'Hospital',        80,   920),
        ('Likangala Health Post',      'Likangala',     -15.3570, 35.2660, 'Health Post',      0,   210),
        ('Malemia Dispensary',         'Malemia',       -15.4240, 35.3460, 'Dispensary',       5,   180),
        ('Mpemba Health Centre',       'Mpemba',        -15.4570, 35.2350, 'Health Centre',   15,   340),
        ('Songani Dispensary',         'Songani',       -15.4890, 35.3220, 'Dispensary',       4,   150),
        ('Thondwe Health Centre',      'Thondwe',       -15.3240, 35.4570, 'Health Centre',   18,   390),
        ('Machinjiri Health Post',     'Machinjiri',    -15.3680, 35.2130, 'Health Post',      0,   175),
        ('Chikanda Dispensary',        'Chikanda',      -15.3110, 35.3900, 'Dispensary',       6,   200),
    ]

    population = [
        ('Zomba Central', 45200, 12.4, 9040, 4520, 8136, 32544),
        ('Naisi',         28400, 34.7, 5680, 2840, 5112, 20448),
        ('Domasi',        31200, 28.9, 6240, 3120, 5616, 22464),
        ('Likangala',     19800, 41.2, 3960, 1980, 3564, 14256),
        ('Malemia',       22100, 38.6, 4420, 2210, 3978, 15912),
        ('Mpemba',        17600, 52.3, 3520, 1760, 3168, 12672),
        ('Chikanda',      24300, 29.8, 4860, 2430, 4374, 17496),
        ('Machinjiri',    33800, 22.1, 6760, 3380, 6084, 24336),
        ('Songani',       15400, 44.1, 3080, 1540, 2772, 11088),
        ('Thondwe',       21600, 31.5, 4320, 2160, 3888, 15552),
        ('Chingwe',       18900, 37.8, 3780, 1890, 3402, 13608),
    ]

    c.executemany('INSERT INTO schools (name,ward,lat,lng,enrollment,teachers,type) VALUES (?,?,?,?,?,?,?)', schools)
    c.executemany('INSERT INTO health_facilities (name,ward,lat,lng,type,beds,monthly_visits) VALUES (?,?,?,?,?,?,?)', health_facilities)
    c.executemany('INSERT INTO population (ward,population,area_km2,households,under5,school_age,adults) VALUES (?,?,?,?,?,?,?)', population)

    conn.commit()
    conn.close()
    print('✅ Database seeded successfully')


# ── API routes ───────────────────────────────────────────────

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Zomba Dashboard API running'})

@app.route('/api/schools')
def get_schools():
    conn = get_db()
    rows = conn.execute('SELECT * FROM schools').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/health-facilities')
def get_health_facilities():
    conn = get_db()
    rows = conn.execute('SELECT * FROM health_facilities').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/population')
def get_population():
    conn = get_db()
    rows = conn.execute('SELECT * FROM population').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/summary')
def get_summary():
    conn = get_db()
    total_pop    = conn.execute('SELECT SUM(population) as t FROM population').fetchone()['t']
    total_schools = conn.execute('SELECT COUNT(*) as t FROM schools').fetchone()['t']
    total_health  = conn.execute('SELECT COUNT(*) as t FROM health_facilities').fetchone()['t']
    total_enroll  = conn.execute('SELECT SUM(enrollment) as t FROM schools').fetchone()['t']
    wards         = conn.execute('SELECT COUNT(*) as t FROM population').fetchone()['t']
    conn.close()
    return jsonify({
        'total_population':  total_pop,
        'total_schools':     total_schools,
        'total_health_facilities': total_health,
        'total_enrollment':  total_enroll,
        'total_wards':       wards
    })

@app.route('/api/ward/<ward_name>')
def get_ward_summary(ward_name):
    conn = get_db()
    schools = conn.execute(
        'SELECT * FROM schools WHERE ward = ?', (ward_name,)
    ).fetchall()
    facilities = conn.execute(
        'SELECT * FROM health_facilities WHERE ward = ?', (ward_name,)
    ).fetchone()
    pop = conn.execute(
        'SELECT * FROM population WHERE ward = ?', (ward_name,)
    ).fetchone()
    conn.close()
    return jsonify({
        'ward': ward_name,
        'population': dict(pop) if pop else {},
        'schools': [dict(s) for s in schools],
        'health_facility': dict(facilities) if facilities else {},
    })

@app.route('/api/wards')
def get_wards():
    conn = get_db()
    rows = conn.execute('SELECT DISTINCT ward FROM population ORDER BY ward').fetchall()
    conn.close()
    return jsonify([r['ward'] for r in rows])

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)