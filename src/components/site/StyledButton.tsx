import type { LucideIcon } from "lucide-react";

interface StyledButtonProps {
  icon: LucideIcon;
  text: string;
  highlight: string;
  iconPosition?: "left" | "right";
  iconBg?: string;
  gradientFrom?: string;
  gradientTo?: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function StyledButton({
  icon: Icon,
  text,
  highlight,
  iconPosition = "left",
  iconBg = "bg-magenta",
  gradientFrom = "from-magenta",
  gradientTo = "to-orange",
  href,
  onClick,
  target,
  rel,
}: StyledButtonProps) {
  const iconEl = (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-full text-white transition-transform group-hover:scale-110 ${iconBg}`}
    >
      <Icon className="size-5" />
    </span>
  );

  const labelEl = (
    <span className="font-display text-base font-extrabold tracking-tight text-ink sm:text-lg">
      {text}{" "}
      <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
        {highlight}
      </span>
    </span>
  );

  const className =
    "group inline-flex items-center gap-3 rounded-full border-2 border-magenta/30 bg-white px-5 py-3 text-left shadow-[var(--shadow-soft)] transition-all hover:border-magenta hover:shadow-[var(--shadow-lift)]";
  const ariaLabel = `${text} ${highlight}`;
  const content = iconPosition === "left" ? [iconEl, labelEl] : [labelEl, iconEl];

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={className} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
