// PLATFORM DATA — KEEP DYNAMIC.
// Canonical WebSerbisyo Event Website Data Model (Contract V1).

export type GuestbookMessage = {
  id?: string | number | null;
  guestName: string;
  message: string;
  submittedAt?: string | null;
  approvedAt?: string | null;
};

export type PublicMediaAsset = {
  slot?: string | null;
  url?: string | null;
  src?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export type NormalizedSection = {
  key: string;
  title?: string;
  enabled: boolean;
  content: Record<string, unknown>;
};

// host_info (Couple)
export type CoupleData = {
  kind?: "wedding";
  groomName: string;
  brideName: string;
  displayAs?: "groom_first" | "bride_first";
  hostLine?: string;
  shortHostMessage?: string;
};

// countdown
export type CountdownData = {
  title?: string;
  shortNote?: string;
  targetDate?: string;
  enabled: boolean;
};

// music_effects
export type MusicData = {
  musicLink?: string;
  musicTitle?: string;
  playButtonLabel?: string;
  shortNote?: string;
};

// main_event (Ceremony)
export type CeremonyData = {
  eventLabel?: string;
  eventDate?: string;
  eventTime?: string;
  endTime?: string;
  rsvpDeadline?: string;
  scheduleNote?: string;
};

// venue (Location)
export type VenueData = {
  venueName: string;
  address: string;
  mapsLink?: string;
  arrivalNote?: string;
};

// secondary_event (Reception)
export type ReceptionData = {
  title?: string;
  venueName?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  mapsLink?: string;
  note?: string;
};

// timeline_program
export type TimelineItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
};

export type TimelineData = {
  sectionTitle?: string;
  sectionIntro?: string;
  items: TimelineItem[];
};

// entourage
export type EntourageGroup = {
  id: string;
  groupTitle: string;
  names: string;
};

export type EntourageData = {
  introLine?: string;
  groups: EntourageGroup[];
};

// principal_sponsors
export type SponsorsData = {
  introLine?: string;
  names: string;
};

// attire_motif
export type AttireData = {
  sectionIntro?: string;
  dressCodeNote?: string;
  colorMotifNote?: string;
};

// extra_info
export type ExtraInfoItem = {
  id: string;
  title: string;
  details: string;
};

export type ExtraInfoData = {
  sectionTitle?: string;
  sectionIntro?: string;
  items: ExtraInfoItem[];
};

// rsvp_form
export type RsvpData = {
  enabled: boolean;
  deadline?: string;
  deadlineLabel?: string;
  note?: string;
  plusOneEnabled: boolean;
  companionLimit: number;
  companionNameEnabled: boolean;
  companionAgeEnabled: boolean;
  emailEnabled: boolean;
  emailRequired: boolean;
  phoneEnabled: boolean;
  phoneRequired: boolean;
  foodAllergiesEnabled: boolean;
  messageToHostEnabled: boolean;
  customQuestions?: Array<unknown>;
};

// gift_details (Max 2 options)
export type GiftOptionImage = {
  url: string;
  alt?: string;
};

export type GiftOption = {
  id: string;
  title: string;
  accountName?: string;
  accountNumber?: string;
  image?: GiftOptionImage | null;
};

export type GiftsData = {
  sectionIntro?: string;
  giftNote?: string;
  options: GiftOption[];
};

// guestbook
export type GuestbookData = {
  sectionTitle?: string;
  sectionIntro?: string;
  emptyStateMessage?: string;
  messages: GuestbookMessage[];
};

// story_message (Scalar narrative)
export type LoveStoryData = {
  storyTitle?: string;
  sectionIntro?: string;
  storyBody?: string;
};

// contact_socials
export type ContactData = {
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tikTokUrl?: string;
};

// eighteen_roses_candles
export type TraditionEntry = {
  id: string;
  name: string;
  message?: string;
};

export type TraditionGroup = {
  id: string;
  title: string;
  kind?: string;
  entries: TraditionEntry[];
};

export type TraditionsData = {
  groups: TraditionGroup[];
};

// debut_court
export type DebutCourtMember = {
  id: string;
  name: string;
};

export type DebutCourtGroup = {
  id: string;
  title: string;
  names: DebutCourtMember[];
};

export type DebutCourtData = {
  groups: DebutCourtGroup[];
};

// godparents
export type GodparentMember = {
  id: string;
  name: string;
};

export type GodparentsGroup = {
  id: string;
  title: string;
  names: GodparentMember[];
};

export type GodparentsData = {
  groups: GodparentsGroup[];
};

// gallery (Metadata only; photos are local template assets)
export type GalleryData = {
  sectionTitle?: string;
  sectionIntro?: string;
};

// TOP-LEVEL WEDDING TEMPLATE DATA
export type WeddingTemplateData = {
  contractVersion: number;
  source: "demo" | "snapshot" | "live";
  previewMode?: "dashboard";
  eventSlug: string;
  title: string;
  coupleDisplayName: string; // Derived display representation via deriveCoupleIdentity()
  eventDate?: string | null;
  eventDateLabel?: string | null;
  eventTimeLabel?: string | null;
  eventDateTimeLabel?: string | null;
  rsvpDeadlineLabel?: string | null;
  timezone?: string | null;
  publicUrl?: string | null;

  couple: CoupleData;
  countdown: CountdownData;
  music: MusicData;
  ceremony: CeremonyData;
  venue: VenueData;
  reception: ReceptionData;
  timeline: TimelineData;
  entourage: EntourageData;
  sponsors: SponsorsData;
  attire: AttireData;
  extraInfo: ExtraInfoData;
  rsvp: RsvpData;
  gifts: GiftsData;
  guestbook: GuestbookData;
  story: LoveStoryData;
  contact: ContactData;
  traditions: TraditionsData;
  debutCourt: DebutCourtData;
  godparents: GodparentsData;
  gallery: GalleryData;

  sections: NormalizedSection[];
  orderedSectionKeys: string[];
  enabledSectionKeys: string[];

  assets?: Record<string, PublicMediaAsset>;
  raw?: Record<string, unknown>;
};
