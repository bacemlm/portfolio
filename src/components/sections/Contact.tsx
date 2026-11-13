import { ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { profile, socials } from '../../data/profile';
import { services } from '../../data/services';
import { cn } from '../../lib/utils';
import { BrandIcon } from '../ui/BrandIcon';
import { Button } from '../ui/Button';
import { Magnetic } from '../ui/Magnetic';
import { Reveal, SplitText } from '../ui/Reveal';

/**
 * Delivery: with a Web3Forms access key (VITE_WEB3FORMS_KEY) messages are sent from the page
 * and the real API response decides success or failure. Without a key the form opens the
 * visitor's email app with the message pre-filled. It never pretends a message was sent.
 */
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || '';
const ENDPOINT = 'https://api.web3forms.com/submit';
const MIN_FILL_TIME_MS = 2500;

type Field = 'name' | 'email' | 'service' | 'message';
type Values = Record<Field, string>;
type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

const empty: Values = { name: '', email: '', service: '', message: '' };
const serviceOptions = [...services.map((service) => service.formValue), 'Something else'];

function validate(values: Values): Partial<Values> {
  const errors: Partial<Values> = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address, like name@example.com.';
  if (!values.service) errors.service = 'Please choose what you need help with.';
  if (values.message.trim().length < 20) errors.message = 'Please tell me a little more (at least 20 characters).';
  return errors;
}

const fieldBase =
  'peer w-full rounded-2xl border bg-surface px-4 text-base text-fg outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-subtle focus:border-accent focus:shadow-[0_0_0_4px_var(--glow)]';

interface ContactProps {
  /** Service pre-selected from the Services section. */
  service: string;
}

export function Contact({ service }: ContactProps) {
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(Date.now());
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (service) setValues((current) => ({ ...current, service }));
  }, [service]);

  const set = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  };
  const blur = (field: Field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const mailtoHref = () => {
    const subject = `Project enquiry: ${values.service || 'Portfolio contact'}`;
    const body = `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`;
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, service: true, message: true });
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Spam traps: bots fill the hidden field and submit instantly. Drop those quietly.
    if (honeypot || Date.now() - mountedAt.current < MIN_FILL_TIME_MS) return;

    if (!ACCESS_KEY) {
      window.location.href = mailtoHref();
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry: ${values.service}`,
          from_name: 'Portfolio contact form',
          name: values.name.trim(),
          email: values.email.trim(),
          service: values.service,
          message: values.message.trim(),
          botcheck: '',
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !result?.success) throw new Error(`Request failed (${response.status})`);
      setStatus('sent');
      setValues({ ...empty });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard can be blocked; the address is visible and selectable either way. */
    }
  };

  const describe = (field: Field) => (errors[field] && touched[field] ? `${uid}-${field}-error` : undefined);
  const invalid = (field: Field) => Boolean(errors[field] && touched[field]);
  const errorText = (field: Field) =>
    invalid(field) ? (
      <p id={`${uid}-${field}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
        <CircleAlert size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
        {errors[field]}
      </p>
    ) : null;
  const label = (field: Field, text: string) => (
    <label htmlFor={`${uid}-${field}`} className="mb-2 block text-sm font-medium">
      {text}
    </label>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-clip py-24 outline-none md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38rem] bg-[radial-gradient(60%_60%_at_50%_100%,var(--glow),transparent_70%)]"
      />
      <div className="container-x">
        <Reveal y={12}>
          <p className="label-mono mb-5 flex items-center gap-3 text-muted">
            <span className="text-accent-text">05</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            Contact
          </p>
        </Reveal>
        <h2
          id="contact-title"
          className="max-w-5xl text-[clamp(2.25rem,6.6vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.04em]"
        >
          <SplitText text="Have a project in mind?" className="block" />
          <SplitText text="Let’s build something great." className="block text-muted" delay={0.2} />
        </h2>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="min-w-0">
            <div className="space-y-3">
              <div className="card flex items-center gap-4 p-4 pl-5">
                <Mail size={20} aria-hidden="true" className="shrink-0 text-accent-text" />
                <div className="min-w-0 flex-1">
                  <p className="label-mono text-subtle">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="-my-1.5 block truncate py-2.5 font-medium underline-offset-4 hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-accent hover:text-fg"
                >
                  {copied ? <Check size={17} aria-hidden="true" className="text-success" /> : <Copy size={17} aria-hidden="true" />}
                </button>
                <span role="status" className="sr-only">
                  {copied ? 'Email address copied to clipboard.' : ''}
                </span>
              </div>

              <a href={profile.phoneHref} className="card flex items-center gap-4 p-4 pl-5 hover:border-line-strong">
                <Phone size={20} aria-hidden="true" className="shrink-0 text-accent-text" />
                <span>
                  <span className="label-mono block text-subtle">Phone</span>
                  <span className="mt-1 block font-medium">{profile.phone}</span>
                </span>
              </a>

              <div className="card flex items-center gap-4 p-4 pl-5">
                <MapPin size={20} aria-hidden="true" className="shrink-0 text-accent-text" />
                <p>
                  <span className="label-mono block text-subtle">Location</span>
                  <span className="mt-1 block font-medium">{profile.location}</span>
                </p>
              </div>
            </div>

            <p className="label-mono mt-10 mb-4 text-muted">Find me online</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-12 items-center gap-3 rounded-full border border-line px-4 text-sm transition-colors duration-300 hover:border-accent hover:bg-surface"
                  >
                    <BrandIcon id={social.id} width={18} height={18} className="shrink-0 text-muted group-hover:text-fg" />
                    <span className="flex-1 font-medium">{social.label}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="text-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <form
              ref={form}
              noValidate
              onSubmit={onSubmit}
              aria-labelledby="contact-title"
              className="card p-6 sm:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  {label('name', 'Your name')}
                  <input
                    id={`${uid}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={set('name')}
                    onBlur={blur('name')}
                    aria-invalid={invalid('name')}
                    aria-describedby={describe('name')}
                    className={cn(fieldBase, 'h-13', invalid('name') ? 'border-danger' : 'border-line-strong')}
                  />
                  {errorText('name')}
                </div>
                <div>
                  {label('email', 'Email address')}
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    value={values.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    aria-invalid={invalid('email')}
                    aria-describedby={describe('email')}
                    className={cn(fieldBase, 'h-13', invalid('email') ? 'border-danger' : 'border-line-strong')}
                  />
                  {errorText('email')}
                </div>
              </div>

              <div className="mt-5">
                {label('service', 'What do you need?')}
                <select
                  id={`${uid}-service`}
                  name="service"
                  required
                  value={values.service}
                  onChange={set('service')}
                  onBlur={blur('service')}
                  aria-invalid={invalid('service')}
                  aria-describedby={describe('service')}
                  className={cn(
                    fieldBase,
                    'h-13 appearance-none bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-11',
                    !values.service && 'text-subtle',
                    invalid('service') ? 'border-danger' : 'border-line-strong',
                  )}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b8b94' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errorText('service')}
              </div>

              <div className="mt-5">
                {label('message', 'Project details')}
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  rows={6}
                  required
                  placeholder="What are you building, and when do you need it?"
                  value={values.message}
                  onChange={set('message')}
                  onBlur={blur('message')}
                  aria-invalid={invalid('message')}
                  aria-describedby={describe('message')}
                  className={cn(fieldBase, 'resize-y py-3.5 leading-relaxed', invalid('message') ? 'border-danger' : 'border-line-strong')}
                />
                {errorText('message')}
              </div>

              {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Magnetic strength={0.2}>
                  <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
                    {status === 'sending' ? (
                      <>
                        <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        {ACCESS_KEY ? 'Send message' : 'Open in email app'}
                        <Send size={17} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </Magnetic>
                <p className="max-w-xs text-sm leading-relaxed text-subtle">
                  {ACCESS_KEY
                    ? 'Your message goes straight to my inbox. I only use your email to reply.'
                    : 'This opens your email app with the message filled in. Nothing is sent until you press send there.'}
                </p>
              </div>

              <div aria-live="polite" className="empty:hidden">
                {status === 'sent' && (
                  <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-success/40 bg-success/10 p-4 text-sm leading-relaxed">
                    <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                    Message sent. Thank you — I’ll reply to the address you gave.
                  </p>
                )}
                {status === 'mailto' && (
                  <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line-strong bg-surface-2 p-4 text-sm leading-relaxed">
                    <Mail size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-2-text" />
                    <span>
                      Your email app should now be open with the message ready. Press send there to deliver it. Nothing
                      opened? Write to{' '}
                      <a href={`mailto:${profile.email}`} className="font-medium text-fg underline underline-offset-4">
                        {profile.email}
                      </a>
                      .
                    </span>
                  </p>
                )}
                {status === 'error' && (
                  <p
                    role="alert"
                    className="mt-6 flex items-start gap-2.5 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm leading-relaxed"
                  >
                    <CircleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
                    <span>
                      The message could not be sent, and your text is still here. Try again, or{' '}
                      <a href={mailtoHref()} className="font-medium text-fg underline underline-offset-4">
                        send it by email instead
                      </a>
                      .
                    </span>
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
