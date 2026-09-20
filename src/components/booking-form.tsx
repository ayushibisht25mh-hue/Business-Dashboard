"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Calendar, Scissors, Clock } from "lucide-react";

interface BookingFormProps {
  salonId: string;
  services: { id: string; name: string; price: number; duration: number }[];
  staff: { id: string; name: string; role: string }[];
  timeSlots: string[];
  isLoggedIn: boolean;
}

const STEPS = [
  { num: 1, label: "Service", icon: Scissors },
  { num: 2, label: "Time", icon: Calendar },
  { num: 3, label: "Confirm", icon: CheckCircle },
];

export function BookingForm({
  salonId,
  services,
  staff,
  timeSlots,
  isLoggedIn,
}: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState(timeSlots[0] || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  async function handleBook() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salonId,
        serviceId,
        staffId: staffId || undefined,
        date,
        startTime,
        notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Booking failed");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-xl shadow-emerald-100/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-emerald-900">
          Booking Requested!
        </h3>
        <p className="mt-2 text-sm text-emerald-700">
          The salon will confirm your appointment shortly.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/bookings")}>
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-5 text-white">
        <h3 className="font-display text-lg font-bold">Book Appointment</h3>
        <p className="mt-0.5 text-sm text-white/75">3 quick steps to confirm</p>
      </div>

      {/* Step indicator */}
      <div className="flex border-b border-slate-100 px-6 py-4">
        {STEPS.map(({ num, label, icon: Icon }) => (
          <div key={num} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                step >= num
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > num ? "✓" : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span
              className={`text-xs font-medium ${
                step >= num ? "text-brand-700" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-3">
            {services.map((service) => (
              <label
                key={service.id}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition ${
                  serviceId === service.id
                    ? "border-brand-500 bg-brand-50 shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={serviceId === service.id}
                    onChange={() => setServiceId(service.id)}
                    className="accent-brand-600"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{service.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {service.duration} min
                    </p>
                  </div>
                </div>
                <span className="font-display font-bold text-brand-700">
                  {formatPrice(service.price)}
                </span>
              </label>
            ))}
            <Button className="mt-2 w-full" size="lg" onClick={() => setStep(2)}>
              Continue →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {staff.length > 0 && (
              <div>
                <Label>Preferred Stylist</Label>
                <Select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  <option value="">Any available stylist</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Available Slots</Label>
              <div className="mt-2 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setStartTime(slot)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                      startTime === slot
                        ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" size="lg" onClick={() => setStep(3)}>
                Continue →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Booking Summary
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-slate-900">
                    {selectedService?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-semibold text-slate-900">
                    {date} · {startTime}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="font-display text-xl font-bold text-brand-700">
                    {formatPrice(selectedService?.price || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Label>Special Requests (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any preferences or notes..."
                rows={2}
              />
            </div>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking ✓"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
