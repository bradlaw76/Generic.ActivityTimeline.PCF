import { addDays, clampDateRangeDays, isWithinLastDays, toDate } from "./DateUtils";

describe("DateUtils", () => {
    it("parses invalid dates to epoch", () => {
        expect(toDate("not-a-date").getTime()).toBe(0);
    });

    it("clamps date ranges to valid bounds", () => {
        expect(clampDateRangeDays(-4)).toBe(30);
        expect(clampDateRangeDays(9999)).toBe(3650);
    });

    it("detects whether value is within last N days", () => {
        const now = new Date("2026-02-20T00:00:00.000Z");
        const recent = addDays(now, -3);
        const older = addDays(now, -40);

        expect(isWithinLastDays(recent, 7, now)).toBe(true);
        expect(isWithinLastDays(older, 7, now)).toBe(false);
    });
});