import { Link } from 'react-router-dom';
import PrinterDots from '../../explorables/PrinterDots';
import { Callout } from '../../components/ui/display';

export default function RealWorld() {
  return (
    <>
      <p>
        Steganography isn’t just a puzzle. The ideas from this course are used every day — to protect copyright, trace leaks,
        measure audiences, and, unfortunately, to hide malware. This last lesson is a tour of where hidden information shows
        up in the real world, and how to think about using it responsibly.
      </p>

      <h2>Watermarks: hiding with a different goal</h2>
      <p>
        A <strong>digital watermark</strong> uses the same techniques as steganography, but flips the priorities. A secret
        message must stay <em>undetected</em>; a watermark must <em>survive</em> — cropping, compression, re-recording — and is
        often no secret at all. Watermarks carry little data, but carry it robustly, usually by spreading it redundantly across
        the whole image or sound.
      </p>
      <ul>
        <li>
          <strong>Audience measurement.</strong> Many TV and radio broadcasts carry inaudible audio watermarks that identify
          the station, so metering devices in volunteers’ homes can record what is being watched or heard.
        </li>
        <li>
          <strong>Leak tracing in film.</strong> Preview copies and cinema projections can carry invisible forensic
          watermarks that identify the copy or the screening, so pirated recordings can be traced.
        </li>
        <li>
          <strong>Labelling AI-generated media.</strong> Systems such as Google DeepMind’s SynthID embed imperceptible
          watermarks into AI-generated images, audio and text, so they can later be identified as machine-made.
        </li>
      </ul>

      <h2>The dots in your printer</h2>
      <p>
        For decades, many colour laser printers have added a faint pattern of tiny yellow dots to every page they print. In
        2005 the Electronic Frontier Foundation (EFF) decoded the pattern used by one printer family: it recorded the
        printer’s serial number and the date and time of printing.
      </p>

      <PrinterDots />

      <p>
        In 2017, when a news site published a scanned copy of a leaked document, analysts noticed these dots in the scan —
        and pointed out that they revealed the printer and the exact time the page was printed. Hidden information works in
        both directions: it can protect people, and it can expose them.
      </p>

      <h2>Spies and criminals</h2>
      <ul>
        <li>
          <strong>Espionage.</strong> When the FBI arrested a ring of Russian sleeper agents in the United States in 2010, its
          court papers described steganography software used to hide messages in images posted on public websites.
        </li>
        <li>
          <strong>Malware.</strong> Attackers hide malicious code and commands inside innocent-looking images and sound files
          to slip past security filters. In 2016, for example, the security company ESET reported a campaign that hid malicious
          code in the pixel data of online advertisements.
        </li>
        <li>
          <strong>Data theft.</strong> An insider might hide stolen data inside holiday photos sent out of a company network.
          This is why security teams study steganalysis.
        </li>
      </ul>

      <h2>Using it responsibly</h2>
      <p>Like encryption, steganography is a tool. In most countries, learning and using it is perfectly legal; what matters is what it is used for. Good uses include:</p>
      <ul>
        <li>protecting the privacy of journalists, activists and ordinary people who live under surveillance or censorship;</li>
        <li>proving authorship and tracing stolen copies of creative work;</li>
        <li>security research, digital forensics and defending networks;</li>
        <li>education, puzzles and capture-the-flag competitions.</li>
      </ul>

      <Callout type="warn" title="Know your local rules">
        Some countries restrict encryption or require certain communications to be readable by authorities, and using any
        tool to commit a crime is a crime. If you are protecting yourself in a risky situation, seek advice from organisations
        that specialise in digital safety for your region.
      </Callout>

      <h2>Where to go next</h2>
      <p>
        Congratulations — you’ve completed the StegoCraft course! You now understand how messages hide in pictures, sounds and
        text, and how they get caught. Here are some ways to keep going:
      </p>
      <ul>
        <li>
          Solve the <Link to="/challenges">challenges</Link> — real hidden flags in images, audio and text.
        </li>
        <li>
          Experiment freely in the <Link to="/lab">Lab</Link> and the <Link to="/detect">Detect lab</Link>.
        </li>
        <li>
          Browse the <Link to="/history">history of hiding</Link>, from shaved heads to microdots.
        </li>
        <li>
          Read the <Link to="/about#references">papers and books</Link> this course is based on.
        </li>
      </ul>
    </>
  );
}

export const quiz = [
  {
    q: 'What is the main difference between a watermark and a steganographic message?',
    options: [
      'Watermarks can only be visible logos.',
      'A watermark’s priority is surviving processing; a hidden message’s priority is not being detected.',
      'Watermarks are always encrypted.',
      'There is no difference.',
    ],
    answer: 1,
    explain: 'Watermarks trade capacity and secrecy for robustness; steganography prioritises staying unnoticed.',
  },
  {
    q: 'What did the printer tracking dots decoded by the EFF record?',
    options: ['The document’s text', 'The printer’s serial number and the date and time of printing', 'The owner’s name and address', 'Nothing — they are decoration'],
    answer: 1,
    explain: 'A pattern of tiny yellow dots encoded the serial number and a timestamp on every page.',
  },
  {
    q: 'Why do security teams study steganalysis?',
    options: [
      'To make images prettier',
      'To find malware and stolen data hidden inside innocent-looking files',
      'To compress files',
      'Because it is required by law everywhere',
    ],
    answer: 1,
    explain: 'Attackers hide code and stolen data in ordinary files; detecting it is part of defending a network.',
  },
];
