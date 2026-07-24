import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, PartyPopper, CalendarDays, MapPin, ArrowLeft } from "lucide-react";

import { submitRsvp, isRsvpConfigured } from "@/lib/rsvp";
import { RSVP_EVENT_LIST, getRsvpEvent, type RsvpEvent, type RsvpField } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:text-base";
const labelClass = "mb-1.5 block text-sm font-extrabold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-magenta";

// Build a zod schema from an event's field list (plus universal name/email).
function buildSchema(event: RsvpEvent) {
  const shape: Record<string, z.ZodTypeAny> = {
    name: z.string().trim().min(1, "Please enter your name"),
    email: z.string().trim().email("Please enter a valid email"),
  };

  for (const f of event.fields) {
    if (f.type === "number") {
      shape[f.id] = z.coerce
        .number()
        .int()
        .min(f.min ?? 0, `Can't be less than ${f.min ?? 0}`)
        .max(f.max ?? 9999, `That's a lot!`);
    } else if (f.type === "select") {
      const values = (f.options ?? []).map((o) => o.value);
      shape[f.id] = z.enum(values as [string, ...string[]]);
    } else {
      // text / textarea
      let s = z.string().trim().max(1000, "Please keep it under 1000 characters");
      if (f.required) s = s.min(1, "This field is required") as typeof s;
      shape[f.id] = s;
    }
  }

  return z.object(shape);
}

function defaultsFor(event: RsvpEvent): Record<string, string> {
  const d: Record<string, string> = { name: "", email: "" };
  for (const f of event.fields) {
    if (f.type === "select") d[f.id] = f.options?.[0]?.value ?? "";
    else if (f.type === "number") d[f.id] = String(f.min ?? 0);
    else d[f.id] = "";
  }
  return d;
}

function Field({ field, register, error }: { field: RsvpField; register: ReturnType<typeof useForm>["register"]; error?: string }) {
  const span = field.half ? "" : "sm:col-span-2";
  return (
    <div className={span}>
      <label className={labelClass} htmlFor={field.id}>
        {field.label}{" "}
        {field.optionalHint && <span className="font-semibold text-ink-soft">(optional)</span>}
      </label>
      {field.type === "select" ? (
        <select id={field.id} className={fieldClass} {...register(field.id)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea id={field.id} rows={4} className={fieldClass} placeholder={field.placeholder} {...register(field.id)} />
      ) : field.type === "number" ? (
        <input
          id={field.id}
          type="number"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          className={fieldClass}
          {...register(field.id)}
        />
      ) : (
        <input id={field.id} type="text" placeholder={field.placeholder} className={fieldClass} {...register(field.id)} />
      )}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

// Landing shown at bare /rsvp or for an unknown slug: pick an event.
function RsvpChooser() {
  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Extra Life Nerds Events
          </p>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            RSVP to an event
          </h1>
          <p className="mt-3 text-sm text-ink-soft sm:text-base">Pick the event you&rsquo;d like to RSVP for.</p>
          <div className="mt-10 grid gap-4">
            {RSVP_EVENT_LIST.map((ev) => (
              <a
                key={ev.slug}
                href={`${HOME}rsvp/${ev.slug}`}
                className="group rounded-2xl border border-line bg-paper p-6 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5"
              >
                <p className={`font-display text-sm font-extrabold ${ev.accentText}`}>{ev.dateLabel}</p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-ink">{ev.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{ev.tagline}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function Rsvp({ slug }: { slug?: string }) {
  const event = slug ? getRsvpEvent(slug) : undefined;

  if (!event) return <RsvpChooser />;
  return <RsvpForm event={event} />;
}

function RsvpForm({ event }: { event: RsvpEvent }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(() => buildSchema(event), [event]);
  const defaults = useMemo(() => defaultsFor(event), [event]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  async function onSubmit(values: Record<string, unknown>) {
    setServerError(null);
    try {
      const parsed = schema.parse(values) as Record<string, string | number>;
      await submitRsvp({
        slug: event.slug,
        title: event.title,
        name: String(parsed.name),
        email: String(parsed.email),
        fields: event.fields.map((f) => ({ id: f.id, label: f.label, value: String(parsed[f.id] ?? "") })),
      });
      setSubmitted(true);
      reset(defaults);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-2xl">
          <a
            href={`${HOME}#schedule`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
          >
            <ArrowLeft className="size-4" /> All events
          </a>

          {/* Prominent event header */}
          <div className="mb-10 text-center">
            <p className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] ${event.accentText}`}>
              RSVP
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              {event.title}
            </h1>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">{event.tagline}</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-ink sm:flex-row sm:gap-6">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className={`size-4 ${event.accentText}`} /> {event.dateLabel}
              </span>
              {event.location &&
                (event.mapUrl ? (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-center underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
                  >
                    <MapPin className={`size-4 ${event.accentText}`} /> {event.location}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-center">
                    <MapPin className={`size-4 ${event.accentText}`} /> {event.location}
                  </span>
                ))}
            </div>
          </div>

          {!isRsvpConfigured && (
            <div className="mb-8 rounded-2xl border border-orange bg-orange-soft px-5 py-4 text-sm text-ink">
              <strong className="font-extrabold">Setup needed:</strong> the RSVP endpoint isn&rsquo;t
              configured yet. Add <code className="rounded bg-paper px-1">VITE_RSVP_ENDPOINT</code> (see{" "}
              <code className="rounded bg-paper px-1">apps-script/README.md</code>). Submissions will
              fail until then.
            </div>
          )}

          {submitted ? (
            <div className="flex flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                <PartyPopper className="size-7" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">You&rsquo;re on the list!</h2>
              <p className="mt-2 text-sm text-ink-soft sm:text-base">
                Thanks for the RSVP to <strong>{event.title}</strong>. Check your email for a
                confirmation with an add-to-calendar link.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-3xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="name">
                    Name
                  </label>
                  <input id="name" type="text" autoComplete="name" className={fieldClass} {...register("name")} />
                  {errors.name && <p className={errorClass}>{String(errors.name.message)}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>
                  <input id="email" type="email" autoComplete="email" className={fieldClass} {...register("email")} />
                  {errors.email && <p className={errorClass}>{String(errors.email.message)}</p>}
                </div>

                {event.fields.map((f) => (
                  <Field key={f.id} field={f} register={register} error={errors[f.id]?.message as string | undefined} />
                ))}
              </div>

              {serverError && (
                <div className="mt-5 rounded-xl border border-magenta bg-magenta-soft px-4 py-3 text-sm text-ink">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${event.accentBg} ${event.accentBgHover}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending&hellip;
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> Send RSVP
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
