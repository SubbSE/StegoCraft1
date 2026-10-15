import { Link } from 'react-router-dom';
import { Code, Heart, Languages, Scale, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { REPO_URL } from '../config/site';
import { Card, PageHeader } from '../components/ui/display';
import { buttonClass } from '../components/ui/buttonClass';
import { GitHubIcon, LinkedInIcon } from '../components/layout/Logo';

const TEAM = [
  { name: 'Sayan Basak', role: 'Lead Developer', bio: 'Brought the first StegoCraft website to life.', tone: 'bg-accent/15 text-accent' },
  {
    name: 'Subir Ghosh',
    role: 'Cryptography Specialist',
    bio: 'The mind behind StegoCraft’s hiding techniques.',
    linkedin: 'https://www.linkedin.com/in/subir-ghosh-299348263/',
    tone: 'bg-secret/15 text-secret',
  },
  { name: 'Sriparna Biswas', role: 'UI/UX Designer', bio: 'Turns ideas into clean, intuitive interfaces.', tone: 'bg-warn/15 text-warn' },
  { name: 'Ankan Jash', role: 'Backend Architect', bio: 'Designs systems that stay robust as they grow.', tone: 'bg-danger/15 text-danger' },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'There are no accounts, no analytics and no uploads. Your progress is saved only in your own browser.',
  },
  {
    icon: Languages,
    title: 'For every language',
    text: 'Text is handled as Unicode throughout, so a secret in Bengali, Arabic or Japanese works exactly like one in English.',
  },
  {
    icon: Scale,
    title: 'Honest about limits',
    text: 'Every lesson says what breaks a technique and how it gets detected. Knowing the weaknesses is part of understanding it.',
  },
  {
    icon: Code,
    title: 'Open source',
    text: 'All the code is public. You can read exactly how every tool works, report problems and suggest improvements.',
  },
];

const REFERENCES = [
  {
    group: 'History',
    items: [
      <>Herodotus, <em>The Histories</em>, Books 5 and 7 (c. 430 BCE).</>,
      <>David Kahn, <em>The Codebreakers: The Story of Secret Writing</em>. Macmillan, 1967; revised edition Scribner, 1996.</>,
      <>Simon Singh, <em>The Code Book</em>. Fourth Estate, 1999.</>,
      <>
        Gustavus J. Simmons, “The Prisoners’ Problem and the Subliminal Channel”. <em>Advances in Cryptology: Proceedings of
        Crypto ’83</em>, Plenum Press, 1984.
      </>,
    ],
  },
  {
    group: 'Surveys and foundations',
    items: [
      <>
        Fabien A. P. Petitcolas, Ross J. Anderson and Markus G. Kuhn, “Information Hiding — A Survey”. <em>Proceedings of the
        IEEE</em> 87(7), 1999.
      </>,
      <>
        Ross J. Anderson and Fabien A. P. Petitcolas, “On the Limits of Steganography”. <em>IEEE Journal on Selected Areas in
        Communications</em> 16(4), 1998.
      </>,
      <>
        Neil F. Johnson and Sushil Jajodia, “Exploring Steganography: Seeing the Unseen”. <em>IEEE Computer</em> 31(2), 1998.
      </>,
      <>
        Walter Bender, Daniel Gruhl, Norishige Morimoto and Anthony Lu, “Techniques for Data Hiding”. <em>IBM Systems
        Journal</em> 35(3–4), 1996.
      </>,
      <>
        Daniel Gruhl, Anthony Lu and Walter Bender, “Echo Hiding”. <em>Information Hiding</em> (first international
        workshop), Springer LNCS 1174, 1996.
      </>,
    ],
  },
  {
    group: 'Steganalysis',
    items: [
      <>
        Andreas Westfeld and Andreas Pfitzmann, “Attacks on Steganographic Systems”. <em>Information Hiding 1999</em>, Springer
        LNCS 1768, 2000.
      </>,
      <>
        Jessica Fridrich, Miroslav Goljan and Rui Du, “Reliable Detection of LSB Steganography in Color and Grayscale
        Images”. <em>ACM Workshop on Multimedia and Security</em>, 2001.
      </>,
      <>
        Sorina Dumitrescu, Xiaolin Wu and Zhe Wang, “Detection of LSB Steganography via Sample Pair Analysis”. <em>IEEE
        Transactions on Signal Processing</em> 51(7), 2003.
      </>,
      <>
        Tomáš Pevný, Tomáš Filler and Patrick Bas, “Using High-Dimensional Image Models to Perform Highly Undetectable
        Steganography”. <em>Information Hiding 2010</em>, Springer LNCS 6387, 2010.
      </>,
      <>
        Vojtěch Holub, Jessica Fridrich and Tomáš Denemark, “Universal Distortion Function for Steganography in an Arbitrary
        Domain”. <em>EURASIP Journal on Information Security</em>, 2014.
      </>,
    ],
  },
  {
    group: 'Books',
    items: [
      <>
        Jessica Fridrich, <em>Steganography in Digital Media: Principles, Algorithms, and Applications</em>. Cambridge
        University Press, 2009.
      </>,
      <>
        Ingemar J. Cox, Matthew L. Miller, Jeffrey A. Bloom, Jessica Fridrich and Ton Kalker, <em>Digital Watermarking and
        Steganography</em>, 2nd edition. Morgan Kaufmann, 2008.
      </>,
      <>
        Stefan Katzenbeisser and Fabien A. P. Petitcolas (eds.), <em>Information Hiding Techniques for Steganography and
        Digital Watermarking</em>. Artech House, 2000.
      </>,
    ],
  },
  {
    group: 'Standards and reports',
    items: [
      <>
        Unicode Consortium, <a href="https://www.unicode.org/reports/tr36/">Unicode Technical Report #36: Unicode Security
        Considerations</a> and <a href="https://www.unicode.org/reports/tr39/">Unicode Technical Standard #39: Unicode Security
        Mechanisms</a> (look-alike characters).
      </>,
      <>Electronic Frontier Foundation, DocuColor tracking dot decoding guide, 2005.</>,
      <>ESET Research, report on the “Stegano” exploit kit hiding code in the pixels of banner adverts, December 2016.</>,
    ],
  },
];

