import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';

type Client = ReturnType<typeof createClient>;

let db: Client | null = null;

export async function getDb(): Promise<Client> {
  if (db) return db;
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  
  try {
    const client = createClient({
      url: 'file:' + dbPath
    });
    
    // Quick sanity check to detect corrupt disk image
    await client.execute('PRAGMA foreign_keys = ON;');
    await client.execute('SELECT 1;');
    
    await initializeDb(client);
    db = client;
    return db;
  } catch (err: any) {
    console.error('Database connection or integrity error, attempting auto-repair:', err?.message);
    
    // Auto-repair: If disk image is malformed / corrupt, rebuild cleanly
    if (err?.code === 'SQLITE_CORRUPT' || err?.message?.includes('malformed') || err?.message?.includes('corrupt')) {
      try {
        if (fs.existsSync(dbPath)) {
          const backupPath = path.join(process.cwd(), `database.sqlite.corrupt.${Date.now()}`);
          fs.renameSync(dbPath, backupPath);
          console.warn(`Corrupted database moved to ${backupPath}`);
        }
        
        // Also remove any auxiliary WAL/SHM files
        if (fs.existsSync(dbPath + '-wal')) fs.unlinkSync(dbPath + '-wal');
        if (fs.existsSync(dbPath + '-shm')) fs.unlinkSync(dbPath + '-shm');
        
        const freshClient = createClient({
          url: 'file:' + dbPath
        });
        await freshClient.execute('PRAGMA foreign_keys = ON;');
        await initializeDb(freshClient);
        db = freshClient;
        console.log('Database cleanly restored and initialized.');
        return db;
      } catch (repairErr) {
        console.error('Database self-healing failed:', repairErr);
        throw repairErr;
      }
    }
    
    throw err;
  }
}

