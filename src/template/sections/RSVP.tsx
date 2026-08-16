"use client";

import { useState } from "react";
import type { RsvpData } from "@/platform/wedding-template-data";
import { BotanicalCornerPair } from "@/template/components/decorations/BotanicalCornerPair";
import { submitRsvp, type PublicRsvpPayload } from "@/platform/submit-rsvp";
import { formatRsvpDeadline } from "@/template/utils/event-formatting";
import { SectionFloralDivider } from "@/template/components/decorations/SectionFloralDivider";
import { CorrespondenceSheet } from "@/template/components/containers/CorrespondenceSheet";
import { Reveal } from "@/template/components/motion/Reveal";
import { Magnetic } from "@/template/components/motion/Magnetic";
import { CheckCircle2, AlertCircle, Loader2, Heart, Send, User, UserPlus } from "lucide-react";

// PLATFORM ACTION — DO NOT REIMPLEMENT.
// Keep submission through the shared platform adapter.
// PLATFORM VISIBILITY: Respect dashboard state.
// SAGE ESTATE FORMAL RESPONSE CARD (THE GLASSHOUSE LEDGER)

export type RsvpProps = {
  data: RsvpData;
  eventSlug: string;
  deadlineLabel?: string | null;
  apiBaseUrl?: string;
  accessToken?: string | null;
  isDemoMode?: boolean;
};

/**
 * Reusable RSVP Form component used across both in-page section and dedicated /rsvp route.
 */
