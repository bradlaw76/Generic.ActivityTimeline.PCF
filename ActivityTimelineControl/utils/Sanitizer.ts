const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_ATTR_PATTERN = /\son\w+\s*=\s*(['"]).*?\1/gi;
const JAVASCRIPT_URI_PATTERN = /javascript:/gi;

export function sanitizeText(input: string | null | undefined): string {
    if (!input) {
        return "";
    }

    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function sanitizeHtml(input: string | null | undefined): string {
    if (!input) {
        return "";
    }

    return input
        .replace(SCRIPT_TAG_PATTERN, "")
        .replace(EVENT_HANDLER_ATTR_PATTERN, "")
        .replace(JAVASCRIPT_URI_PATTERN, "");
}

export function sanitizeInput(input: string | null | undefined): string {
    return sanitizeText(input);
}