export default function About() {
  usePageMeta('About', 'Who makes StegoCraft, how it works, and the books and papers behind the course.');

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <PageHeader eyebrow="About" title="Made for curious people everywhere">
        StegoCraft is a free, open-source place to learn steganography by doing — no sign-up, no paywall, nothing to
        install.
      </PageHeader>

      <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" aria-labelledby="story">
        <div className="prose-sc">
          <h2 id="story">Our story</h2>
          <p>
            StegoCraft began as our final-year capstone project, born from a shared passion for cybersecurity and digital
            privacy. The first version let you hide messages in images, text and audio with a few clicks.
          </p>
          <p>
            This version turns it into an open learning platform: a{' '}
            <Link to="/learn">course</Link> built around interactive experiments, a <Link to="/lab">Lab</Link> for hiding real
            files, <Link to="/detect">steganalysis tools</Link> for catching them, and <Link to="/challenges">challenges</Link> to
            put it all together. The goal is simple: anyone, anywhere, should be able to understand how hidden messages work
            — by trying them.
          </p>
        </div>
        <Card className="space-y-3 self-start">
          <h2 className="flex items-center gap-2 font-semibold">
            <Heart aria-hidden="true" className="h-5 w-5 text-danger" /> Use it responsibly
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Steganography protects privacy and helps journalists and researchers — and it is also used to hide malware and
            stolen data. Learn it to understand, protect and defend. Only analyse files you have the right to examine, and
            respect the laws where you live.
          </p>
        </Card>
      </section>

      <section className="mt-16" aria-labelledby="principles">
        <h2 id="principles" className="text-2xl font-semibold sm:text-3xl">
          What we believe
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="flex gap-4">
              <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="team">
        <h2 id="team" className="text-2xl font-semibold sm:text-3xl">
          The team
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((person) => (
            <Card key={person.name} className="flex flex-col">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-xl font-bold ${person.tone}`} aria-hidden="true">
                {person.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </span>
              <h3 className="mt-4 font-semibold">{person.name}</h3>
              <p className="text-sm font-medium text-accent">{person.role}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{person.bio}</p>
              {person.linkedin && (
                <a href={person.linkedin} className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
                  <LinkedInIcon className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2" aria-labelledby="how">
        <div className="prose-sc">
          <h2 id="how">How it works</h2>
          <ul>
            <li>Everything runs in your browser. Files are read, changed and saved on your device and never uploaded.</li>
            <li>
              Images are processed pixel by pixel with the Canvas API. WAV files are read by StegoCraft’s own parser, so every
              16-bit sample is exact; other formats are decoded by your browser first.
            </li>
            <li>
              With a password, messages are encrypted with AES-256-GCM using a key derived with PBKDF2-SHA256 (250,000
              rounds), and the hidden bits are scattered in an order only that password recreates.
            </li>
            <li>Every message starts with a small header — a signature, its length and a CRC-32 checksum — so damage is detected.</li>
          </ul>
        </div>
        <Card className="space-y-4 self-start">
          <h2 className="font-semibold">Help make it better</h2>
          <p className="text-sm leading-relaxed text-muted">
            Found a mistake, an unclear lesson or a bug? Want to translate StegoCraft into your language? Contributions of every
            size are welcome.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={REPO_URL} className={buttonClass({ variant: 'secondary', size: 'sm' })}>
              <GitHubIcon className="h-4 w-4" /> Source code
            </a>
            <a href={`${REPO_URL}/issues`} className={buttonClass({ variant: 'ghost', size: 'sm' })}>
              Report an issue
            </a>
          </div>
        </Card>
      </section>

      <section id="references" className="mt-16 scroll-mt-24" aria-labelledby="refs">
        <h2 id="refs" className="text-2xl font-semibold sm:text-3xl">
          References and further reading
        </h2>
        <p className="mt-3 max-w-2xl text-muted">The books, papers and reports behind the lessons — a good place to go deeper.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {REFERENCES.map(({ group, items }) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-subtle">{group}</h3>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink/90 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
                {items.map((item, i) => (
                  <li key={i} className="border-l-2 border-line pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
