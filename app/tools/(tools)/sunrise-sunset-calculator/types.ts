export type AstronomyData = {
  sunrise: Date | null;
  sunset: Date | null;
  moonrise: Date | null;
  moonset: Date | null;
  latitude: number;
  longitude: number;
  location: string;
  date: Date;
}

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type AstronomyRequestData = {
  location: string | Coordinates;
  date: Date;
}
