import troyPhoto from "@/assets/team/Troy.PNG";
import jonDeckenbachPhoto from "@/assets/team/Jon_Dec.PNG";
import joshPhoto from "@/assets/team/Josh.PNG";
import mikePhoto from "@/assets/team/Mike.PNG";
import benPhoto from "@/assets/team/Ben.PNG";
import pamPhoto from "@/assets/team/Pam.PNG";
import grantPhoto from "@/assets/team/Grant.PNG";
import extraLifeLogo from "@/assets/logos/Controller_Wings.svg";

const teamMembers = [
  {
    name: "Troy Cleland",
    role: "Founder and Co-captain of Team Extra Life Nerds",
    photo: troyPhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/567940",
  },
  {
    name: "Jon Deckenbach",
    role: "Co-captain and recruiter extraordinaire",
    photo: jonDeckenbachPhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/566958",
  },
  {
    name: "Josh Oswald",
    role: "Co-captain and PVO (Positive Vibes Officer)",
    photo: joshPhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/566959",
  },
  {
    name: "Mike Richards",
    role: "Co-captain and spreadsheet maker",
    photo: mikePhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/568387",
  },
  {
    name: "Jon Holt",
    role: "Meeting organizer and team momentum maker",
    photo: null,
    extraLifeUrl: "https://www.extra-life.org/participants/572920",
  },
  {
    name: "Ben Stoddart",
    role: "D&D extraordinaire and local business contact",
    photo: benPhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/566961",
  },
  {
    name: "Pam van Muijen",
    role: "Business liaison and board game expert",
    photo: pamPhoto,
    extraLifeUrl: "https://www.extra-life.org/participants/Pam-vanMuijen",
  },
  {
    name: "Grant Gray",
    role: "Hospital contact and event champion",
    photo: grantPhoto,
    extraLifeUrl: null,
  },
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
              className="relative flex items-center gap-5 rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]"
            >
              {member.extraLifeUrl && (
                <a
                  href={member.extraLifeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name}'s Extra Life page`}
                  className="absolute right-4 top-4 transition-transform hover:scale-110"
                >
                  <img src={extraLifeLogo} alt="" className="size-24" />
                </a>
              )}
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="size-20 shrink-0 rounded-2xl border border-line object-cover"
                />
              ) : (
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-line bg-cream text-xs font-bold uppercase tracking-widest text-ink-soft">
                  Photo
                </div>
              )}
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink">
                  {member.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-ink-soft">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
