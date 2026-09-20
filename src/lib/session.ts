import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth(allowedRoles?: string[]) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    if (session.user.role === "ADMIN") redirect("/admin");
    if (session.user.role === "SALON_OWNER") redirect("/salon/dashboard");
    redirect("/");
  }

  return session;
}
