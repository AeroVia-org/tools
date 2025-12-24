"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MdMyLocation } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import OpenSourceCard from "../../components/OpenSourceCard";
import ToolTitle from "../../components/ToolTitle";
import Theory from "../../components/Theory";
import { Button } from "@/components/ui/button";
import tzLookup from "tz-lookup";
import { AstronomyData, Coordinates } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Moon, Sun } from "lucide-react";
import { format } from "date-fns";
import { getAstronomyData } from "@/app/actions/sunrise-sunset-calculator";

type ComputedQuantity = "sunrise" | "moonrise";
type LocationMode = "place" | "coordinates" | "current";
type TimezoneMode = "local" | "locationLocal" | "utc" | "tzid";

const fallbackTimezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function InfoBox({
  name,
  formattedTime,
  icon,
  color,
}: {
  name: string;
  formattedTime: [string, string];
  icon: React.ReactNode;
  color: "text-red-400" | "text-blue-300";
}) {
  return (
    <>
      <div className={`flex items-center gap-2 text-sm font-medium ${color}`}>
        {icon}
        {name}
      </div>
      <div className="text-foreground text-2xl font-semibold">{formattedTime[1]}</div>
      <p className="text-muted-foreground text-sm">{formattedTime[0]}</p>
    </>
  );
}

