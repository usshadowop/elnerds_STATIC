// Renders a homepage template by slug: the live homepage (Home.tsx) and the
// /templates/<slug> previews (Templates.tsx) both go through here.

import type { HomeTemplateSlug } from "@/lib/homeTemplates";
import { GamedayWeekRunup } from "@/pages/homeTemplates/GamedayWeekRunup";
import { StandardDisplay } from "@/pages/homeTemplates/StandardDisplay";

export function HomeTemplatePage({ slug }: { slug: HomeTemplateSlug }) {
  if (slug === "standard-display") return <StandardDisplay />;
  return <GamedayWeekRunup />;
}
