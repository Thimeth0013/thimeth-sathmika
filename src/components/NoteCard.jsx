import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

// A slightly tilted sheet of note paper that sends a message through EmailJS (same service and
// template as the old Contact form; env vars VITE_SERVICE_ID / VITE_TEMPLATE_ID / VITE_PUBLIC_KEY).
// Paper colour and grain: .note-paper in index.css. The tilt eases straighter while you write.

const STATUS = {
  idle: '',
  sending: 'Sending…',
  sent: 'Sent. Thank you!',
  error: 'Didn’t send. Try again?',
};

const label = 'font-mono text-[11px] uppercase leading-none tracking-[0.06em] text-forest/70';
const field =
  'min-w-0 flex-1 bg-transparent p-0 font-grotezk text-base text-forest placeholder:text-forest/35 focus:outline-none';

export const NoteCard = ({ className = '' }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const send = (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_PUBLIC_KEY,
      )
      .then(() => {
        formRef.current?.reset();
        setStatus('sent');
      })
      .catch(() => setStatus('error'))
      .finally(() => setTimeout(() => setStatus('idle'), 6000));
  };

  return (
    <form
      ref={formRef}
      onSubmit={send}
      aria-label="Send Thimeth a note"
      className={`note-paper relative flex w-full max-w-[420px] flex-col px-7 pb-6 pt-7 transition-[rotate] duration-500 ease-out-expo focus-within:rotate-[-0.6deg] ${className}`}
    >
      <p className={`${label} text-[13px] text-forest`}>A note to Thimeth</p>

      <input type="hidden" name="subject" value="A note from the portfolio" />

      {/* Ruled lines: two labelled lines, then the message written on the rest of the ruling. */}
      <div className="mt-9">
        <label className="flex h-9 items-baseline gap-3 border-b border-forest/30 pt-[11px]">
          <span className={label}>From</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={`${field} h-6 leading-6`} />
        </label>
        <label className="flex h-9 items-baseline gap-3 border-b border-forest/30 pt-[11px]">
          <span className={label}>Reply to</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={`${field} h-6 leading-6`}
          />
        </label>
        <label className="block">
          <span className="sr-only">Message</span>
          <textarea
            name="message"
            required
            rows={6}
            placeholder="Write me a note…"
            className={`${field} note-ruled block w-full resize-none`}
          />
        </label>
      </div>

      <div className={`${label} mt-6 flex items-center justify-between gap-3`}>
        <span role="status" aria-live="polite" className={status === 'error' ? 'text-[#B4412B]' : ''}>
          {STATUS[status]}
        </span>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group -mx-2 -my-2 inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-2 uppercase text-forest transition-colors hover:bg-sky hover:text-white focus-visible:outline-2 focus-visible:outline-sky disabled:opacity-50"
        >
          Send
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px">
            <path d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Paper clip on the top edge: just its outer wire, blue-coated, laid over the card. */}
      <svg
        viewBox="0 0 24 64"
        aria-hidden="true"
        className="pointer-events-none absolute -top-[26px] right-10 h-[86px] w-[33px] rotate-[8deg] drop-shadow-[0_1.5px_1px_rgba(20,83,45,0.3)]"
      >
        <defs>
          <linearGradient id="note-clip" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#2563D9" />
            <stop offset="0.45" stopColor="#9CC3FA" />
            <stop offset="1" stopColor="#2A5FC4" />
          </linearGradient>
        </defs>
        <path
          d="M16 18V10a6 6 0 0 0-12 0V54a8 8 0 0 0 16 0V20"
          fill="none"
          stroke="url(#note-clip)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </svg>

      <span aria-hidden="true" className="absolute bottom-2 right-2.5 font-mono text-[9px] leading-none text-forest/50">
        ®
      </span>
    </form>
  );
};
