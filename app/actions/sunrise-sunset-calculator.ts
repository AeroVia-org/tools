"use server";

import type { Coordinates, SunData } from "../tools/(tools)/sunrise-sunset-calculator/types";

// type TimeZone = "UTC" | "Local" | "Location" | { tzid: string };

interface LocationResponseItem {
  lat: string;
  lon: string;
  importance: number;
}

interface SunriseSunsetResponse {
  status: string;
  results: {
    sunrise: string;
    sunset: string;
  };
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Parses a time string into a Date object.
 * @param date The date giving the correct day, month and year.
 * @param time The time in the format of "H:MM:SS (AM/PM)"
 */
function parseTime(date: Date, time: string): Date {
  const [hours, minutes, seconds] = time.split(" ")[0].split(":").map(Number);
  const isPM = time.includes("PM");
  const hour = isPM ? (hours % 12 + 12) : (hours % 12);
  const minute = minutes;
  const second = seconds;
  const parsedDate = new Date(date);
  parsedDate.setHours(hour, minute, second);
  return parsedDate;
}

function getLocationApiUrl(location: string) {
  return `https://nominatim.openstreetmap.org/search?q=${location}&format=json`;
}

function getSunriseApiUrl(latitude: number, longitude: number, date: string) {
  return `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}`;
}

async function getCoordinatesFromLocation(location: string): Promise<Coordinates> {
  const response = await fetch(getLocationApiUrl(location));
  const data: LocationResponseItem[] = await response.json();
  if (data.length === 0) throw new Error(`No location found for ${location}`);
  const mostImportantLocation = data.sort((a, b) => b.importance - a.importance)[0];
  return {
    latitude: parseFloat(mostImportantLocation.lat),
    longitude: parseFloat(mostImportantLocation.lon),
  };
}

export async function getSunDataFromLatitudeAndLongitude(latitude: number, longitude: number, date?: Date): Promise<SunData> {
  const givenDate = date ?? new Date();
  const formattedDate = formatDate(givenDate);
  const response = await fetch(getSunriseApiUrl(latitude, longitude, formattedDate));
  const data: SunriseSunsetResponse = await response.json();
  if (data.status !== "OK") throw new Error(`Failed to get sunrise/sunset data for ${latitude}, ${longitude} on ${formattedDate}: ${data.status}`);
  return {
    sunrise: parseTime(givenDate, data.results.sunrise),
    sunset: parseTime(givenDate, data.results.sunset),
  };
}

export async function getSunDataFromLocation(location: string, date?: Date): Promise<SunData> {
  const coordinates = await getCoordinatesFromLocation(location);
  return await getSunDataFromLatitudeAndLongitude(coordinates.latitude, coordinates.longitude, date);
}