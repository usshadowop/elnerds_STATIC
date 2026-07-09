import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, PartyPopper } from "lucide-react";

import { insertRsvp, isSupabaseConfigured } from "@/lib/supabase";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  event: z.string().trim().min(1, "Let us know which event"),
  attending: z.enum(["yes", "no", "maybe"]),
  guests: z.coerce.number().int().min(0, "Can't be negative").max(20, "That's a lot of guests!"),
  message: z.string().trim().max(1000, "Please keep it under 1000 characters").optional(),
});

type FormValues = z.input<typeof schema>;

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:text-base";
const labelClass = "mb-1.5 block text-sm font-extrabold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-magenta";

export function Rsvp() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { attending: "yes", guests: 0 },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const parsed = schema.parse(values);
      await insertRsvp(parsed);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Extra Life Nerds Events
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              RSVP
            </h1>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">
              Let us know you&rsquo;re coming so we can plan for you.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-8 rounded-2xl border border-orange bg-orange-soft px-5 py-4 text-sm text-ink">
              <strong className="font-extrabold">Setup needed:</strong> Supabase isn&rsquo;t configured
              yet. Add <code className="rounded bg-paper px-1">VITE_SUPABASE_URL</code> and{" "}
              <code className="rounded bg-paper px-1">VITE_SUPABASE_ANON_KEY</code> (see{" "}
              <code className="rounded bg-paper px-1">.env.example</code>). Submissions will fail until
              then.
            </div>
          )}

          {submitted ? (
            <div className="flex flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                <PartyPopper className="size-7" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">You&rsquo;re on the list!</h2>
              <p className="mt-2 text-sm text-ink-soft sm:text-base">
                Thanks for the RSVP. We&rsquo;ll see you there.
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
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    {...register("email")}
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label className={labelClass} htmlFor="event">
                  Which event?
                </label>
                <input
                  id="event"
                  type="text"
                  placeholder="e.g. 24-Hour Marathon 2026"
                  className={fieldClass}
                  {...register("event")}
                />
                {errors.event && <p className={errorClass}>{errors.event.message}</p>}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="attending">
                    Will you attend?
                  </label>
                  <select id="attending" className={fieldClass} {...register("attending")}>
                    <option value="yes">Yes, I&rsquo;ll be there</option>
                    <option value="maybe">Maybe</option>
                    <option value="no">Can&rsquo;t make it</option>
                  </select>
                  {errors.attending && <p className={errorClass}>{errors.attending.message}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="guests">
                    Additional guests
                  </label>
                  <input
                    id="guests"
                    type="number"
                    min={0}
                    max={20}
                    className={fieldClass}
                    {...register("guests")}
                  />
                  {errors.guests && <p className={errorClass}>{errors.guests.message}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label className={labelClass} htmlFor="message">
                  Anything else? <span className="font-semibold text-ink-soft">(optional)</span>
                </label>
                <textarea id="message" rows={4} className={fieldClass} {...register("message")} />
                {errors.message && <p className={errorClass}>{errors.message.message}</p>}
              </div>

              {serverError && (
                <div className="mt-5 rounded-xl border border-magenta bg-magenta-soft px-4 py-3 text-sm text-ink">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60"
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