export default function SunriseSunsetCalculatorPage() {
  const [computedQuantity, setComputedQuantity] = useState<ComputedQuantity>("sunrise");
  const [locationMode, setLocationMode] = useState<LocationMode>("place");
  const [timezoneMode, setTimezoneMode] = useState<TimezoneMode>("utc");

  const timezoneOptions = useMemo(() => {
    try {
      // Modern browsers expose the full IANA list.
      const intlWithSupport = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
      const hasSupportedValuesOf = typeof intlWithSupport.supportedValuesOf === "function";
      return hasSupportedValuesOf ? intlWithSupport.supportedValuesOf!("timeZone") : fallbackTimezones;
    } catch {
      return fallbackTimezones;
    }
  }, []);

  const [timezoneId, setTimezoneId] = useState<string>(timezoneOptions[0] ?? "UTC");

  const [locationQuery, setLocationQuery] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [deviceCoordinates, setDeviceCoordinates] = useState<Coordinates | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "ready" | "error">("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AstronomyData | null>(null);

  const selectedTimeZone = useMemo(() => {
    switch (timezoneMode) {
      case "local":
        if (!deviceCoordinates) return "UTC";
        return tzLookup(deviceCoordinates.latitude, deviceCoordinates.longitude);
      case "locationLocal":
        try {
          if (!result) return "UTC";
          const parsedCoords = {
            latitude: result.latitude,
            longitude: result.longitude,
          };
          const tzid = tzLookup(parsedCoords.latitude, parsedCoords.longitude);
          return tzid;
        } catch (error) {
          return "UTC";
        }
      case "tzid":
        return timezoneId;
      default:
        return "UTC";
    }
  }, [timezoneMode, deviceCoordinates, timezoneId, result]);

  const timezonedDate = useCallback(
    (date: Date | null, fallbackDate: Date) => {
      const dateString = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
        timeZone: selectedTimeZone,
      }).format(date ?? fallbackDate);
      let [datePart, timePart] = dateString.split(", ");
      if (!date) timePart = '--:--';
      return [datePart, timePart] as [string, string];
    },
    [selectedTimeZone],
  );

  const requestDeviceCoordinates = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation is not available in this browser.");
      setDeviceCoordinates(null);
      return;
    }

    setGeoStatus("locating");
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const resolvedCoordinates: Coordinates = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setDeviceCoordinates(resolvedCoordinates);
        setLatitude(coords.latitude.toFixed(4));
        setLongitude(coords.longitude.toFixed(4));
        setGeoStatus("ready");
      },
      (err) => {
        setDeviceCoordinates(null);
        setGeoStatus("error");
        setGeoError(err.message || "Unable to retrieve current location.");
      },
    );
  }, []);

  // Resolve device coordinates once on load and cache the result.
  useEffect(() => {
    requestDeviceCoordinates();
  }, [requestDeviceCoordinates]);

  const handleUseCurrentLocation = useCallback(() => {
    if (deviceCoordinates) {
      setLatitude(deviceCoordinates.latitude.toFixed(4));
      setLongitude(deviceCoordinates.longitude.toFixed(4));
      setGeoStatus("ready");
      setGeoError(null);
    } else if (geoStatus !== "locating") {
      setGeoStatus("error");
      setGeoError("Current location not available.");
    }
  }, [deviceCoordinates, geoStatus]);

  useEffect(() => {
    if (locationMode === "current") {
      handleUseCurrentLocation();
    }
  }, [handleUseCurrentLocation, locationMode]);

  const handleCalculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      let result;
      if (locationMode === "place") {
        result = await getAstronomyData({ location: locationQuery, date: eventDate });
      } else if (locationMode === "coordinates") {
        result = await getAstronomyData({
          location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          date: eventDate,
        });
      } else if (locationMode === "current") {
        result = await getAstronomyData({ location: deviceCoordinates!, date: eventDate });
      }
      setResult(result!);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsCalculating(false);
    }
  }, [locationQuery, eventDate]);

  const modeLabel = computedQuantity === "sunrise" ? "Sunrise & Sunset" : "Moonrise & Moonset";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <ToolTitle toolKey="sunrise-sunset-calculator" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          <p className="text-muted-foreground mb-6">
            Switch between sunrise/sunset and moonrise/moonset, location sources, and time zones.
          </p>

          {/* Celestial Mode */}
          <div className="mb-6">
            <Label className="mb-1">Event Type</Label>
            <div className="bg-muted flex space-x-2 rounded-md p-1">
              {[
                { key: "sunrise", label: "Sunrise / Sunset", icon: Sun },
                { key: "moonrise", label: "Moonrise / Moonset", icon: Moon },
              ].map(({ key, label, icon: Icon }) => {
                const active = computedQuantity === key;
                return (
                  <button
                    key={key}
                    onClick={() => setComputedQuantity(key as ComputedQuantity)}
                    className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                      active
                        ? key === "sunrise"
                          ? "bg-card text-amber-400 shadow"
                          : "bg-card text-slate-200 shadow"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Mode */}
          <div className="mb-6">
            <Label className="mb-1">Location Source</Label>
            <div className="bg-muted flex space-x-2 rounded-md p-1">
              {[
                { key: "current", label: "Current location" },
                { key: "place", label: "Place name" },
                { key: "coordinates", label: "Latitude / Longitude" },
              ].map(({ key, label }) => {
                const active = locationMode === key;
                return (
                  <button
                    key={key}
                    onClick={() => setLocationMode(key as LocationMode)}
                    className={`w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                      active ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Inputs */}
          <div className="space-y-4">
            {locationMode === "place" && (
              <div>
                <Label htmlFor="location-name">Location</Label>
                <Input
                  id="location-name"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="e.g., London, UK"
                  className="mt-1"
                />
              </div>
            )}

            {locationMode === "coordinates" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 51.5074"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., -0.1278"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {locationMode === "current" && (
              <div className="rounded-md border border-dashed p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <MdMyLocation className="text-primary h-4 w-4" />
                  Using browser location
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                  <span>Lat: {deviceCoordinates?.latitude.toFixed(4) ?? "-"}</span>
                  <span>Lng: {deviceCoordinates?.longitude.toFixed(4) ?? "-"}</span>
                  <button
                    onClick={handleUseCurrentLocation}
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition"
                  >
                    Refresh
                  </button>
                </div>
                {geoStatus === "locating" && <p className="text-muted-foreground mt-2 text-sm">Locating…</p>}
                {geoStatus === "error" && geoError && (
                  <p className="text-destructive mt-2 text-sm">Unable to fetch location: {geoError}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Label htmlFor="date">Event Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                  {eventDate ? eventDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  captionLayout="dropdown"
                  startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 90)}
                  endMonth={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 90)}
                  onSelect={(date) => {
                    setEventDate(date ?? new Date());
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Timezone Mode */}
          <div className="mt-6">
            <Label className="mb-1">Timezone</Label>
            <div className="bg-muted flex flex-wrap gap-2 rounded-md p-1">
              {[
                { key: "local", label: "Local (device)" },
                { key: "locationLocal", label: "Local for location" },
                { key: "utc", label: "UTC" },
                { key: "tzid", label: "Timezone ID" },
              ].map(({ key, label }) => {
                const active = timezoneMode === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTimezoneMode(key as TimezoneMode)}
                    className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      active ? "bg-card text-primary shadow" : "text-muted-foreground hover:bg-accent"
                    }`}
                    disabled={key === "local" && !deviceCoordinates}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {timezoneMode === "tzid" && (
              <div className="mt-3">
                <Label htmlFor="timezone-id">Timezone ID</Label>
                <Select value={timezoneId} onValueChange={(value) => setTimezoneId(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {timezoneOptions.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <div>
                <p className="text-foreground mt-6 font-medium">Error</p>
                <p className="text-destructive mt-2 text-sm">{error}</p>
              </div>
            )}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={
              isCalculating ||
              (locationMode === "place" && locationQuery === "") ||
              (locationMode === "coordinates" && (latitude === "" || longitude === "")) ||
              (locationMode === "current" && !deviceCoordinates)
            }
            onClick={handleCalculate}
          >
            {isCalculating ? "Calculating..." : "Calculate"}
          </Button>
        </div>

        {/* Results Card */}
        <div className="border-border bg-card rounded-lg border p-6 shadow-lg">
          {result ? (
            <>
              <h2 className="text-foreground mb-4 text-lg font-semibold">{modeLabel}</h2>
              <div className="text-muted-foreground mb-4 text-sm">
                <p>
                  Timezone: <span className="text-foreground font-medium">{selectedTimeZone}</span>
                </p>
                <p>
                  Date: <span className="text-foreground font-medium">{format(result.date, "MMMM dd, yyyy")}</span>
                </p>
                <p>
                  Location: <span className="text-foreground font-medium">{result.location ?? "Unknown"}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border-border flex flex-col gap-2 rounded-lg border p-4">
                  {computedQuantity === "sunrise" ? (
                    <InfoBox name="Sunrise" formattedTime={timezonedDate(result.sunrise, eventDate)} icon={<Sun className="h-4 w-4" />} color="text-red-400" />
                  ) : (
                    <InfoBox name="Moonrise" formattedTime={timezonedDate(result.moonrise, eventDate)} icon={<Moon className="h-4 w-4" />} color="text-red-400" />
                  )}
                </div>

                <div className="border-border flex flex-col gap-2 rounded-lg border p-4">
                  {computedQuantity === "sunrise" ? (
                    <InfoBox name="Sunset" formattedTime={timezonedDate(result.sunset, eventDate)} icon={<Sun className="h-4 w-4" />} color="text-blue-300" />
                  ) : (
                    <InfoBox name="Moonset" formattedTime={timezonedDate(result.moonset, eventDate)} icon={<Moon className="h-4 w-4" />} color="text-blue-300" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="-translate-y-1/2 top-1/2 relative text-muted-foreground text-center">
              <p>The result will be displayed here after pressing the "Calculate" button.</p>
            </div>
          )}
        </div>
      </div>

      <Theory toolKey="sunrise-sunset-calculator" />
      <OpenSourceCard />
    </div>
  );
}
