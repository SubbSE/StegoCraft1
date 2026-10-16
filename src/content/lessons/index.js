// The StegoCraft course. Each lesson module default-exports its body and exports a `quiz`.

export const TRACKS = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'What steganography is, and how computers turn text and pictures into bits.',
  },
  {
    id: 'images',
    title: 'Hiding in images',
    description: 'From your first hidden bit to passwords, bit planes and JPEG.',
  },
  {
    id: 'audio',
    title: 'Hiding in sound',
    description: 'Samples, inaudible changes, and pictures drawn with sound.',
  },
  {
    id: 'text',
    title: 'Hiding in text',
    description: 'Centuries-old word tricks and modern invisible characters.',
  },
  {
    id: 'detection',
    title: 'Detection & the real world',
    description: 'How hidden messages get caught — and where steganography is used today.',
  },
];

export const LESSONS = [
  {
    slug: 'what-is-steganography',
    track: 'foundations',
    title: 'What is steganography?',
    minutes: 6,
    summary: 'Encryption hides what a message says. Steganography hides that there is a message at all.',
    load: () => import('./what-is-steganography.jsx'),
  },
  {
    slug: 'bits-and-bytes',
    track: 'foundations',
    title: 'Everything is bits',
    minutes: 6,
    summary: 'How any text, in any language, becomes a row of ones and zeros.',
    load: () => import('./bits-and-bytes.jsx'),
  },
  {
    slug: 'how-images-work',
    track: 'foundations',
    title: 'How computers see pictures',
    minutes: 7,
    summary: 'Pixels, colour channels — and the one bit nobody can see.',
    load: () => import('./how-images-work.jsx'),
  },
  {
    slug: 'lsb-substitution',
    track: 'images',
    title: 'Your first hidden message',
    minutes: 8,
    summary: 'Least-significant-bit substitution, step by step, on a real picture.',
    load: () => import('./lsb-substitution.jsx'),
  },
  {
    slug: 'bit-planes',
    track: 'images',
    title: 'Slicing a picture into bit planes',
    minutes: 6,
    summary: 'See an image one bit at a time — and spot where a message was written.',
    load: () => import('./bit-planes.jsx'),
  },
  {
    slug: 'keys-and-scattering',
    track: 'images',
    title: 'Keys, encryption and scattering',
    minutes: 7,
    summary: 'Use a password to hide where the bits go, and make them look like noise.',
    load: () => import('./keys-and-scattering.jsx'),
  },
  {
    slug: 'jpeg-and-dct',
    track: 'images',
    title: 'Why JPEG breaks it',
    minutes: 9,
    summary: 'Compression, the discrete cosine transform, and hiding inside JPEG itself.',
    load: () => import('./jpeg-and-dct.jsx'),
  },
  {
    slug: 'digital-audio',
    track: 'audio',
    title: 'How computers hear',
    minutes: 6,
    summary: 'Sound as a stream of numbers: samples, sample rates and bit depth.',
    load: () => import('./digital-audio.jsx'),
  },
  {
    slug: 'audio-lsb',
    track: 'audio',
    title: 'Whispering in the noise',
    minutes: 6,
    summary: 'Audio LSB — and listening to exactly what you changed.',
    load: () => import('./audio-lsb.jsx'),
  },
  {
    slug: 'spectrograms',
    track: 'audio',
    title: 'Pictures made of sound',
    minutes: 7,
    summary: 'Spectrograms, hidden images in music, echoes and phase.',
    load: () => import('./spectrograms.jsx'),
  },
  {
    slug: 'text-tricks',
    track: 'text',
    title: 'Classic text tricks',
    minutes: 8,
    summary: 'Null ciphers, Bacon’s two typefaces and letters that are not what they seem.',
    load: () => import('./text-tricks.jsx'),
  },
  {
    slug: 'invisible-unicode',
    track: 'text',
    title: 'Invisible characters',
    minutes: 6,
    summary: 'Zero-width Unicode characters that hide in plain text.',
    load: () => import('./invisible-unicode.jsx'),
  },
  {
    slug: 'steganalysis',
    track: 'detection',
    title: 'Catching hidden messages',
    minutes: 9,
    summary: 'Visual and statistical attacks — the chi-square test, step by step.',
    load: () => import('./steganalysis.jsx'),
  },
  {
    slug: 'real-world',
    track: 'detection',
    title: 'Steganography in the real world',
    minutes: 7,
    summary: 'Watermarks, printer dots, malware — and using all this responsibly.',
    load: () => import('./real-world.jsx'),
  },
];

export const lessonIndex = (slug) => LESSONS.findIndex((l) => l.slug === slug);
export const lessonsInTrack = (trackId) => LESSONS.filter((l) => l.track === trackId);
export const totalMinutes = LESSONS.reduce((n, l) => n + l.minutes, 0);
