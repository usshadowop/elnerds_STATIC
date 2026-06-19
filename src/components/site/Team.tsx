const teamMembers = [
  { name: "Troy Cleland", role: "Founder and Co-captain of Team Extra Life Nerds" },
  { name: "Jon Deckenbach", role: "Co-captain and recruiter extraordinaire" },
  { name: "Josh Oswald", role: "Co-captain and PVO (Positive Vibes Officer)" },
  { name: "Mike Richards", role: "Co-captain and spreadsheet maker" },
];

export function Team() {
  return (
    <section id="team" className="bg-cream px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Meet the Crew
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            Team Organization
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]"
            >
              <h3 className="font-display text-xl font-extrabold text-ink">
                {member.name}
              </h3>
              <p className="mt-2 text-sm font-bold text-ink-soft">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
