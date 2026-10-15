import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { ButtonLink } from '../components/ui/Button';
import { Badge, PageHeader } from '../components/ui/display';
import { Segmented } from '../components/ui/controls';

const ERAS = [
  { value: 'all', label: 'All' },
  { value: 'ancient', label: 'Ancient world' },
  { value: 'early-modern', label: '1400–1900' },
  { value: 'wartime', label: 'Wars & spies' },
  { value: 'digital', label: 'Digital age' },
];

const EVENTS = [
  {
    year: 'c. 499 BCE',
    era: 'ancient',
    title: 'A message under the hair',
    technique: 'Concealment',
    body: (
      <>
        The Greek historian Herodotus tells how Histiaeus, kept at the Persian court, shaved the head of his most trusted
        slave, tattooed a message on his scalp and waited for the hair to grow back. The slave carried nothing suspicious —
        and the message urged a revolt against Persia.
      </>
    ),
    link: { to: '/learn/what-is-steganography', label: 'What is steganography?' },
  },
  {
    year: 'c. 480 BCE',
    era: 'ancient',
    title: 'The blank wax tablet',
    technique: 'Concealment',
    body: (
      <>
        Demaratus, a Greek exile in Persia, learned that King Xerxes was planning to invade Greece. He scraped the wax off a
        writing tablet, wrote his warning on the wood beneath and covered it with fresh wax. The tablet looked unused. In
        Sparta it was Gorgo, the wife of King Leonidas, who guessed the trick and told them to scrape off the wax.
      </>
    ),
  },
  {
    year: '1st century CE',
    era: 'ancient',
    title: 'Ink that disappears',
    technique: 'Invisible ink',
    body: (
      <>
        The Roman writer Pliny the Elder described writing with the milky sap of the tithymalus plant, a kind of spurge:
        invisible once dry, readable again when treated. Invisible inks made from milk, fruit juice and other organic
        liquids — which darken when heated — stayed in use for nearly two thousand years.
      </>
    ),
  },
  {
    year: '1499',
    era: 'early-modern',
    title: 'A word is born',
    technique: 'Name',
    body: (
      <>
        The German abbot Johannes Trithemius wrote <em>Steganographia</em>, from the Greek <em>steganos</em> (“covered”) and{' '}
        <em>graphein</em> (“to write”). It read like a book of magic about sending messages with spirits, but much of it was
        really about secret writing. It circulated in manuscript for a century, was printed in 1606, and was banned by the
        Catholic Church in 1609.
      </>
    ),
  },
  {
    year: '1586',
    era: 'early-modern',
    title: 'Letters in a beer barrel',
    technique: 'Concealment',
    body: (
      <>
        Mary, Queen of Scots, imprisoned in England, received secret letters hidden in a watertight case inside the stoppers
        of beer barrels. But the courier was working for Elizabeth I’s spymaster, Francis Walsingham, who had every letter
        copied and decrypted. Her replies about the Babington Plot led to her execution in 1587. Hiding only works if the
        messenger can be trusted.
      </>
    ),
  },
  {
    year: 'c. 1605',
    era: 'early-modern',
    title: 'Two typefaces',
    technique: 'Text',
    body: (
      <>
        Francis Bacon described his biliteral cipher: any text, printed in two slightly different typefaces, can carry a
        hidden message — five printed letters for every secret one. Unlike a null cipher, the cover text can say anything at
        all.
      </>
    ),
    link: { to: '/challenges/two-typefaces', label: 'Try the Bacon challenge' },
  },
  {
    year: '1870–71',
    era: 'early-modern',
    title: 'Pigeon post on microfilm',
    technique: 'Miniaturisation',
    body: (
      <>
        During the Siege of Paris, the photographer René Dagron shrank thousands of messages onto tiny sheets of film, light
        enough for carrier pigeons to fly into the surrounded city. Making a message too small to notice would soon become a
        spy’s favourite trick.
      </>
    ),
  },
  {
    year: '1914–1918',
    era: 'wartime',
    title: 'Censors on the lookout',
    technique: 'Null cipher',
    body: (
      <>
        During the First World War, censors read letters and telegrams looking for invisible ink and null ciphers. Some even
        reworded telegrams before sending them on, which scrambles any letters hidden in the words. A famous textbook example,
        often attributed to a German spy, spells “Pershing sails from NY June 1” with the second letter of every word.
      </>
    ),
    link: { to: '/learn/text-tricks', label: 'Classic text tricks' },
  },
  {
    year: '1940s',
    era: 'wartime',
    title: 'The microdot',
    technique: 'Miniaturisation',
    body: (
      <>
        In the Second World War, German agents photographically shrank whole pages to the size of a printed full stop and
        pasted these microdots into ordinary letters. In 1946, FBI director J. Edgar Hoover called the microdot “the enemy’s
        masterpiece of espionage”.
      </>
    ),
  },
  {
    year: '1966',
    era: 'wartime',
    title: 'Blinking in Morse code',
    technique: 'Covert signal',
    body: (
      <>
        Jeremiah Denton, an American pilot held as a prisoner of war in North Vietnam, was forced to give a televised
        interview. As he answered, he blinked T-O-R-T-U-R-E in Morse code — a message hidden in plain sight, in front of his
        captors and the cameras.
      </>
    ),
  },
  {
    year: '1980s',
    era: 'digital',
    title: 'Leaks traced by spacing',
    technique: 'Text',
    body: (
      <>
        Frustrated by leaks of cabinet documents, British Prime Minister Margaret Thatcher reportedly had the government’s
        word processors changed to hide an identifying code in the spacing between words — so a leaked copy could be traced
        back to whoever received it.
      </>
    ),
  },
  {
    year: '1983',
    era: 'digital',
    title: 'The prisoners’ problem',
    technique: 'Theory',
    body: (
      <>
        The cryptographer Gustavus Simmons described steganography as two prisoners who must plan an escape while a warden
        reads every message they exchange. Alice, Bob and Wendy the warden are still how researchers talk about it.
      </>
    ),
    link: { to: '/learn/what-is-steganography', label: 'Meet Alice, Bob and Wendy' },
  },
  {
    year: '1996',
    era: 'digital',
    title: 'A new field of science',
    technique: 'Research',
    body: (
      <>
        The first International Workshop on Information Hiding met in Cambridge, UK. Steganography, digital watermarking and
        their detection became a research field of their own — just as digital photos and sound files made hiding data in
        the lowest bits easy for anyone.
      </>
    ),
    link: { to: '/learn/lsb-substitution', label: 'Your first hidden message' },
  },
  {
    year: '1999',
    era: 'digital',
    title: 'Catching the lowest bits',
    technique: 'Detection',
    body: (
      <>
        Andreas Westfeld and Andreas Pfitzmann showed that replacing the lowest bits leaves a statistical fingerprint, and
        published the chi-square attack. The same year, Aphex Twin hid a picture of a face in the spectrogram of a track on
        his <em>Windowlicker</em> single.
      </>
    ),
    link: { to: '/learn/steganalysis', label: 'Catching hidden messages' },
  },
  {
    year: '2005',
    era: 'digital',
    title: 'Dots on every page',
    technique: 'Tracking',
    body: (
      <>
        The Electronic Frontier Foundation decoded the faint yellow dots that one family of colour laser printers adds to
        every page: they recorded the printer’s serial number and the date and time of printing.
      </>
    ),
    link: { to: '/learn/real-world', label: 'Steganography in the real world' },
  },
  {
    year: '2010',
    era: 'digital',
    title: 'Spies in plain sight',
    technique: 'Espionage',
    body: (
      <>
        When the FBI arrested a ring of Russian sleeper agents in the United States, its court papers described
        steganography software used to hide messages in images posted on public websites.
      </>
    ),
  },
  {
    year: '2010s',
    era: 'digital',
    title: 'The arms race turns adaptive',
    technique: 'Research',
    body: (
      <>
        New methods such as HUGO, WOW and S-UNIWARD measure how detectable each change would be and hide data only where it is
        hardest to model. Detectors answered with machine learning — and, from the mid-2010s, deep neural networks.
      </>
    ),
  },
  {
    year: '2016',
    era: 'digital',
    title: 'Malware in the pixels',
    technique: 'Malware',
    body: (
      <>
        The security company ESET reported a campaign that hid malicious code in the pixels of online banner adverts — a
        reminder that steganography is a tool, used by defenders and attackers alike.
      </>
    ),
  },
  {
    year: '2017',
    era: 'digital',
    title: 'Dots in a leaked scan',
    technique: 'Tracking',
    body: (
      <>
        When a news site published a scan of a leaked document, analysts pointed out printer tracking dots in it, revealing
        the printer’s serial number and the date and time the page was printed.
      </>
    ),
  },
];

