import "server-only";

/** Builds a "Field: old → new" fragment, or null when nothing changed. */
export function diffField(label: string, oldValue: string, newValue: string): string | null {
    if (oldValue === newValue) return null;
    return `${label}: ${oldValue || "—"} → ${newValue || "—"}`;
}

/** Joins field diffs into one readable audit summary; falls back to "no changes" if empty. */
export function buildUpdateSummary(adminName: string, entityLabel: string, diffs: (string | null)[]): string {
    const changes = diffs.filter((diff): diff is string => Boolean(diff));

    if (changes.length === 0) {
        return `${adminName} updated ${entityLabel} (no field changes)`;
    }

    return `${adminName} updated ${entityLabel} — ${changes.join(", ")}`;
}
