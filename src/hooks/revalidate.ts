import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from "payload";

/**
 * Content is baked into statically generated pages, so a save in the admin has to
 * mark them stale — otherwise editors would wait for the next deploy to see changes.
 *
 * Every namespace feeds the shared message tree (any global can appear in the nav
 * or footer on any page), so we purge the whole tree rather than guess which routes
 * a given field touches.
 */
function purge() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Writes that don't come from a Next request — the seed script, the Payload
    // CLI, a cron job — have no render store to purge, and revalidatePath throws.
    // Nothing to do there: the next render reads the database fresh anyway.
  }
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  purge();
  return doc;
};

export const revalidateCollection: CollectionAfterChangeHook = ({ doc }) => {
  purge();
  return doc;
};
