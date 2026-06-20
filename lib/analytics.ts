"use client";

// Safe analytics event tracking
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventParams);
  }
}

// Predefined events
export const AnalyticsEvents = {
  TRAINER_PROFILE_VIEW: "trainer_profile_view",
  TRAINER_SEARCH: "trainer_search",
  BOOKING_INITIATED: "booking_initiated",
  BOOKING_COMPLETED: "booking_completed",
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  LANGUAGE_SWITCH: "language_switch",
  TRAINER_APPLY: "trainer_apply",
  TRAINER_SUBMIT_PROFILE: "trainer_submit_profile",
  ADMIN_MODERATE: "admin_moderate",
  PACKAGE_VIEW: "package_view",
  NEWSLETTER_SUBSCRIBE: "newsletter_subscribe",
} as const;