const EVENTS_SEED = [
  // MUSIC EVENTS (3)
  {
    id: 'evt_mus_01', name: 'Indian Folk and Film Singing (Solo)', category: 'music', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Solo Indian folk and film singing competition.',
    rules: JSON.stringify(["Time limit: 4+1 mins", "Only 1 accompanist allowed", "Accompanists can use Piano in Grand piano mode, acoustic guitar, tabla, or mridangam", "Karaoke track allowed (no backing vocals)", "No sequenced beats/samples"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_mus_02', name: 'Western Singing (Solo)', category: 'music', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Solo Western singing competition.',
    rules: JSON.stringify(["Time limit: 4+1 mins", "Best Original Composition will be awarded", "Only 1 accompanist allowed", "Use grand piano tone, acoustic guitar, djembe, or cajon", "No sequenced beats/samples"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_mus_03', name: 'Battle of Bands (Indian)', category: 'music', type: 'group',
    min_team_size: 5, max_team_size: 10,
    description: 'Indian band competition.',
    rules: JSON.stringify(["Time limit: 10+2 mins (including setup)", "Indian languages only", "Minimum 1 Indian melodic or percussion instrument", "No growling", "No pre-recorded music/sequenced samples"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },

  // THEATRE EVENTS (4)
  {
    id: 'evt_the_01', name: 'Mono Acting', category: 'theatre', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Self-directed mono-act or monologue performance.',
    rules: JSON.stringify(["Time limit: 3+1 mins", "English only (10% regional language allowed)", "Basic props and costumes encouraged", "No fire or water allowed", "No vulgarity or political mockery"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_the_02', name: 'Street Play', category: 'theatre', type: 'group',
    min_team_size: 15, max_team_size: 25,
    description: 'Thematic street play competition.',
    rules: JSON.stringify(["Time limit: 8+2 mins", "English Thematic", "Jingles in min 4 Indian languages (max 25% for any one language)", "Max height formation: 10ft", "No lifts involving male & female", "No loudspeakers or dry colors"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_the_03', name: 'Proscenium', category: 'theatre', type: 'group',
    min_team_size: 8, max_team_size: 25,
    description: 'Stage play production.',
    rules: JSON.stringify(["Time limit: 20+5 mins", "English/Hindi/Kannada", "Min 6 actors required", "No powdered colors or liquid paints", "No fire or water on stage"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_the_04', name: 'Mime', category: 'theatre', type: 'group',
    min_team_size: 6, max_team_size: 10,
    description: 'Silent acting using traditional mime elements.',
    rules: JSON.stringify(["Time limit: 7+1 mins", "No props", "No narration", "Recorded/Live SFX allowed", "No vulgarity in costumes"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },

  // DANCE EVENTS (3)
  {
    id: 'evt_dan_01', name: 'Dance Duet', category: 'dance', type: 'group',
    min_team_size: 2, max_team_size: 2,
    description: 'Duet dance performance on Indian film songs.',
    rules: JSON.stringify(["Time limit: 2+1 mins", "Only Indian film songs allowed", "Max 2 songs mixed", "No Western dance forms", "No fire or water on stage"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_dan_02', name: 'Indian Dance Group: Non Theme (Film/Folk)', category: 'dance', type: 'group',
    min_team_size: 8, max_team_size: 15,
    description: 'Group dance to Indian film or folk music.',
    rules: JSON.stringify(["Time limit: 5+1 mins", "No fusion of songs", "Indian Films only (No remixes or albums)", "Only Indian Dance Forms (inc. Bollywood/Contemporary)", "Minimum props allowed"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_dan_03', name: 'Indian Classical Dance (Group)', category: 'dance', type: 'group',
    min_team_size: 4, max_team_size: 4,
    description: 'Group classical Indian dance.',
    rules: JSON.stringify(["Time limit: 6+1 mins", "Authentic Indian Classical Song (No movies)", "No live music", "Authentic costumes, hairstyle, and jewelry required"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },

  // ART EVENTS (3)
  {
    id: 'evt_art_01', name: 'Photography', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'DSLR photography competition.',
    rules: JSON.stringify(["Themes announced 2 days prior", "JPEG format only", "Submit 2 photos", "Basic editing (cropping/color correction) allowed", "Only DSLR photos allowed"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'submission'
  },
  {
    id: 'evt_art_03', name: 'Painting', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'On-the-spot painting competition.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on the spot", "Any kind of paint allowed", "Original work only"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_art_04', name: 'Pencil Sketching', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Pencil and charcoal sketching on a given prompt.',
    rules: JSON.stringify(["Time limit: 2 hours", "Pencils, charcoal, and erasers only", "No color media allowed", "Sketching paper provided"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },

  // LITERARY EVENTS (4)
  {
    id: 'evt_lit_01', name: 'Debate', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Non-parliamentary individual debate.',
    rules: JSON.stringify(["Speaking/Rebuttal time: 4 mins + 1 min", "Topics announced a day before", "Must prepare for both against/for the motion", "Usage of notes at judge\'s discretion"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_lit_02', name: 'Extempore', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Impromptu speaking competition.',
    rules: JSON.stringify(["Topic given on the spot", "1 minute prep time", "No writing allowed", "Judged on content, fluency, relevance, style, and humor"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_lit_05', name: 'Creative Writing', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Writing competition for poetry, essay, and short story.',
    rules: JSON.stringify(["English only", "Poetry: 1 hour, 4 stanzas x 4 lines", "Essay: 1 hour, 1000-1500 words", "Short Story: 30 mins, 500-750 words (picture prompt)"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_lit_08', name: 'Quiz', category: 'literary', type: 'group',
    min_team_size: 3, max_team_size: 3,
    description: 'General quiz competition.',
    rules: JSON.stringify(["No mobile or electronic instruments allowed", "Multiple choice, true/false, specific answers", "No participant replacement after registration"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  }
];

async function initializeDb(database: Client) {
  await database.executeMultiple(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      min_team_size INTEGER,
      max_team_size INTEGER,
      description TEXT NOT NULL,
      rules TEXT NOT NULL,
      date TEXT NOT NULL,
      time_start TEXT NOT NULL,
      time_end TEXT NOT NULL,
      venue_or_platform TEXT NOT NULL,
      submission_type TEXT NOT NULL,
      specific_fields TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firebase_uid TEXT UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      institute TEXT NOT NULL,
      roll_number TEXT,
      department TEXT,
      email_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      team_members TEXT,
      event_specific_data TEXT,
      status TEXT NOT NULL DEFAULT 'registered',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(event_id) REFERENCES events(id),
      UNIQUE(user_id, event_id)
    );
  `);

  // Safe column migration for existing databases
  try {
    await database.execute("ALTER TABLE users ADD COLUMN firebase_uid TEXT;");
  } catch (_e) {}

  try {
    await database.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);");
  } catch (_e) {}

  try {
    await database.execute("ALTER TABLE users ADD COLUMN roll_number TEXT;");
  } catch (_e) {}

  try {
    await database.execute("ALTER TABLE users ADD COLUMN department TEXT;");
  } catch (_e) {}

  try {
    await database.execute("ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;");
  } catch (_e) {}

  // Sync events: Upsert the active seed events
  for (const ev of EVENTS_SEED) {
    await database.execute({
      sql: `
        INSERT INTO events (id, name, category, type, min_team_size, max_team_size, description, rules, date, time_start, time_end, venue_or_platform, submission_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          category=excluded.category,
          type=excluded.type,
          min_team_size=excluded.min_team_size,
          max_team_size=excluded.max_team_size,
          description=excluded.description,
          rules=excluded.rules,
          date=excluded.date,
          time_start=excluded.time_start,
          time_end=excluded.time_end,
          venue_or_platform=excluded.venue_or_platform,
          submission_type=excluded.submission_type
      `,
      args: [
        ev.id, ev.name, ev.category, ev.type, ev.min_team_size, ev.max_team_size,
        ev.description, ev.rules, ev.date, ev.time_start, ev.time_end,
        ev.venue_or_platform, ev.submission_type
      ]
    });
  }

  // Remove any obsolete/discarded events that are no longer part of the seed list
  const validIds = EVENTS_SEED.map(e => e.id);
  const placeholders = validIds.map(() => '?').join(',');
  await database.execute({
    sql: `DELETE FROM events WHERE id NOT IN (${placeholders})`,
    args: validIds
  });

  // Ensure default student profile exists if table is empty
  try {
    await database.execute({
      sql: `
        INSERT OR IGNORE INTO users (id, full_name, email, phone, institute, roll_number, department, email_verified)
        VALUES ('5298aa0f-7b51-42b8-99d5-d549ec87e6a8', 'hariharan', 'r.hariharan@bcomafh.christuniversity.in', '7892774909', 'Christ University', '2511148', '3 BCOM AFA', 0)
      `
    });
  } catch (_e) {}
}

