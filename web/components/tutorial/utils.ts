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

/**
 * Recursively extracts all primitive values from a nested structure.
 * This allows comparing results that have the same data but different shapes.
 *
 * Examples:
 * - { "count(...)": 4 } → [4]
 * - { "jellyfishes": { "count(...)": 4 } } → [4]
 * - { "a": 1, "b": 2 } → [1, 2]
 * - [1, 2, 3] → [1, 2, 3] (preserves order)
 * - [{ "x": 1 }, { "y": 2 }] → [1, 2]
 */
export const extractPrimitiveValues = (value: unknown): unknown[] => {
  if (value == null) {
    return [null];
  }

  // Primitive values (number, string, boolean)
  if (typeof value !== "object") {
    return [value];
  }

  // Arrays: recursively extract from each element, preserving order
  if (Array.isArray(value)) {
    return value.flatMap((item) => extractPrimitiveValues(item));
  }

  // Objects: recursively extract from all values (order doesn't matter for object keys)
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return Object.values(obj).flatMap((val) => extractPrimitiveValues(val));
  }

  return [];
};

/**
 * Normalizes primitive values for comparison by converting to comparable strings.
 * Handles numbers, strings, booleans, null, and arrays of primitives.
 */
const normalizePrimitive = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "number") {
    // Normalize numbers to avoid precision issues
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return String(value);
};

/**
 * Compares two values by extracting all primitive values and comparing them.
 * This allows matching results that have the same data but different structures.
 *
 * The comparison extracts all primitive values from nested structures and compares
 * them as sets (order doesn't matter), which handles cases like:
 * - { "count(...)": 4 } vs { "jellyfishes": { "count(...)": 4 } } → both extract to [4]
 * - { "a": 1, "b": 2 } vs { "b": 2, "a": 1 } → both extract to [1, 2]
 * - [1, 2, 3] vs [3, 2, 1] → both extract to [1, 2, 3], sorted comparison matches
 * - Different query shapes that return the same data in different orders
 *
 * Order is always ignored since Gelly queries can return values in different orders
 * depending on how they're written, but the actual data values should match.
 */
export const compareValuesSemantically = (
  actual: unknown,
  expected: unknown
): boolean => {
  const actualValues = extractPrimitiveValues(actual);
  const expectedValues = extractPrimitiveValues(expected);

  // If different number of values, they don't match
  if (actualValues.length !== expectedValues.length) {
    return false;
  }

  // If no values, both are empty/null
  if (actualValues.length === 0) {
    return true;
  }

  // Always compare as sets (order-independent) since different query shapes
  // can return the same values in different orders
  const actualNormalized = actualValues.map(normalizePrimitive).sort();
  const expectedNormalized = expectedValues.map(normalizePrimitive).sort();
  return (
    JSON.stringify(actualNormalized) === JSON.stringify(expectedNormalized)
  );
};

export const parseExpectedValue = (expected: string): unknown => {
  const trimmed = expected.trim();

  // Try JSON first (lets you store expected outputs as JSON objects/arrays too)
  // This is the recommended format for multiple values: {"key1": value1, "key2": value2}
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // Handle multiple "key: value" pairs separated by commas or newlines
  // Example: "count1: 4, count2: 5" or "count1: 4\ncount2: 5"
  // Only attempt this if there's a comma or newline (indicating multiple pairs)
  if (trimmed.includes(",") || trimmed.includes("\n")) {
    const result: Record<string, unknown> = {};
    // Split by comma or newline, but be careful with colons inside keys/values
    const pairs = trimmed
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Only proceed if we have multiple pairs and each has a colon
    if (pairs.length > 1 && pairs.every((p) => p.includes(":"))) {
      for (const pair of pairs) {
        const lastColon = pair.lastIndexOf(":");
        if (lastColon !== -1) {
          const key = pair.slice(0, lastColon).trim();
          const valueStr = pair.slice(lastColon + 1).trim();
          result[key] = parseSingleValue(valueStr);
        }
      }

      // Only return the object if we successfully parsed multiple pairs
      if (Object.keys(result).length > 1) {
        return result;
      }
    }
    // If parsing failed, fall through to single value parsing
  }

  // Handle single "key: value" style expected outputs
  // Use the LAST colon to handle cases like "count(..., where: condition): 4"
  // where the key itself contains colons
  const lastColon = trimmed.lastIndexOf(":");
  if (lastColon !== -1) {
    const valueStr = trimmed.slice(lastColon + 1).trim();
    return parseSingleValue(valueStr);
  }

  // If no colon, try to parse as number/boolean, otherwise return as string
  return parseSingleValue(trimmed);
};

/**
 * Helper to parse a single value string into a number, boolean, or string
 */
const parseSingleValue = (valueStr: string): unknown => {
  // Try to parse as a number if it looks like one
  const numValue = Number(valueStr);
  if (!isNaN(numValue) && valueStr !== "" && isFinite(numValue)) {
    return numValue;
  }
  // Try to parse as boolean
  if (valueStr.toLowerCase() === "true") return true;
  if (valueStr.toLowerCase() === "false") return false;
  // Return as string
  return valueStr;
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
