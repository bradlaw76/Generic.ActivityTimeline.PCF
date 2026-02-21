import { sanitizeHtml, sanitizeInput, sanitizeText } from "./Sanitizer";

describe("Sanitizer", () => {
    it("escapes plain text", () => {
        expect(sanitizeText("<b>Hello</b>")).toBe("&lt;b&gt;Hello&lt;/b&gt;");
    });

    it("removes script tags from HTML", () => {
        expect(sanitizeHtml('<p>Safe</p><script>alert(1)</script>')).toBe("<p>Safe</p>");
    });

    it("sanitizes null input safely", () => {
        expect(sanitizeInput(null)).toBe("");
    });
});