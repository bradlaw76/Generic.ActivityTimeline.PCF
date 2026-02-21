import { normalizeType } from "./normalizeType";

describe("normalizeType", () => {
    it("normalizes known string activity types", () => {
        const result = normalizeType("email");
        expect(result.normalizedType).toBe("email");
        expect(result.displayName).toBe("Email");
    });

    it("normalizes known activity type code", () => {
        const result = normalizeType(4210);
        expect(result.normalizedType).toBe("phonecall");
        expect(result.displayName).toBe("Phone Call");
    });

    it("maps annotation entity to note", () => {
        const result = normalizeType("annotation", "annotation");
        expect(result.normalizedType).toBe("note");
    });
});