const fs = require('fs');
const path = require('path');

const newSeed = `
const EVENTS_SEED = [
  // MUSIC EVENTS
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
  {
    id: 'evt_mus_04', name: 'Battle of the Bands (Western)', category: 'music', type: 'group',
    min_team_size: 5, max_team_size: 10,
    description: 'Western band competition.',
    rules: JSON.stringify(["Time limit: 10+2 mins (including setup)", "Standard 5-piece Drum kit provided", "Max 3 vocalists", "No growling", "No backing tracks, samples, or sequences"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_mus_05', name: 'Acoustic Music Group (Western)', category: 'music', type: 'group',
    min_team_size: 5, max_team_size: 10,
    description: 'Acoustic western music group competition.',
    rules: JSON.stringify(["Time limit: 10+2 mins", "Only acoustic melodic and/or percussion instruments", "No backing tracks, samples, or sequences"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },

  // THEATRE EVENTS
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
  {
    id: 'evt_the_05', name: 'Short Film Making', category: 'theatre', type: 'group',
    min_team_size: 5, max_team_size: 15,
    description: 'Mobile phone short film competition.',
    rules: JSON.stringify(["Duration: 6-8 mins", "Mobile phone shot films only", "English only (10-15% regional allowed with subtitles)", "Must include specific props/phrases from guidelines", "No depiction of alcohol/smoking"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'submission'
  },

  // DANCE EVENTS
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

  // ART EVENTS
  {
    id: 'evt_art_01', name: 'Photography', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'DSLR photography competition.',
    rules: JSON.stringify(["Themes announced 2 days prior", "JPEG format only", "Submit 2 photos", "Basic editing (cropping/color correction) allowed", "Only DSLR photos allowed"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'submission'
  },
  {
    id: 'evt_art_02', name: 'Greeting Card Making', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'On-the-spot greeting card design.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on the spot", "White cardboard sheets provided", "Participants bring own stationery"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
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
  {
    id: 'evt_art_05', name: 'Reel Making', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Short-form vertical video creation.',
    rules: JSON.stringify(["Duration: 60-90 seconds", "Topic given 1 day prior", "Mobile phones only", "Basic editing and voiceovers allowed", "Shoots must be inside campus, no VFX or stock footage"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'submission'
  },
  {
    id: 'evt_art_06', name: 'Collage Making', category: 'art', type: 'group',
    min_team_size: 4, max_team_size: 4,
    description: 'Team collage making.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on spot", "No mobile or internet allowed", "Chart papers provided", "No scissors or precut pieces allowed"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_art_07', name: 'Pot Art', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Creative pot decoration.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on the spot", "No glitter, mirrors, Plaster of Paris, chisels, or sharp tools allowed"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_art_08', name: 'Mehendi Design', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Creative mehendi art.',
    rules: JSON.stringify(["Time limit: 2 hours", "Participant brings Subject/Model", "Design on one hand till the elbow", "Must cover both sides of the palm"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_art_09', name: 'Rangoli Design', category: 'art', type: 'group',
    min_team_size: 4, max_team_size: 4,
    description: 'Team rangoli making.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on spot", "Natural/traditional Rangoli colors only (no synthetic)", "No pre-drawn outlines, stencils, or adhesives"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_art_10', name: 'Digital Poster Making', category: 'art', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Digital poster design competition.',
    rules: JSON.stringify(["Time limit: 2 hours", "Theme given on spot", "A4 size (Portrait format)", "Any editing software allowed, but NO AI tools", "Must submit working file and original file"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'submission'
  },

  // LITERARY EVENTS
  {
    id: 'evt_lit_01', name: 'Debate', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Non-parliamentary individual debate.',
    rules: JSON.stringify(["Speaking/Rebuttal time: 4 mins + 1 min", "Topics announced a day before", "Must prepare for both against/for the motion", "Usage of notes at judge\\'s discretion"]),
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
    id: 'evt_lit_03', name: 'Dumb Charades', category: 'literary', type: 'group',
    min_team_size: 3, max_team_size: 3,
    description: 'Classic acting and guessing game.',
    rules: JSON.stringify(["1 guesser, 2 actors", "No spelling, rhyming, splitting, or codes", "Prompts can be movies, characters, songs, phrases, etc."]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_lit_04', name: 'Air Crash', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Convince the captain you deserve the last lifejacket.',
    rules: JSON.stringify(["Assigned character at random", "1 minute prep time", "No writing allowed", "1 minute to present case + 1 minute Q&A from captain"]),
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
    id: 'evt_lit_06', name: 'Pot Pourri', category: 'literary', type: 'group',
    min_team_size: 3, max_team_size: 3,
    description: 'A mix of various literary activities.',
    rules: JSON.stringify(["Multiple rounds focusing on different activities (quizzes, spellbee, crosswords, heads up, etc)", "Points cumulative or based on elimination"]),
    date: 'TBA', time_start: 'TBA', time_end: 'TBA', venue_or_platform: 'TBA', submission_type: 'live'
  },
  {
    id: 'evt_lit_07', name: 'Just A Minute (JAM)', category: 'literary', type: 'individual',
    min_team_size: null, max_team_size: null,
    description: 'Speak for 60 seconds without hesitation, repetition, or deviation.',
    rules: JSON.stringify(["Topic given on the spot", "Panel can refute and object", "Standard JAM rules apply", "Multiple elimination rounds"]),
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
`;

let dbContent = fs.readFileSync(path.join(__dirname, 'src/db.ts'), 'utf8');
const oldSeedRegex = /const EVENTS_SEED = \[[\s\S]*?\];/;
dbContent = dbContent.replace(oldSeedRegex, newSeed.trim());
fs.writeFileSync(path.join(__dirname, 'src/db.ts'), dbContent);
