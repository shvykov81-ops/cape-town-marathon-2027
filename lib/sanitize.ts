import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "ul", "ol", "li", "a", "h2", "h3",
];

const ALLOWED_ATTR = {
  a: ["href", "target", "rel"],
};

/**
 * Sanitize HTML bio content from TipTap / rich editor.
 * Only allows safe tags and attributes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
  });
}

/**
 * Strip all HTML tags — used for plain-text fallbacks / excerpts.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, { allowedTags: [] });
}
