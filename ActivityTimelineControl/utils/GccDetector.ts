// GccDetector.ts
export function isGccEnvironment(): boolean {
    return window.location.href.includes('.crm9.');
}

export function applyGccRestrictions(): void {
    if (isGccEnvironment()) {
        // Implement UI restrictions specific to GCC environments
        // For example, hide certain controls or disable features
    }
}