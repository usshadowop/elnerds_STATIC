import { Check } from "lucide-react";

const newToExtraLife = [
  { text: "Click below on the 'Register on Extra-Life.org' button", strong: true },
  { text: "Fill out your name, email, and password" },
  { text: "Select Participant Type", note: "(Platinum sets you up to win swag at different donation levels)" },
  { text: "Click 'Continue to Next Step'" },
  { text: "Choose Minneapolis: MN-Gillette" },
];

const returningSteps = [
  { text: "Click below on the 'Log In To Extra-Life.org' button", strong: true },
  { text: "Once logged in, click here", href: "https://www.extra-life.org/index.cfm" },
  { text: "Select the \"Join a Team\" radio button and hit \"Save\"" },
];

export function Registration() {
  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Join Extra Life Nerds
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Registration Steps
            </h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-xl font-extrabold text-ink">
                If You&rsquo;re New to Extra Life
              </h2>
              <p className="mt-1 text-sm font-bold text-teal">Register at Extra-Life.org</p>

              <ul className="mt-6 space-y-4">
                {newToExtraLife.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm text-ink-soft sm:text-base">
                    <Check className="mt-0.5 size-5 shrink-0 text-teal" />
                    <span>
                      <span className={item.strong ? "font-extrabold text-ink" : ""}>{item.text}</span>
                      {item.note && <span className="mt-1 block text-xs italic text-ink-soft">{item.note}</span>}
                    </span>
                  </li>
                ))}
                <li className="flex gap-3 text-sm text-ink-soft sm:text-base">
                  <Check className="mt-0.5 size-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-ink">Complete:</strong> Contact info and profile
                  </span>
                </li>
              </ul>

              <a
                href="https://www.extra-life.org/index.cfm?fuseaction=register.start&eventID=562&teamID=73600&success=donordrive.team&successParameters=73600"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-full bg-teal px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
              >
                Register on Extra-Life.org
              </a>
            </div>

            <div className="flex flex-col rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-xl font-extrabold text-ink">
                If You&rsquo;ve Participated Before
              </h2>
              <p className="mt-1 text-sm font-bold text-orange">Log Into Extra-Life.org</p>

              <ul className="mt-6 space-y-4">
                {returningSteps.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm text-ink-soft sm:text-base">
                    <Check className="mt-0.5 size-5 shrink-0 text-teal" />
                    <span className={item.strong ? "font-extrabold text-ink" : ""}>
                      {item.href ? (
                        <>
                          Once logged in, click{" "}
                          <a href={item.href} target="_blank" rel="noreferrer" className="font-extrabold text-teal underline">
                            here
                          </a>
                        </>
                      ) : (
                        item.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://www.extra-life.org/"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-full bg-orange px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:brightness-110"
              >
                Log In To Extra-Life.org
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
