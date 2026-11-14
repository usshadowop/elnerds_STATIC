// The homepage is whichever template src/lib/homeTemplates.ts marks live
// (ACTIVE_HOME_TEMPLATE). The templates themselves are in src/pages/homeTemplates/,
// and /templates lists and previews them all.

import { ACTIVE_HOME_TEMPLATE } from "@/lib/homeTemplates";
import { HomeTemplatePage } from "@/pages/homeTemplates/HomeTemplatePage";

export function Home() {
  return <HomeTemplatePage slug={ACTIVE_HOME_TEMPLATE} />;
}
