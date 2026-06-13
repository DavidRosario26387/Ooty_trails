import { handler, ok } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const POST = handler(async () => {
  clearSessionCookie();
  return ok({ loggedOut: true });
});