const DOT = {
  ancient: 'border-warn',
  'early-modern': 'border-secret',
  wartime: 'border-danger',
  digital: 'border-accent',
};

export default function History() {
  usePageMeta('History of hiding', 'From tattooed messengers to pixels: 2,500 years of hiding messages in plain sight, in an interactive timeline.');
  const [era, setEra] = useState('all');
  const shown = era === 'all' ? EVENTS : EVENTS.filter((e) => e.era === era);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <PageHeader eyebrow="History" title="2,500 years of hiding in plain sight">
        Long before computers, people hid messages under hair, inside wax, in invisible ink and in the shapes of letters.
        Every trick on this page has a modern descendant you can try in StegoCraft.
      </PageHeader>

      <div className="mt-8">
        <Segmented label="Era" value={era} onChange={setEra} options={ERAS} />
      </div>

      <ol className="relative mt-10 space-y-10 border-l border-line pl-6 sm:pl-8">
        {shown.map((e) => (
          <li key={e.title} className="relative">
            <span
              className={`absolute top-1.5 h-3.5 w-3.5 rounded-full border-[3px] bg-bg -left-[calc(1.5rem+7px)] sm:-left-[calc(2rem+7px)] ${DOT[e.era]}`}
              aria-hidden="true"
            />
            <p className="font-mono text-sm font-semibold text-accent">{e.year}</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{e.title}</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink/85">{e.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge>{e.technique}</Badge>
              {e.link && (
                <Link to={e.link.to} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  {e.link.label} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </li>
        ))}
        <li className="relative">
          <span className="absolute top-1.5 h-3.5 w-3.5 rounded-full bg-secret -left-[calc(1.5rem+7px)] sm:-left-[calc(2rem+7px)]" aria-hidden="true" />
          <p className="font-mono text-sm font-semibold text-secret">Today</p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Your turn</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink/85">
            Hide a message in a photo, a song or a sentence — then switch sides and try to catch one.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink to="/lab">Open the Lab</ButtonLink>
            <ButtonLink to="/challenges" variant="secondary">
              Try the challenges
            </ButtonLink>
          </div>
        </li>
      </ol>

      <p className="mt-14 text-sm text-muted">
        Sources include Herodotus’ <em>Histories</em> and David Kahn’s <em>The Codebreakers</em>. See the full{' '}
        <Link to="/about#references" className="text-accent underline underline-offset-4">
          reading list
        </Link>
        .
      </p>
    </div>
  );
}
