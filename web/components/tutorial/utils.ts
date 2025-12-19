/**
 * Utility functions for challenge validation and comparison
 */

export const unwrapSingleValue = (value: unknown): unknown => {
  if (value == null) return value;
  if (Array.isArray(value) && value.length === 1) return value[0];
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 1) return entries[0]![1];
  }
  return value;
};

export const parseExpectedValue = (expected: string): unknown => {
  const trimmed = expected.trim();

  // Try JSON first (lets you store expected outputs as JSON objects/arrays too)
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // Handle "key: value" style expected outputs by comparing only the value
  const firstColon = trimmed.indexOf(":");
  if (firstColon !== -1) {
    return trimmed.slice(firstColon + 1).trim();
  }

  return trimmed;
};

export const normalizeForCompare = (value: unknown) => {
  const unwrapped = unwrapSingleValue(value);
  const str =
    typeof unwrapped === "string"
      ? unwrapped
      : unwrapped == null
        ? ""
        : typeof unwrapped === "object"
          ? JSON.stringify(unwrapped, null, 2)
          : String(unwrapped);

  return (
    str
      // normalize newlines
      .replace(/\r\n/g, "\n")
      // trim each line + drop extra empty lines at ends
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .trim()
  );
};

