declare module "tz-lookup" {
  /**
   * Resolve an IANA timezone name from geographic coordinates.
   */
  export default function tzLookup(latitude: number, longitude: number): string;
}

