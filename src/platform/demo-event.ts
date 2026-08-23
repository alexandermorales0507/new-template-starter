// PLATFORM DATA — KEEP DYNAMIC.
// Complete, rich, fictional demo birthday fixture for local design/demo mode.
// Michael's 10th Birthday • Avengers Theme

import type { EventTemplateData } from "./event-template-data";
import { EVENT_WEBSITE_SECTION_CONTRACT_VERSION } from "./contract";

export const DEMO_BIRTHDAY_DATA: EventTemplateData = {
  contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  source: "demo",
  eventType: "birthday",
  eventSlug: "michaels-10th-birthday",
  title: "Michael's 10th Birthday — Avengers Assemble!",
  coupleDisplayName: "Michael",
  eventDate: "2026-09-20T14:00:00Z",
  eventDateLabel: "September 20, 2026",
  eventTimeLabel: "2:00 PM",
  eventDateTimeLabel: "September 20, 2026 at 2:00 PM",
  rsvpDeadlineLabel: "September 10, 2026",
  timezone: "Asia/Manila",
  publicUrl: "https://webserbisyo.com/r/michaels-10th-birthday",

  couple: {
    kind: "birthday",
    groomName: "Michael Santos",
    brideName: "",
    celebrantName: "Michael Santos",
    milestoneAge: "10",
    nickname: "Mikey",
    displayAs: "Michael",
    hostLine: "TURNING 10",
    shortHostMessage: "You're invited to join the ultimate Avengers birthday adventure!",
  },

  countdown: {
    title: "Countdown to the Party",
    shortNote: "Avengers… Assemble!",
  },

  music: {
    musicLink: "https://www.youtube.com/watch?v=QwievZ1Tx-8",
    musicTitle: "The Avengers Theme (Epic Orchestral)",
    playButtonLabel: "Play Theme",
    shortNote: "The official soundtrack of our superhero celebration",
  },

  gallery: {
    sectionTitle: "Heroic Moments",
    sectionIntro: "Photos from past adventures and superhero training days.",
  },

  ceremony: {
    eventLabel: "The Birthday Celebration",
    eventDate: "2026-09-20",
    eventTime: "14:00",
    endTime: "15:30",
    rsvpDeadline: "2026-09-10T23:59",
    scheduleNote:
      "Please arrive 15 minutes before the party starts. Superhero costumes encouraged!",
  },

  venue: {
    venueName: "Stark Tower Play Arena",
    address: "Level 3, SM Seaside City Cebu, Cebu City",
    mapsLink: "https://maps.google.com/?q=SM+Seaside+Cebu",
    arrivalNote: "Free parking available at Level B2. Follow the Avengers signs to the party area.",
  },

  reception: {
    title: "Dinner & Party Celebration",
    venueName: "Stark Tower Play Arena — Banquet Hall",
    address: "Level 3, SM Seaside City Cebu, Cebu City",
    startTime: "16:00",
    endTime: "20:00",
    mapsLink: "https://maps.google.com/?q=SM+Seaside+Cebu",
    note: "Dinner buffet, games, and Avengers-themed activities await!",
  },

  timeline: {
    sectionTitle: "Party Program",
    sectionIntro: "The timeline for Michael's Avengers birthday adventure",
    items: [
      {
        id: "t1",
        time: "1:30 PM",
        title: "Guest Arrival & Registration",
        description: "Welcome loot bags and superhero mask station",
      },
      {
        id: "t2",
        time: "2:00 PM",
        title: "Opening Number & Welcome",
        description: "Avengers assemble! Michael's grand entrance",
      },
      {
        id: "t3",
        time: "2:30 PM",
        title: "Games & Activities",
        description: "Superhero relay race, shield toss, and trivia challenge",
      },
      {
        id: "t4",
        time: "3:30 PM",
        title: "Magic Show & Entertainment",
        description: "A special performance from Doctor Strange himself",
      },
      {
        id: "t5",
        time: "4:00 PM",
        title: "Dinner Buffet",
        description: "Avengers-themed feast and refreshments",
      },
      {
        id: "t6",
        time: "5:00 PM",
        title: "Cake Blowing & Birthday Song",
        description: "Michael's 10th birthday candle moment with the Avengers cake",
      },
      {
        id: "t7",
        time: "5:30 PM",
        title: "Dance Party & After-Games",
        description: "Open dance floor and final superhero photo booth",
      },
    ],
  },

  entourage: {
    introLine: "The heroes standing with Michael on his special day",
    groups: [
      {
        id: "grp-1",
        groupTitle: "Parents & Hosts",
        names: "Mr. David Santos\nMrs. Christine Santos",
      },
      {
        id: "grp-2",
        groupTitle: "Party Emcee",
        names: "Tito Marco Santos",
      },
      {
        id: "grp-3",
        groupTitle: "Avengers Squad",
        names: "Ethan Cruz\nJake Reyes\nSophia Lim\nChloe Torres",
      },
    ],
  },

  sponsors: {
    introLine: "Special thanks to the heroes who helped make this day possible",
    names:
      "Lolo Ricardo & Lola Teresa Santos\nNinong Carlo & Ninang Marie Reyes\nTito Jun & Tita Lia Cruz",
  },

  attire: {
    sectionIntro: "Come dressed as your favorite superhero!",
    dressCodeNote:
      "Superhero costumes, Avengers merch, or smart casual with red/blue/gold accents.",
    colorMotifNote:
      "Our party colors are Red, Royal Blue, and Gold — the classic Avengers palette.",
  },

  extraInfo: {
    sectionTitle: "Party Reminders",
    sectionIntro: "A few helpful notes for our guests",
    items: [
      {
        id: "info-1",
        title: "Costume Contest",
        details:
          "There will be a 'Best Avenger' costume contest with prizes! Come dressed to impress.",
      },
      {
        id: "info-2",
        title: "Allergies & Dietary Needs",
        details:
          "Please note any food allergies in your RSVP. We're happy to accommodate special dietary needs.",
      },
      {
        id: "info-3",
        title: "Photo & Video",
        details:
          "A professional photographer and a 360° photo booth will be available. Tag #MikeyTurns10 on social media!",
      },
    ],
  },

  rsvp: {
    plusOneEnabled: true,
    companionLimit: 2,
    companionNameEnabled: true,
    companionAgeEnabled: true,
    emailEnabled: true,
    emailRequired: false,
    phoneEnabled: true,
    phoneRequired: false,
    foodAllergiesEnabled: true,
    messageToHostEnabled: true,
    customQuestions: [],
  },

  gifts: {
    sectionIntro: "Your presence is the greatest gift for Michael!",
    giftNote:
      "If you wish to give a gift, Avengers toys, LEGO sets, or a small monetary gift for his savings fund would make his day.",
    options: [
      {
        id: "opt-1",
        title: "GCash",
        image: {
          path: "payment-qr-images/demo.png",
          url: "/template-assets/decorations/qr-demo.svg",
          alt: "GCash QR Code",
        },
      },
      {
        id: "opt-2",
        title: "Gift Registry Wishlist",
        image: null,
      },
    ],
  },

  guestbook: {
    sectionTitle: "Birthday Wishes",
    sectionIntro: "Send your superhero-level birthday greetings to Michael!",
    emptyStateMessage: "Approved birthday wishes will appear here soon.",
    messages: [
      {
        id: "1",
        guestName: "Lolo Ricardo & Lola Teresa",
        message:
          "Happy 10th birthday, Mikey! You are our little superhero. We love you to infinity and beyond!",
        submittedAt: "2026-09-01T10:00:00Z",
        approvedAt: "2026-09-01T12:00:00Z",
      },
      {
        id: "2",
        guestName: "Ethan & Jake",
        message: "Avengers assemble! Can't wait to party with you, Mikey! Best birthday ever! 🦸‍♂️",
        submittedAt: "2026-09-05T14:30:00Z",
        approvedAt: "2026-09-05T15:00:00Z",
      },
    ],
  },

  story: {
    storyTitle: "Michael's Story",
    sectionIntro: "A glimpse into our little hero's journey",
    storyBody:
      "From his first steps to his first superhero cape, Michael has always been our family's greatest adventure. Now turning 10, he's a kind, brave, and curious young hero who dreams of saving the world — one LEGO build at a time. We celebrate a decade of joy, laughter, and endless imagination.",
  },

  contact: {
    contactPerson: "Christine Santos",
    contactNumber: "+63 917 987 6543",
    email: "santosparty2026@gmail.com",
    facebookUrl: "https://facebook.com/santos.family",
    instagramUrl: "",
    tikTokUrl: "",
  },

  sections: [
    { key: "host_info", title: "Celebrant", enabled: true, content: {} },
    { key: "countdown", title: "Countdown", enabled: true, content: {} },
    { key: "music_effects", title: "Music", enabled: true, content: {} },
    { key: "main_event", title: "Celebration", enabled: true, content: {} },
    { key: "venue", title: "Venue", enabled: true, content: {} },
    { key: "secondary_event", title: "Dinner", enabled: true, content: {} },
    { key: "timeline_program", title: "Program", enabled: true, content: {} },
    { key: "entourage", title: "Court & Hosts", enabled: false, content: {} },
    { key: "principal_sponsors", title: "VIP Guests", enabled: true, content: {} },
    { key: "attire_motif", title: "Costume Guide", enabled: true, content: {} },
    { key: "extra_info", title: "Party Reminders", enabled: true, content: {} },
    { key: "story_message", title: "Story", enabled: true, content: {} },
    { key: "rsvp_form", title: "RSVP", enabled: true, content: {} },
    { key: "gift_details", title: "Gifts", enabled: true, content: {} },
    { key: "guestbook", title: "Wishes", enabled: true, content: {} },
    { key: "contact_socials", title: "Contact", enabled: true, content: {} },
    { key: "gallery", title: "Gallery", enabled: false, content: {} },
  ],

  orderedSectionKeys: [
    "host_info",
    "countdown",
    "music_effects",
    "story_message",
    "main_event",
    "venue",
    "secondary_event",
    "timeline_program",
    "principal_sponsors",
    "attire_motif",
    "extra_info",
    "rsvp_form",
    "gift_details",
    "guestbook",
    "contact_socials",
  ],

  enabledSectionKeys: [
    "host_info",
    "countdown",
    "music_effects",
    "story_message",
    "main_event",
    "venue",
    "secondary_event",
    "timeline_program",
    "principal_sponsors",
    "attire_motif",
    "extra_info",
    "rsvp_form",
    "gift_details",
    "guestbook",
    "contact_socials",
  ],

  assets: {},
};

export const DEMO_EVENT_DATA = DEMO_BIRTHDAY_DATA;
export const demoEventData = DEMO_EVENT_DATA;
export const DEMO_WEDDING_DATA = DEMO_EVENT_DATA;
export const demoWeddingData = DEMO_EVENT_DATA;
