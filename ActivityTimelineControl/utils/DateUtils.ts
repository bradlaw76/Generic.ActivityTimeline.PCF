import { ActivityNode } from "../models/ActivityNode";

export function toDate(value: Date | string | number): Date {
    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export function formatDate(value: Date | string | number, locale = "en-US"): string {
    const date = toDate(value);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString(locale, options);
}

export function formatDateTime(value: Date | string | number, locale = "en-US"): string {
    const date = toDate(value);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    };
    return date.toLocaleString(locale, options);
}

export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
    const left = toDate(date1);
    const right = toDate(date2);

    return left.getFullYear() === right.getFullYear() &&
           left.getMonth() === right.getMonth() &&
           left.getDate() === right.getDate();
}

export function addDays(date: Date | string | number, days: number): Date {
    const source = toDate(date);
    const result = new Date(source.getTime());
    result.setDate(result.getDate() + days);
    return result;
}

export function clampDateRangeDays(days: number): number {
    if (!Number.isFinite(days) || days <= 0) {
        return 30;
    }

    return Math.max(1, Math.min(3650, Math.floor(days)));
}

export function isWithinLastDays(value: Date | string | number, days: number, now = new Date()): boolean {
    const boundedDays = clampDateRangeDays(days);
    const candidate = toDate(value);
    const boundary = addDays(now, -boundedDays);
    return candidate >= boundary && candidate <= now;
}

export function sortByDateDescending(items: ActivityNode[]): ActivityNode[] {
    return [...items].sort((left, right) => right.date.getTime() - left.date.getTime());
}

export function isOlderThanDays(value: Date | string | number, days: number, now = new Date()): boolean {
    const boundedDays = clampDateRangeDays(days);
    const candidate = toDate(value);
    const boundary = addDays(now, -boundedDays);
    return candidate < boundary;
}

export function isSameDayLegacy(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}