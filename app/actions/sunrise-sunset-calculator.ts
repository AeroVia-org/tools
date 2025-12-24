"use server";

import { type AstronomyRequestData, type Coordinates, type AstronomyData } from "../tools/(tools)/sunrise-sunset-calculator/types";

interface AstronomyApiResponse {
  "location": {
    "location_string": string;
    "latitude": number;
    "longitude": number;
    "elevation": number;
  };
  "astronomy": {
    "date": string;
    "sunrise": string;
    "sunset": string;
    "moonrise": string;
    "moonset": string;
  };
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Parses a time string into a Date object.
 * @param date The date giving the correct day, month and year.
 * @param time The time in the format of "HH:MM" or "-:-"
 */
function parseTime(date: Date, time: string): Date | null {
  if (time === "-:-") return null;
  if (time.length > 5) {
    const [datePart, timePart] = time.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    const parsedDate = new Date(year, month - 1, day);
    parsedDate.setHours(hours, minutes, 0);
    return parsedDate;
  }
  const [hours, minutes] = time.split(":").map(Number);
  const parsedDate = new Date(date);
  parsedDate.setHours(hours, minutes, 0);
  return parsedDate;
}

function getAstronomyApiUrlForCoords(latitude: number, longitude: number, date: string): URL {
  const url = new URL("https://api.ipgeolocation.io/v2/astronomy");
  url.searchParams.set("apiKey", process.env.IPGEOLOCATION_API_KEY!);
  url.searchParams.set("lat", latitude.toString());
  url.searchParams.set("long", longitude.toString());
  url.searchParams.set("date", date);
  url.searchParams.set("time_zone", "UTC");
  return url;
}

function getAstronomyApiUrlForLocation(location: string, date: string): URL {
  const url = new URL("https://api.ipgeolocation.io/v2/astronomy");
  url.searchParams.set("apiKey", process.env.IPGEOLOCATION_API_KEY!);
  url.searchParams.set("location", location);
  url.searchParams.set("date", date);
  url.searchParams.set("time_zone", "UTC");
  return url;
}

function isCoordinates(location: AstronomyRequestData["location"]): location is Coordinates {
  return typeof location === "object" && location !== null && "latitude" in location && "longitude" in location;
}

export async function getAstronomyData(requestData: AstronomyRequestData): Promise<AstronomyData> {
  const url = isCoordinates(requestData.location)
    ? getAstronomyApiUrlForCoords(
        requestData.location.latitude,
        requestData.location.longitude,
        formatDate(requestData.date),
      )
    : getAstronomyApiUrlForLocation(requestData.location, formatDate(requestData.date));
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch astronomy data. Status: ${response.status} ${response.statusText}`);
  }
  const data: AstronomyApiResponse = await response.json();
  const responseDate = new Date(data.astronomy.date);
  return {
    sunrise: parseTime(responseDate, data.astronomy.sunrise),
    sunset: parseTime(responseDate, data.astronomy.sunset),
    moonrise: parseTime(responseDate, data.astronomy.moonrise),
    moonset: parseTime(responseDate, data.astronomy.moonset),
    latitude: data.location.latitude,
    longitude: data.location.longitude,
    location: data.location.location_string,
    date: responseDate,
  };
}
