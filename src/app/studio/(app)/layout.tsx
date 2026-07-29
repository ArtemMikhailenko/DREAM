import { redirect } from "next/navigation";
import { getSession } from "@/studio/lib/auth";
import { countByStatus } from "@/studio/lib/leads";
import { Shell } from "./Shell";

export default async function StudioAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  let leadsCount = 0;
  try {
    leadsCount = (await countByStatus()).new ?? 0;
  } catch {
    // DB unreachable — render the shell anyway; pages surface their own errors.
  }

  return (
    <Shell session={session} newLeads={leadsCount}>
      {children}
    </Shell>
  );
}
