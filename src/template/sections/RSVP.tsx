"use client";

import { useState } from "react";
import type { RsvpData } from "@/platform/wedding-template-data";
import { submitRsvp, type PublicRsvpPayload } from "@/platform/submit-rsvp";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// PLATFORM ACTION — DO NOT REIMPLEMENT.
// Keep submission through the shared platform adapter.

// PLATFORM VISIBILITY.
// Respect dashboard state.

type RsvpSectionProps = {
  data: RsvpData;
  eventSlug: string;
  apiBaseUrl?: string;
  accessToken?: string | null;
  isDemoMode?: boolean;
};

export function RSVPSection({
  data,
  eventSlug,
  apiBaseUrl,
  accessToken,
  isDemoMode,
}: RsvpSectionProps) {
  const [guestName, setGuestName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "not_attending">(
    "attending"
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companionCount, setCompanionCount] = useState<number>(0);
  const [companions, setCompanions] = useState<Array<{ fullName: string; ageLabel: string }>>([]);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!data.enabled) return null;

  const maxCompanions = Math.max(0, Math.min(data.companionLimit ?? 3, 10));

  const handleCompanionCountChange = (count: number) => {
    setCompanionCount(count);
    const newCompanions = [...companions];
    if (count > newCompanions.length) {
      for (let i = newCompanions.length; i < count; i++) {
        newCompanions.push({ fullName: "", ageLabel: "Adult" });
      }
    } else {
      newCompanions.splice(count);
    }
    setCompanions(newCompanions);
  };

  const updateCompanion = (index: number, field: "fullName" | "ageLabel", value: string) => {
    const updated = [...companions];
    if (updated[index]) {
      updated[index][field] = value;
      setCompanions(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (data.emailRequired && !email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (data.phoneRequired && !phone.trim()) {
      setErrorMsg("Please enter your mobile phone number.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const payload: PublicRsvpPayload = {
      guestName: guestName.trim(),
      attendanceStatus,
      email: data.emailEnabled && email.trim() ? email.trim() : undefined,
      phone: data.phoneEnabled && phone.trim() ? phone.trim() : undefined,
      companionCount: data.plusOneEnabled ? companionCount : 0,
      companions:
        data.plusOneEnabled && companions.length > 0
          ? companions.filter((c) => c.fullName.trim().length > 0)
          : undefined,
      dietaryNotes: data.foodAllergiesEnabled && dietaryNotes.trim() ? dietaryNotes.trim() : undefined,
      message: data.messageToHostEnabled && message.trim() ? message.trim() : undefined,
    };

    const result = await submitRsvp({
      eventSlug,
      payload,
      apiBaseUrl,
      accessToken,
      isDemoMode,
    });

    setSubmitting(false);

    if (result.error) {
      setErrorMsg(result.error.message || "Could not submit RSVP. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <section id="rsvp_form" className="template-section py-12 px-4 max-w-4xl mx-auto border-b border-gray-200">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Confirm Attendance</p>
        <h2 className="text-3xl font-bold text-gray-900">RSVP</h2>
        {data.deadlineLabel && (
          <p className="text-sm text-gray-600 mt-1">Please respond on or before {data.deadlineLabel}</p>
        )}
        {data.note && <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 italic">{data.note}</p>}
        {isDemoMode && (
          <div className="inline-block mt-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full">
            Demo Mode RSVP (Simulated Submission)
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-200 max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your RSVP response has been successfully received. We look forward to celebrating
              together!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="guestName"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your First and Last Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus("attending")}
                  className={`py-2 px-4 rounded-md text-sm font-medium border text-center transition-colors cursor-pointer ${
                    attendanceStatus === "attending"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceStatus("not_attending")}
                  className={`py-2 px-4 rounded-md text-sm font-medium border text-center transition-colors cursor-pointer ${
                    attendanceStatus === "not_attending"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {(data.emailEnabled || data.phoneEnabled) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.emailEnabled && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                      Email Address {data.emailRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required={data.emailRequired}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    />
                  </div>
                )}
                {data.phoneEnabled && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                      Mobile Number {data.phoneRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required={data.phoneRequired}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09170000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {data.plusOneEnabled && maxCompanions > 0 && attendanceStatus === "attending" && (
              <div className="pt-2 border-t border-gray-200">
                <label
                  htmlFor="companionCount"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Additional Companions
                </label>
                <select
                  id="companionCount"
                  value={companionCount}
                  onChange={(e) => handleCompanionCountChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                >
                  <option value={0}>0 (Just Me)</option>
                  {Array.from({ length: maxCompanions }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      +{num} Companion{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>

                {companions.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {companions.map((comp, idx) => (
                      <div key={idx} className="flex gap-2">
                        {data.companionNameEnabled && (
                          <input
                            type="text"
                            value={comp.fullName}
                            onChange={(e) => updateCompanion(idx, "fullName", e.target.value)}
                            placeholder={`Companion #${idx + 1} Name`}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                          />
                        )}
                        {data.companionAgeEnabled && (
                          <select
                            value={comp.ageLabel}
                            onChange={(e) => updateCompanion(idx, "ageLabel", e.target.value)}
                            className="w-28 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                          >
                            <option value="Adult">Adult</option>
                            <option value="Child">Child</option>
                            <option value="Infant">Infant</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {data.foodAllergiesEnabled && attendanceStatus === "attending" && (
              <div>
                <label
                  htmlFor="dietaryNotes"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Dietary Restrictions / Food Allergies
                </label>
                <input
                  id="dietaryNotes"
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="e.g. Vegetarian, Peanut allergy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                />
              </div>
            )}

            {data.messageToHostEnabled && (
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
                  Message for the Host
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a warm wish or note..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting RSVP...
                </>
              ) : (
                "Submit RSVP Response"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
