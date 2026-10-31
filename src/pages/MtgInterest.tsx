import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Check, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { MTG_FORMATS, MTG_INTEREST_LEVELS, submitMtgInterest } from "@/lib/mtgInterest";
import mtgLogo from "@/assets/logos/mtg-logo.jpg";

const HOME = import.meta.env.BASE_URL;

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:text-base";
const labelClass = "mb-1.5 block text-sm font-extrabold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-magenta";
const checkClass =
  "flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-bold text-ink shadow-sm transition has-[:checked]:border-teal has-[:checked]:bg-teal-soft sm:text-base";
const boxClass = "size-4 shrink-0 accent-teal";

const schema = z.object({
  email: z.string().trim().min(1, "Please enter your email.").email("That doesn't look like an email address."),
  formats: z.array(z.string()).min(1, "Pick at least one format."),
  interest: z.array(z.string()).min(1, "Pick at least one."),
  website: z.string(),
});

type Values = z.infer<typeof schema>;

export function MtgInterest() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", formats: [], interest: [], website: "" },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      await submitMtgInterest(values);
      setSubmitted(true);
      reset({ email: "", formats: [], interest: [], website: "" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-xl">
          <a
            href={HOME}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
          >
            <ArrowLeft className="size-4" /> Back to home
          </a>

          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Tap your mana
            </p>
            <h1 className="mx-auto max-w-sm">
              <img
                src={mtgLogo}
                alt="Interested in Magic: The Gathering?"
                width={764}
                height={401}
                className="h-auto w-full rounded-2xl shadow-[var(--shadow-soft)]"
              />
            </h1>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">
              We&rsquo;re gauging interest and working up ideas and events around Magic. Tell us
              what you play and we&rsquo;ll let you know about MTG-specific events and details.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                <Sparkles className="size-7" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">You&rsquo;re on the list!</h2>
              <p className="mt-2 text-sm text-ink-soft sm:text-base">
                Thanks! We&rsquo;ll reach out when there&rsquo;s something Magic-shaped to share.
              </p>
              <a
                href={HOME}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
              >
                Back to home
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-3xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-8"
            >
              <div className="grid gap-7">
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

                <fieldset>
                  <legend className={labelClass}>
                    Format interest <span className="font-semibold text-ink-soft">(pick any)</span>
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {MTG_FORMATS.map((format) => (
                      <label key={format} className={checkClass}>
                        <input type="checkbox" value={format} className={boxClass} {...register("formats")} />
                        {format}
                      </label>
                    ))}
                  </div>
                  {errors.formats && <p className={errorClass}>{errors.formats.message}</p>}
                </fieldset>

                <fieldset>
                  <legend className={labelClass}>
                    Type of interest <span className="font-semibold text-ink-soft">(pick any)</span>
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {MTG_INTEREST_LEVELS.map((level) => (
                      <label key={level} className={checkClass}>
                        <input type="checkbox" value={level} className={boxClass} {...register("interest")} />
                        {level}
                      </label>
                    ))}
                  </div>
                  {errors.interest && <p className={errorClass}>{errors.interest.message}</p>}
                </fieldset>

                {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
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
                    <WandSparkles className="size-4" /> I&rsquo;m interested
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-ink-soft">
                <Check className="mr-1 inline size-3.5 align-[-2px] text-teal" aria-hidden />
                We only use your email for Extra Life Nerds news.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
