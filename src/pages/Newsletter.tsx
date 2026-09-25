import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Check, Loader2, Mail, PartyPopper } from "lucide-react";
import { submitNewsletter } from "@/lib/newsletter";

const HOME = import.meta.env.BASE_URL;

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:text-base";
const labelClass = "mb-1.5 block text-sm font-extrabold text-ink";
const errorClass = "mt-1 text-xs font-semibold text-magenta";

const schema = z.object({
  email: z.string().trim().min(1, "Please enter your email.").email("That doesn't look like an email address."),
  referral: z.string().trim().max(200, "Please keep this under 200 characters."),
  website: z.string(),
});

type Values = z.infer<typeof schema>;

/** `/newsletter?ref=Josh` pre-fills "Referred by", so members can share their own link. */
function referralFromUrl(): string {
  if (typeof window === "undefined") return "";
  return (new URLSearchParams(window.location.search).get("ref") ?? "").slice(0, 200);
}

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", referral: referralFromUrl(), website: "" },
  });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      await submitNewsletter(values);
      setSubmitted(true);
      reset({ email: "", referral: "", website: "" });
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
              Stay in the loop
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Newsletter
            </h1>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">
              Events, Game Day news and fundraising milestones for Gillette Children&rsquo;s
              Hospital, straight to your inbox. No spam — unsubscribe any time.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center rounded-3xl border border-line bg-paper p-10 text-center shadow-[var(--shadow-soft)]">
              <span className="flex size-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                <PartyPopper className="size-7" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">You&rsquo;re subscribed!</h2>
              <p className="mt-2 text-sm text-ink-soft sm:text-base">
                Thanks for signing up. You&rsquo;ll hear from us before our next event.
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
              <div className="grid gap-5">
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

                <div>
                  <label className={labelClass} htmlFor="referral">
                    Referred by <span className="font-semibold text-ink-soft">(optional)</span>
                  </label>
                  <input
                    id="referral"
                    type="text"
                    placeholder="Who told you about us?"
                    className={fieldClass}
                    {...register("referral")}
                  />
                  {errors.referral && <p className={errorClass}>{errors.referral.message}</p>}
                </div>

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
                    <Loader2 className="size-4 animate-spin" /> Signing you up&hellip;
                  </>
                ) : (
                  <>
                    <Mail className="size-4" /> Sign me up
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
