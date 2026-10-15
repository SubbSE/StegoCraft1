import { Link } from 'react-router-dom';
import CipherVsStego from '../../explorables/CipherVsStego';
import WardenGame from '../../explorables/WardenGame';
import { Callout } from '../../components/ui/display';

function TradeoffTriangle() {
  return (
    <figure className="my-8 rounded-2xl border border-line bg-surface p-5">
      <svg viewBox="0 0 420 285" className="mx-auto w-full max-w-md" role="img" aria-labelledby="tri-title tri-desc">
        <title id="tri-title">The steganography trade-off triangle</title>
        <desc id="tri-desc">Capacity, invisibility and robustness pull against each other.</desc>
        <polygon points="210,62 70,222 350,222" fill="color-mix(in oklab, var(--color-accent) 6%, transparent)" stroke="var(--color-line-strong)" strokeWidth="2" strokeDasharray="6 6" />
        {[
          { cx: 210, cy: 62, x: 210, y: 22, anchor: 'middle', label: 'Capacity', sub: 'how much you can hide' },
          { cx: 70, cy: 222, x: 30, y: 252, anchor: 'start', label: 'Invisibility', sub: 'how hard it is to notice' },
          { cx: 350, cy: 222, x: 390, y: 252, anchor: 'end', label: 'Robustness', sub: 'what it survives' },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.cx} cy={p.cy} r="7" fill="var(--color-accent)" />
            <text x={p.x} y={p.y} textAnchor={p.anchor} fill="var(--color-ink)" fontSize="15" fontWeight="600">
              {p.label}
            </text>
            <text x={p.x} y={p.y + 18} textAnchor={p.anchor} fill="var(--color-muted)" fontSize="12">
              {p.sub}
            </text>
          </g>
        ))}
        <text x="210" y="162" textAnchor="middle" fill="var(--color-muted)" fontSize="13">
          every method sits somewhere inside —
        </text>
        <text x="210" y="180" textAnchor="middle" fill="var(--color-muted)" fontSize="13">
          none maxes out all three
        </text>
      </svg>
    </figure>
  );
}

export default function WhatIsSteganography() {
  return (
    <>
      <p>
        Imagine you need to pass a secret note across a classroom, and the teacher is watching. You have two options. You
        could write the note in a code only your friend understands. Or you could hide the note inside something that looks
        completely ordinary — say, a doodle in the margin of your homework.
      </p>
      <p>
        The first option is <strong>cryptography</strong>: the art of making a message unreadable. The second is{' '}
        <strong>steganography</strong>: the art of making a message <em>invisible</em>. The word comes from Greek{' '}
        <em>steganós</em> (“covered”) and <em>gráphein</em> (“to write”) — literally, “covered writing”.
      </p>

      <h2>Hiding the message vs. hiding that there is one</h2>
      <p>
        Cryptography protects what a message <em>says</em>. Anyone can see that a secret is being sent; they just can’t
        read it. Steganography protects the fact that a message <em>exists</em>. If it works, nobody even thinks to look.
      </p>
      <p>Type a message below and watch both approaches handle it.</p>

      <CipherVsStego />

      <p>
        Notice the encrypted version looks like gibberish. That is exactly its weakness: gibberish attracts attention. In
        places where sending encrypted messages is suspicious — or forbidden — a message that looks innocent is far safer.
      </p>

      <h2>The prisoners’ problem</h2>
      <p>
        In 1983 the cryptographer Gustavus Simmons described steganography with a story that is still used today. Two
        prisoners, <strong>Alice</strong> and <strong>Bob</strong>, want to plan an escape. They may exchange letters, but
        every letter passes through <strong>Wendy the warden</strong>. If Wendy notices anything suspicious, she stops the
        letters — and the escape.
      </p>
      <p>
        So Alice and Bob can’t just encrypt their plans. They need letters that look perfectly ordinary to Wendy but carry a
        hidden meaning for each other. Let’s swap sides: <em>you</em> are Wendy now.
      </p>

      <WardenGame />

      <p>
        The trick in those letters is a <strong>null cipher</strong>: the real message is spelled by the first letter of
        each word, and the rest is filler. It is one of the oldest steganographic tricks. You’ll meet it again — and some of
        its cleverer cousins — in the text lessons.
      </p>

      <h2>The words you’ll keep hearing</h2>
      <ul>
        <li>
          <strong>Cover</strong> (or <em>carrier</em>): the innocent-looking thing that hides the secret — a photo, a song, a
          letter.
        </li>
        <li>
          <strong>Payload</strong>: the secret itself.
        </li>
        <li>
          <strong>Stego object</strong>: the cover after the payload has been hidden inside it.
        </li>
        <li>
          <strong>Key</strong>: an optional secret (like a password) that the sender and receiver share, which controls
          where or how the payload is hidden.
        </li>
        <li>
          <strong>Steganalysis</strong>: the work of the warden — detecting hidden messages.
        </li>
      </ul>

      <h2>You can’t have everything</h2>
      <p>
        Every hiding method balances three goals. Hide more data (<strong>capacity</strong>) and the changes become easier to
        notice (<strong>invisibility</strong>). Make the message survive editing or compression (<strong>robustness</strong>)
        and you can usually hide less. Throughout this course, watch how each technique picks its spot in this triangle.
      </p>

      <TradeoffTriangle />

      <h2>An old idea</h2>
      <p>
        Steganography is far older than computers. Around 500 BCE, according to the Greek historian Herodotus, a ruler named
        Histiaeus shaved a slave’s head, tattooed a message on his scalp, waited for the hair to grow back, and sent him on
        his way. Another Greek, Demaratus, warned Sparta of an invasion by writing on the wooden base of a wax tablet and
        covering it with fresh wax — the tablet looked blank.
      </p>
      <p>
        You can explore more of these stories, from invisible inks to microdots, in the{' '}
        <Link to="/history">history of hiding</Link>.
      </p>

      <Callout type="tip" title="Best practice: use both">
        Steganography and cryptography work well together. Encrypt your message first, then hide it. If the hiding is ever
        discovered, the content is still protected — and encrypted data looks like random noise, which is easier to hide.
      </Callout>
    </>
  );
}

export const quiz = [
  {
    q: 'What is the main difference between steganography and cryptography?',
    options: [
      'Steganography is newer than cryptography.',
      'Cryptography hides what a message says; steganography hides that a message exists.',
      'Steganography only works with pictures.',
      'Cryptography cannot be broken, but steganography can.',
    ],
    answer: 1,
    explain: 'An encrypted message is unreadable but obviously secret. A good stego object looks like nothing special at all.',
  },
  {
    q: 'In the prisoners’ problem, what does Wendy the warden represent?',
    options: ['The person who receives the secret', 'An eavesdropper who blocks anything suspicious', 'The key', 'The cover image'],
    answer: 1,
    explain: 'Wendy reads every message and stops the suspicious ones — the job of anyone doing steganalysis.',
  },
  {
    q: 'You hide more and more data in the same photo. What usually happens?',
    options: [
      'Nothing — hidden data takes no space.',
      'The photo becomes more robust to compression.',
      'The changes become easier to notice or detect.',
      'The photo’s file name changes.',
    ],
    answer: 2,
    explain: 'Capacity and invisibility pull against each other: more payload means more changes to the cover.',
  },
];