export function RSVPForm({
  data,
  eventSlug,
  deadlineLabel,
  apiBaseUrl,
  accessToken,
  isDemoMode,
}: RsvpProps) {
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

  const formattedDeadline = formatRsvpDeadline(deadlineLabel);
  const maxCompanions = Math.max(0, Math.min(data.companionLimit ?? 1, 10));

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
      dietaryNotes:
        data.foodAllergiesEnabled && dietaryNotes.trim() ? dietaryNotes.trim() : undefined,
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
    <CorrespondenceSheet
      title="Formal Response Card"
      dateStamp={formattedDeadline ? `DUE BY ${formattedDeadline.toUpperCase()}` : "ESTATE ARCHIVE"}
      className="max-w-2xl mx-auto shadow-md"
    >
      {success ? (
        <div className="text-center py-10 space-y-3">
          <CheckCircle2 className="w-14 h-14 text-[var(--wedding-primary)] mx-auto" />
          <h3 className="text-2xl font-serif font-bold text-[var(--wedding-text)]">
            Response Recorded
          </h3>
          <p className="text-base text-[var(--wedding-text)] max-w-md mx-auto leading-relaxed font-sans">
            Your formal RSVP response has been registered in the estate ledger. We look forward to
            celebrating together!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2 font-sans">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="guestName"
              className="block text-sm font-semibold text-[var(--wedding-text)] mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="guestName"
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your First and Last Name"
              className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] transition-colors min-h-[46px]"
            />
          </div>

          {/* Attendance Choice */}
          <div>
            <label className="block text-sm font-semibold text-[var(--wedding-text)] mb-2">
              Will you attend? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttendanceStatus("attending")}
                className={`py-3.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[46px] ${
                  attendanceStatus === "attending"
                    ? "bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] border-[var(--wedding-primary)] shadow-sm"
                    : "bg-[var(--wedding-surface)] text-[var(--wedding-text)] border-[var(--wedding-border)] hover:bg-[var(--wedding-surface-alt)]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${attendanceStatus === "attending" ? "fill-white/20" : ""}`}
                />
                <span>Joyfully Accept</span>
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus("not_attending")}
                className={`py-3.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all cursor-pointer min-h-[46px] ${
                  attendanceStatus === "not_attending"
                    ? "bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] border-[var(--wedding-primary)] shadow-sm"
                    : "bg-[var(--wedding-surface)] text-[var(--wedding-text)] border-[var(--wedding-border)] hover:bg-[var(--wedding-surface-alt)]"
                }`}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Contact Fields */}
          {(data.emailEnabled || data.phoneEnabled) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.emailEnabled && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[var(--wedding-text)] mb-2"
                  >
                    Email Address {data.emailRequired && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required={data.emailRequired}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] min-h-[46px]"
                  />
                </div>
              )}
              {data.phoneEnabled && (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[var(--wedding-text)] mb-2"
                  >
                    Mobile Phone {data.phoneRequired && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required={data.phoneRequired}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09170000000"
                    className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] min-h-[46px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Additional Companions */}
          {data.plusOneEnabled && maxCompanions > 0 && attendanceStatus === "attending" && (
            <div className="pt-3 border-t border-[var(--wedding-border-subtle)] space-y-3">
              <label
                htmlFor="companionCount"
                className="block text-sm font-semibold text-[var(--wedding-text)] mb-1"
              >
                Additional Companions
              </label>

              {maxCompanions === 1 ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCompanionCountChange(0)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 cursor-pointer min-h-[44px] transition-all ${
                      companionCount === 0
                        ? "bg-[var(--wedding-surface-alt)] border-[var(--wedding-primary)] font-semibold text-[var(--wedding-text)] shadow-xs"
                        : "bg-[var(--wedding-surface)] border-[var(--wedding-border)] text-[var(--wedding-text-muted)]"
                    }`}
                  >
                    <User className="w-4 h-4 text-[var(--wedding-primary)]" />
                    <span>Solo Guest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompanionCountChange(1)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 cursor-pointer min-h-[44px] transition-all ${
                      companionCount === 1
                        ? "bg-[var(--wedding-surface-alt)] border-[var(--wedding-primary)] font-semibold text-[var(--wedding-text)] shadow-xs"
                        : "bg-[var(--wedding-surface)] border-[var(--wedding-border)] text-[var(--wedding-text-muted)]"
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-[var(--wedding-primary)]" />
                    <span>+1 Companion</span>
                  </button>
                </div>
              ) : (
                <select
                  id="companionCount"
                  value={companionCount}
                  onChange={(e) => handleCompanionCountChange(Number(e.target.value))}
                  className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] min-h-[46px]"
                >
                  <option value={0}>0 (Solo Guest)</option>
                  {Array.from({ length: maxCompanions }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      +{num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              )}

              {companions.length > 0 && (
                <div className="mt-3 space-y-3">
                  {companions.map((comp, idx) => (
                    <div key={idx} className="flex gap-2">
                      {data.companionNameEnabled && (
                        <input
                          type="text"
                          value={comp.fullName}
                          onChange={(e) => updateCompanion(idx, "fullName", e.target.value)}
                          placeholder={`Companion #${idx + 1} Full Name`}
                          className="flex-1 px-3.5 py-3 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] bg-[var(--wedding-surface)] min-h-[44px]"
                        />
                      )}
                      {data.companionAgeEnabled && (
                        <select
                          value={comp.ageLabel}
                          onChange={(e) => updateCompanion(idx, "ageLabel", e.target.value)}
                          className="w-32 px-3 py-3 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] bg-[var(--wedding-surface)] min-h-[44px]"
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

          {/* Dietary Restrictions */}
          {data.foodAllergiesEnabled && attendanceStatus === "attending" && (
            <div>
              <label
                htmlFor="dietaryNotes"
                className="block text-sm font-semibold text-[var(--wedding-text)] mb-2"
              >
                Dietary Restrictions / Food Allergies
              </label>
              <input
                id="dietaryNotes"
                type="text"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                placeholder="e.g. Vegetarian, Peanut allergy, Halal"
                className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] min-h-[46px]"
              />
            </div>
          )}

          {/* Message for Couple */}
          {data.messageToHostEnabled && (
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[var(--wedding-text)] mb-2"
              >
                Warm Note for the Couple
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your wishes or thoughts..."
                className="w-full px-4 py-3.5 border border-[var(--wedding-border)] rounded-xl text-base text-[var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary)] bg-[var(--wedding-surface)] min-h-[80px]"
              />
            </div>
          )}

          {/* Submit Action — Centered & Prominent */}
          <div className="pt-3 w-full max-w-sm mx-auto flex justify-center">
            <Magnetic intensity={0.15} className="block w-full">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-[var(--wedding-primary)] hover:bg-[var(--wedding-primary-hover)] text-[var(--wedding-on-primary)] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2.5 focus:outline-none template-focus-ring disabled:opacity-50 cursor-pointer shadow-md active:scale-98 min-h-[48px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit RSVP Response</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </form>
      )}
    </CorrespondenceSheet>
  );
}

/**
 * In-page RSVP Section component with Signature Botanical Framing.
 */
export function RSVPSection(props: RsvpProps) {
  const formattedDeadline = formatRsvpDeadline(props.deadlineLabel);

  return (
    <section
      id="rsvp_form"
      className="template-section section-surface-forest pattern-ledger-rule pattern-subtle pattern-dark relative overflow-x-clip pb-12 sm:pb-16"
    >
      <div className="template-container-narrow">
        <Reveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-role-subheading text-[var(--wedding-accent-soft)]">
              FOLIO // 11 &bull; RSVP CONFIRMATION
            </span>
            <h2 className="text-role-heading-major text-[var(--wedding-on-dark)] tracking-tight">
              RSVP
            </h2>
            {formattedDeadline && (
              <p className="text-base text-[var(--wedding-accent-soft)] mt-1 font-sans">
                Kindly respond on or before{" "}
                <strong className="font-semibold text-white">{formattedDeadline}</strong>
              </p>
            )}
            {props.isDemoMode && (
              <div className="inline-block mt-2 px-3 py-1 bg-[var(--wedding-accent-soft)]/20 border border-[var(--wedding-accent)]/50 text-[var(--wedding-on-dark)] text-xs font-mono rounded-full">
                Demo Mode RSVP (Simulated Submission)
              </div>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" distance={24} delay={0.1}>
          <div className="relative overflow-visible">
            {/* Signature LG Botanical Corner Pair at z-20 overlapping the paper edge */}
            <BotanicalCornerPair size="lg" />

            {/* Form Stage (Interactive Controls above florals, Sheet Paper at base) */}
            <div className="relative z-10">
              <RSVPForm {...props} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Boundary Threshold Divider: RSVP -> Gifts */}
      <SectionFloralDivider />
    </section>
  );
}
