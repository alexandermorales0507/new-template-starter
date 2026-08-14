// PLATFORM DATA — KEEP DYNAMIC.
// Complete, generic, fictional demo wedding fixture for local design/demo mode.

import type { WeddingTemplateData } from "./wedding-template-data";
import { EVENT_WEBSITE_SECTION_CONTRACT_VERSION } from "./contract";

export const DEMO_WEDDING_DATA: WeddingTemplateData = {
  contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  source: "demo",
  eventSlug: "alex-and-jamie-wedding",
  title: "Alex Rivera & Jamie Cruz Wedding",
  coupleDisplayName: "Alex & Jamie",
  eventDate: "2026-10-24T15:00:00Z",
  eventDateLabel: "October 24, 2026",
  eventTimeLabel: "3:00 PM",
  eventDateTimeLabel: "October 24, 2026 at 3:00 PM",
  rsvpDeadlineLabel: "September 24, 2026",
  timezone: "Asia/Manila",
  publicUrl: "https://webserbisyo.com/r/alex-and-jamie-wedding",

  couple: {
    kind: "wedding",
    groomName: "Alex Rivera",
    brideName: "Jamie Cruz",
    displayAs: "groom_first",
    hostLine: "Together with their families",
    shortHostMessage: "We are overjoyed to invite you to celebrate the beginning of our forever.",
  },

  countdown: {
    title: "Wedding Countdown",
    shortNote: "Until we say I do",
    targetDate: "2026-10-24T15:00:00Z",
    enabled: true,
  },

  music: {
    musicLink: "https://example.com/demo-audio.mp3",
    musicTitle: "A Thousand Years (Instrumental)",
    playButtonLabel: "Play Music",
    shortNote: "Background music composed for our wedding day",
  },

  gallery: {
    sectionTitle: "Our Moments",
    sectionIntro: "A glance through our favorite memories and adventures together.",
  },

  ceremony: {
    eventLabel: "The Holy Ceremony",
    eventDate: "October 24, 2026",
    eventTime: "3:00 PM",
    endTime: "4:30 PM",
    rsvpDeadline: "September 24, 2026",
    scheduleNote: "Please arrive 30 minutes prior to the start of the ceremony.",
  },

  venue: {
    venueName: "Sunset Bay Estate",
    address: "Brgy. Bucana, Nasugbu, Batangas",
    mapsLink: "https://maps.google.com/?q=Nasugbu+Batangas",
    arrivalNote: "Free guest parking is available inside the estate grounds.",
  },

  reception: {
    title: "Dinner & Celebration",
    venueName: "Sunset Bay Estate Pavilion",
    address: "Brgy. Bucana, Nasugbu, Batangas",
    startTime: "5:30 PM",
    endTime: "10:30 PM",
    mapsLink: "https://maps.google.com/?q=Nasugbu+Batangas",
    note: "Cocktail hour begins immediately following the ceremony.",
  },

  timeline: {
    sectionTitle: "Program & Timeline",
    sectionIntro: "Schedule of our wedding day",
    items: [
      {
        id: "t1",
        time: "2:30 PM",
        title: "Guest Arrival",
        description: "Welcome refreshments served at church courtyard",
      },
      {
        id: "t2",
        time: "3:00 PM",
        title: "Nuptial Mass",
        description: "Exchange of vows and solemn ceremony",
      },
      {
        id: "t3",
        time: "4:30 PM",
        title: "Photo Session",
        description: "Group photos with family and friends",
      },
      {
        id: "t4",
        time: "5:30 PM",
        title: "Cocktail Hour",
        description: "Appetizers and signature drinks at the Pavilion",
      },
      {
        id: "t5",
        time: "6:30 PM",
        title: "Grand Entrance & Dinner",
        description: "Welcome toast followed by dinner buffet",
      },
      {
        id: "t6",
        time: "8:00 PM",
        title: "Speeches & Dances",
        description: "Parent dances, cake cutting, and toasts",
      },
      {
        id: "t7",
        time: "9:00 PM",
        title: "Party & After-Hours",
        description: "Open dance floor and late-night snacks",
      },
    ],
  },

  entourage: {
    introLine: "Together with our dearest family and friends",
    groups: [
      {
        id: "grp-1",
        groupTitle: "Parents of the Groom",
        names: "Mr. Manuel Rivera\nMrs. Teresa Rivera",
      },
      {
        id: "grp-2",
        groupTitle: "Parents of the Bride",
        names: "Mr. Roberto Cruz\nMrs. Elena Cruz",
      },
      {
        id: "grp-3",
        groupTitle: "Best Man & Maid of Honor",
        names: "Carlos Rivera (Best Man)\nSofia Cruz (Maid of Honor)",
      },
      {
        id: "grp-4",
        groupTitle: "Groomsmen",
        names: "David Santos\nMark Tan\nGabriel Reyes",
      },
      {
        id: "grp-5",
        groupTitle: "Bridesmaids",
        names: "Patricia Luna\nRhea Mendoza\nBea Alonzo",
      },
      {
        id: "grp-6",
        groupTitle: "Flower Girls & Bearers",
        names: "Maya Rivera (Flower Girl)\nLeo Cruz (Ring Bearer)",
      },
    ],
  },

  sponsors: {
    introLine: "Guiding us in our new life together",
    names:
      "Atty. Fernando Gomez & Dr. Maria Gomez\nEngr. Richard Lim & Mrs. Victoria Lim\nMr. Antonio Santos & Mrs. Carmen Santos",
  },

  attire: {
    sectionIntro: "We would love to see you in your finest attire.",
    dressCodeNote:
      "Semi-Formal / Garden Elegant (Barong Tagalog or suit jacket for gentlemen; long formal dress or cocktail gown for ladies).",
    colorMotifNote: "We kindly request guests to avoid wearing solid white or ivory.",
  },

  extraInfo: {
    sectionTitle: "Good to Know",
    sectionIntro: "Important details for our guests",
    items: [
      {
        id: "info-1",
        title: "Unplugged Ceremony",
        details:
          "We invite you to be fully present during our ceremony. Please keep phones and cameras silenced and put away until the cocktail hour.",
      },
      {
        id: "info-2",
        title: "Shuttle Service",
        details:
          "A complimentary shuttle will depart from the Manila hotel at 1:15 PM and return after the reception at 10:30 PM.",
      },
      {
        id: "info-3",
        title: "Accommodations",
        details:
          "Special room rates are reserved at the Sunset Bay Resort for our wedding guests. Please reference Rivera-Cruz Wedding when booking.",
      },
    ],
  },

  rsvp: {
    enabled: true,
    deadline: "2026-09-24",
    deadlineLabel: "September 24, 2026",
    note: "Kindly respond on or before September 24, 2026 so we can finalize seating arrangements.",
    plusOneEnabled: true,
    companionLimit: 3,
    companionNameEnabled: true,
    companionAgeEnabled: true,
    emailEnabled: true,
    emailRequired: true,
    phoneEnabled: true,
    phoneRequired: true,
    foodAllergiesEnabled: true,
    messageToHostEnabled: true,
    customQuestions: [],
  },

  gifts: {
    sectionIntro: "Your presence at our wedding is the greatest gift of all.",
    giftNote:
      "Should you wish to honor us with a gift, a monetary contribution towards our new home would be deeply appreciated.",
    options: [
      {
        id: "opt-1",
        title: "GCash",
        accountName: "Alex R.",
        accountNumber: "0917-000-0000",
        image: {
          url: "/template-assets/decorations/qr-demo.svg",
          alt: "GCash QR Code",
        },
      },
      {
        id: "opt-2",
        title: "BPI Bank Transfer",
        accountName: "Alex Rivera",
        accountNumber: "1234-5678-90",
        image: null,
      },
    ],
  },

  guestbook: {
    sectionTitle: "Wishes & Blessings",
    sectionIntro: "Leave a warm message for our new beginning.",
    emptyStateMessage: "No approved messages yet. Check back soon!",
    messages: [
      {
        id: "1",
        guestName: "Uncle Robert & Aunt Clara",
        message: "Sending you both so much love as you begin this beautiful journey together!",
        submittedAt: "2026-08-01T10:00:00Z",
        approvedAt: "2026-08-01T12:00:00Z",
      },
      {
        id: "2",
        guestName: "David & Patricia",
        message: "Can't wait to celebrate on your big day! Wishing you a lifetime of joy.",
        submittedAt: "2026-08-05T14:30:00Z",
        approvedAt: "2026-08-05T15:00:00Z",
      },
    ],
  },

  story: {
    storyTitle: "Our Journey",
    sectionIntro: "A glance into our journey of love",
    storyBody:
      "From mutual friends on a hiking trail in Tagaytay to sunset walks in Batanes, our journey has been filled with laughter, adventure, and unwavering support. We are thrilled to begin our greatest adventure yet as husband and wife.",
  },

  contact: {
    contactPerson: "Alex Rivera & Jamie Cruz",
    contactNumber: "+63 917 123 4567",
    email: "alexandjamie2026@gmail.com",
    facebookUrl: "https://facebook.com/alexandjamie2026",
    instagramUrl: "https://instagram.com/alexandjamie2026",
    tikTokUrl: "https://tiktok.com/@alexandjamie2026",
  },

  traditions: {
    groups: [
      {
        id: "trad-1",
        title: "Traditional Sponsors",
        kind: "sponsors",
        entries: [
          { id: "e1", name: "Mark Tan & Bea Alonzo", message: "Candle Sponsors" },
          { id: "e2", name: "Gabriel Reyes & Rhea Mendoza", message: "Veil Sponsors" },
          { id: "e3", name: "David Santos & Patricia Luna", message: "Cord Sponsors" },
        ],
      },
    ],
  },

  debutCourt: {
    groups: [],
  },

  godparents: {
    groups: [],
  },

  sections: [
    { key: "host_info", title: "Couple", enabled: true, content: {} },
    { key: "countdown", title: "Countdown", enabled: true, content: {} },
    { key: "music_effects", title: "Music", enabled: true, content: {} },
    { key: "main_event", title: "Ceremony", enabled: true, content: {} },
    { key: "venue", title: "Venue", enabled: true, content: {} },
    { key: "secondary_event", title: "Reception", enabled: true, content: {} },
    { key: "timeline_program", title: "Timeline", enabled: true, content: {} },
    { key: "entourage", title: "Entourage", enabled: true, content: {} },
    { key: "principal_sponsors", title: "Sponsors", enabled: true, content: {} },
    { key: "attire_motif", title: "Attire", enabled: true, content: {} },
    { key: "extra_info", title: "Details", enabled: true, content: {} },
    { key: "story_message", title: "Story", enabled: true, content: {} },
    { key: "rsvp_form", title: "RSVP", enabled: true, content: {} },
    { key: "gift_details", title: "Gifts", enabled: true, content: {} },
    { key: "guestbook", title: "Guestbook", enabled: true, content: {} },
    { key: "contact_socials", title: "Contact", enabled: true, content: {} },
    { key: "gallery", title: "Gallery", enabled: false, content: {} },
    { key: "eighteen_roses_candles", title: "Traditions", enabled: false, content: {} },
    { key: "debut_court", title: "Debut Court", enabled: false, content: {} },
    { key: "godparents", title: "Godparents", enabled: false, content: {} },
  ],

  orderedSectionKeys: [
    "host_info",
    "countdown",
    "music_effects",
    "main_event",
    "venue",
    "secondary_event",
    "timeline_program",
    "entourage",
    "principal_sponsors",
    "attire_motif",
    "extra_info",
    "story_message",
    "rsvp_form",
    "gift_details",
    "guestbook",
    "contact_socials",
  ],

  enabledSectionKeys: [
    "host_info",
    "countdown",
    "music_effects",
    "main_event",
    "venue",
    "secondary_event",
    "timeline_program",
    "entourage",
    "principal_sponsors",
    "attire_motif",
    "extra_info",
    "story_message",
    "rsvp_form",
    "gift_details",
    "guestbook",
    "contact_socials",
  ],

  assets: {},
};

export const demoWeddingData = DEMO_WEDDING_DATA;
