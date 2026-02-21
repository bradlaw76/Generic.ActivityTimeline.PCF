export type CloudEnvironment = "commercial" | "gcc" | "gcchigh" | "dod" | "unknown";

export function detectCloudEnvironment(hostname?: string): CloudEnvironment {
    const host = (hostname ?? window.location.hostname).toLowerCase();

    if (host.includes("crm.appsplatform.us") || host.includes("crm.microsoftdynamics.us")) {
        if (host.includes("dod")) {
            return "dod";
        }

        if (host.includes("high")) {
            return "gcchigh";
        }

        return "gcc";
    }

    if (host.includes("dynamics.com") || host.includes("powerapps.com")) {
        return "commercial";
    }

    return "unknown";
}

export function isGccEnvironment(hostname?: string): boolean {
    const env = detectCloudEnvironment(hostname);
    return env === "gcc" || env === "gcchigh" || env === "dod";
}

export function isRestrictedCloud(hostname?: string): boolean {
    const env = detectCloudEnvironment(hostname);
    return env === "gcchigh" || env === "dod";
}