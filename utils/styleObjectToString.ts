export default function styleObjectToString(styleObject: Record<string, string>): string {
  return Object.entries(styleObject)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}
