// /gameday_events — sign-ups for specific Game Day events.
//
// The list is the "Gameday Signups" tab of the RSVP sheet (Event, When,
// Details, Sign-up link), read through the same ?action=gameday endpoint as
// the schedule and re-read once a minute. A row with a Sign-up link gets a
// "Sign up" button to that address (an Extra Life incentive, say); rows
// without one are offered in the form at the bottom, which posts to Code.gs
// and lands in the "Event Signups" tab. Linked from the home page (above the
// Game Day schedule) and from the nav's Events menu.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  ExternalLink,
  Loader2,
  PartyPopper,
  Swords,
} from "lucide-react";

import { RichText, SpotsChip } from "@/components/site/GamedayEventDetails";
import { incentiveOf, useIncentiveStock } from "@/hooks/useExtraLifeIncentives";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { useNow } from "@/hooks/use-now";
import { submitGamedaySignup } from "@/lib/gamedaySignup";
import { getRsvpEvent, hasEventEnded } from "@/lib/rsvpEvents";

const HOME = import.meta.env.BASE_URL;
const MARATHON = getRsvpEvent("marathon");

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:text-base";
const labelClass = "mb-1.5 block text-sm font-extrabold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-magenta";
const checkClass =
  "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-bold text-ink shadow-sm transition has-[:checked]:border-teal has-[:checked]:bg-teal-soft sm:text-base";
const boxClass = "mt-1 size-4 shrink-0 accent-teal";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("That doesn't look like an email address."),
  events: z.array(z.string()).min(1, "Pick at least one event."),
  notes: z.string().trim().max(1000, "Please keep this under 1000 characters."),
  website: z.string(),
});

type Values = z.infer<typeof schema>;
const EMPTY: Values = { name: "", email: "", events: [], notes: "", website: "" };

export function GamedayEvents() {
  const { content, settled } = useGamedayContent();
  const now = useNow();
  const ended = MARATHON ? hasEventEnded(MARATHON, now) : false;
  const events = content.signups;
  const formEvents = events.filter((e) => !e.link);
  // Rows that link an Extra Life incentive show its live spots-left count.
  const stock = useIncentiveStock(events.flatMap((e) => [e.link, ...e.details.map((p) => p.url)]));

  const [done, setDone] = useState<string[] | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      await submitGamedaySignup(values);
      setDone(values.events);
      reset(EMPTY);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <a
            href={HOME}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
          >
            <ArrowLeft className="size-4" /> Back to home
          </a>

          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Game Day sign-ups
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Game Day Events
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
              Grab a seat at the events running during our 24-hour marathon. Some sign up through
              their own link; for the rest, use the form at the bottom of this page.
            </p>
            <a
              href={`${HOME}#gameday-schedule`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal underline-offset-4 hover:underline"
            >
              <CalendarClock className="size-4" /> See the full Game Day schedule
            </a>
          </div>

          {ended && (
            <div className="mb-8 rounded-2xl border border-line bg-paper px-5 py-4 text-center text-sm font-semibold text-ink-soft shadow-[var(--shadow-soft)]">
              Game Day has wrapped, so sign-ups are closed. Thanks to everyone who played!
            </div>
          )}

          {!settled ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-line text-sm font-semibold text-ink-soft">
              Loading the events&hellip;
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-2xl font-extrabold text-ink">Sign-ups open soon</h2>
              <p className="mt-2 text-sm text-ink-soft sm:text-base">
                We&rsquo;re still lining up Game Day events. Check back here soon.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4">
              {events.map((e, i) => {
                const inc = incentiveOf(e.link, e.details);
                const spots = inc ? stock.get(inc.incentiveID) : undefined;
                const full = spots ? spots.left <= 0 : false;
                return (
                  <li
                    key={`${e.event}-${i}`}
                    className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                        {e.event}
                      </h2>
                      {(e.when || spots) && (
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-extrabold text-magenta">
                          {e.when}
                          <SpotsChip stock={spots} />
                        </p>
                      )}
                      {e.details.length > 0 && (
                        <p className="mt-2 whitespace-pre-line break-words text-sm text-ink-soft">
                          <RichText parts={e.details} />
                        </p>
                      )}
                    </div>
                    {!ended &&
                      (e.link && full ? (
                        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-line px-5 py-2.5 text-sm font-extrabold text-ink-soft">
                          Full
                        </span>
                      ) : e.link ? (
                        <a
                          href={e.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
                        >
                          Sign up <ExternalLink className="size-4" />
                        </a>
                      ) : (
                        <a
                          href="#signup-form"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-teal px-5 py-2 text-sm font-extrabold text-teal transition-all hover:bg-teal hover:text-white"
                        >
                          Sign up below
                        </a>
                      ))}
                  </li>
                );
              })}
            </ul>
          )}

          {settled && formEvents.length > 0 && !ended && (
            <div id="signup-form" className="mt-12 scroll-mt-24">
              <h2 className="mb-4 text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">
                Sign up here
              </h2>
              {done ? (
                <div className="flex flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
                  <span className="flex size-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                    <PartyPopper className="size-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">
                    You&rsquo;re signed up!
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft sm:text-base">
                    We&rsquo;ve got you down for {done.join(", ")}. See you on Game Day!
                  </p>
                  <button
                    type="button"
                    onClick={() => setDone(null)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
                  >
                    Sign up for more
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="rounded-3xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-8"
                >
                  <div className="grid gap-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass} htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          autoComplete="name"
                          className={fieldClass}
                          {...register("name")}
                        />
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
                          placeholder="you@example.com"
                          className={fieldClass}
                          {...register("email")}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                      </div>
                    </div>

                    <fieldset>
                      <legend className={labelClass}>
                        Events <span className="font-semibold text-ink-soft">(pick any)</span>
                      </legend>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {formEvents.map((e) => (
                          <label key={e.event} className={checkClass}>
                            <input
                              type="checkbox"
                              value={e.event}
                              className={boxClass}
                              {...register("events")}
                            />
                            <span>
                              {e.event}
                              {e.when && (
                                <span className="block text-xs font-bold text-magenta">
                                  {e.when}
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.events && <p className={errorClass}>{errors.events.message}</p>}
                    </fieldset>

                    <div>
                      <label className={labelClass} htmlFor="notes">
                        Notes <span className="font-semibold text-ink-soft">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Anything we should know? Experience level, who you're coming with…"
                        className={fieldClass}
                        {...register("notes")}
                      />
                      {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
                    </div>

                    {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register("website")}
                      />
                    </div>
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
                        <Swords className="size-4" /> Sign me up
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs text-ink-soft">
                    <Check className="mr-1 inline size-3.5 align-[-2px] text-teal" aria-hidden />
                    Signing up again with the same email updates your picks.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
