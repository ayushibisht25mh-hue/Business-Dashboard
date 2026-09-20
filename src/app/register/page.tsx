"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PASSWORD_RULES, validatePassword } from "@/lib/password";
import { Store, User } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "salon" ? "SALON_OWNER" : "CUSTOMER";

  const [role, setRole] = useState<"CUSTOMER" | "SALON_OWNER">(defaultRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    salonName: "",
    salonAddress: "",
    salonCity: "New Delhi",
    salonPhone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-2/5 hero-mesh lg:flex lg:flex-col lg:justify-center lg:p-12">
        <Logo variant="light" size="md" />
        <div className="mt-16">
          <h2 className="font-display text-3xl font-bold text-white">
            Join the Preppy community
          </h2>
          <p className="mt-3 text-white/70">
            {role === "CUSTOMER"
              ? "Discover and book the best salons near you."
              : "List your salon and reach thousands of customers."}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#fafbfc] px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Create account
            </h1>
            <p className="mt-2 text-slate-500">Get started in under a minute</p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            {/* Role toggle */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              {(["CUSTOMER", "SALON_OWNER"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
                    role === r
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {r === "CUSTOMER" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Store className="h-5 w-5" />
                  )}
                  <span className="text-sm font-semibold">
                    {r === "CUSTOMER" ? "Customer" : "Salon Owner"}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={8}
                  placeholder="Min 8 chars, 1 uppercase, 1 special"
                />
                <p className="mt-1.5 text-xs text-slate-500">{PASSWORD_RULES}</p>
              </div>

              {role === "SALON_OWNER" && (
                <div className="space-y-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                  <p className="text-sm font-semibold text-brand-800">
                    Salon Details
                  </p>
                  {[
                    { key: "salonName", label: "Salon Name" },
                    { key: "salonAddress", label: "Address" },
                    { key: "salonCity", label: "City" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label>{label}</Label>
                      <Input
                        value={form[key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
