// Capture-the-flag challenges. Each module builds its challenge file in the browser with `make()`,
// default-exports the story, and exports `hints`, `Walkthrough` and `Debrief`.
//
// Answers are stored only as hashes (see lib/flags.js). To add a challenge, compute its hash with
//   npx vite-node --root . scripts/challenge-answer.mjs <id> "<answer>"

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', points: 100, tone: 'secret' },
  { id: 'medium', label: 'Medium', points: 200, tone: 'warn' },
  { id: 'hard', label: 'Hard', points: 300, tone: 'danger' },
];

export const CATEGORIES = {
  image: 'Image',
  audio: 'Audio',
  text: 'Text',
  classic: 'Classic',
  detect: 'Detection',
};

const WORD = 'What is the secret word?';

export const CHALLENGES = [
  {
    id: 'postcard',
    title: 'Postcard from the coast',
    category: 'image',
    difficulty: 'easy',
    lesson: 'lsb-substitution',
    teaser: 'A holiday picture with something to say.',
    ask: WORD,
    answer: '6495ab444ee53410ada476b0055e271f69ff58c1b3fecb494bbdc2d42f1a65c4',
    load: () => import('./postcard.jsx'),
  },
  {
    id: 'innocent-letter',
    title: 'The innocent note',
    category: 'classic',
    difficulty: 'easy',
    lesson: 'text-tricks',
    teaser: 'The censor read every word and let it pass. Read it again.',
    ask: 'What does the note really say?',
    answer: 'b95f23df52b257d193733b2f1bf38489a6a2abebeb85c15e059ab43963042db0',
    load: () => import('./innocent-letter.jsx'),
  },
  {
    id: 'between-the-lines',
    title: 'Read between the lines',
    category: 'text',
    difficulty: 'easy',
    lesson: 'invisible-unicode',
    teaser: 'A chat message that is much longer than it looks.',
    ask: WORD,
    answer: 'dcb689d2c5275369bd71ad59a4662f59ec588f44d4eb9e5d573552142de154b3',
    load: () => import('./between-the-lines.jsx'),
  },
  {
    id: 'static-on-the-line',
    title: 'Static on the line',
    category: 'audio',
    difficulty: 'easy',
    lesson: 'audio-lsb',
    teaser: 'A little tune whose quietest bits are talking.',
    ask: WORD,
    answer: '361ed862f5c046a75c8e5805fa89be1c647e45499753582f1a1a2a98e99a5123',
    load: () => import('./static-on-the-line.jsx'),
  },
  {
    id: 'plane-sight',
    title: 'Hidden in plane sight',
    category: 'image',
    difficulty: 'medium',
    lesson: 'bit-planes',
    teaser: 'Not a message in the picture — a picture in the picture.',
    ask: WORD,
    answer: 'f06ad896f6e9c20c645f25c3b87a820f1e7367ad42ae7a78e8faaa57d0f49313',
    load: () => import('./plane-sight.jsx'),
  },
  {
    id: 'seeing-sound',
    title: 'Seeing sound',
    category: 'audio',
    difficulty: 'medium',
    lesson: 'spectrograms',
    teaser: 'Some messages are meant to be seen, not heard.',
    ask: WORD,
    answer: 'daddfc8559bb649aa1b2ac2fab99c584abcfb784302a86d743d4973825bdbde8',
    load: () => import('./seeing-sound.jsx'),
  },
  {
    id: 'two-typefaces',
    title: 'Two typefaces',
    category: 'classic',
    difficulty: 'medium',
    lesson: 'text-tricks',
    teaser: 'Francis Bacon’s 400-year-old trick, in one short sentence.',
    ask: WORD,
    answer: 'b78933cdfc2a74f7c5a5cb0f2dac58c777d057b972d2c99f3f67152f99968d8a',
    load: () => import('./two-typefaces.jsx'),
  },
  {
    id: 'look-alikes',
    title: 'Look-alikes',
    category: 'text',
    difficulty: 'medium',
    lesson: 'text-tricks',
    teaser: 'A dull business email. Some of its letters are not what they seem.',
    ask: WORD,
    answer: '000181df7c8f3f6e3ea73a75e1d29fa7fb73ebf5e3282d9e5c1b3dfaa13811ad',
    load: () => import('./look-alikes.jsx'),
  },
  {
    id: 'historians-key',
    title: 'The historian’s key',
    category: 'image',
    difficulty: 'hard',
    lesson: 'keys-and-scattering',
    teaser: 'An encrypted, scattered message — and a riddle for the password.',
    ask: WORD,
    answer: 'ed32cc6108b680e99f17d48e92c2a892ed5e3a186850b1618c4ff5025464709b',
    load: () => import('./historians-key.jsx'),
  },
  {
    id: 'wardens-inbox',
    title: 'The warden’s inbox',
    category: 'detect',
    difficulty: 'hard',
    lesson: 'steganalysis',
    teaser: 'Four photos. One is carrying something. You can’t read it — can you catch it?',
    ask: 'Which photo carries the hidden file? (A, B, C or D)',
    answer: '3031236bf6b779ca73c133014b9fea8a8eef4da1d0102c36d6160c09e4aebe49',
    load: () => import('./wardens-inbox.jsx'),
  },
];

export const challengeIndex = (id) => CHALLENGES.findIndex((c) => c.id === id);

export const difficultyOf = (challenge) => DIFFICULTIES.find((d) => d.id === challenge.difficulty);

export const pointsFor = (challenge) => difficultyOf(challenge).points;

export const TOTAL_POINTS = CHALLENGES.reduce((sum, c) => sum + pointsFor(c), 0);
