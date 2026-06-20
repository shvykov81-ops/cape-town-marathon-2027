import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "ul", "ol", "li", "a", "h2", "h3",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Sanitize HTML bio content from TipTap / rich editor.
 * Only allows safe tags and attributes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Strip all HTML tags — used for plain-text fallbacks / excerpts.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}
