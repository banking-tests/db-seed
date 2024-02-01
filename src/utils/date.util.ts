import { DateTime, Interval } from "luxon";
import { getConfig } from "@/config";

const config = getConfig();
const tz = config.timezone;

export function create(date?: Date): DateTime {
  return date
    ? DateTime.fromJSDate(date).setZone(tz)
    : DateTime.now().setZone(tz);
}

export function getDatesBetween(startDate: Date, endDate: Date) {
  const start = create(startDate);
  const end = create(endDate);
  const interval = Interval.fromDateTimes(start, end);
  return interval
    .splitBy({ days: 1 })
    .map((d) => d.start?.toJSDate())
    .filter(Boolean);
}

export function getToday(): Date {
  return create().startOf("day").toJSDate();
}

export function get90DaysAgo(): Date {
  return create().minus({ days: 90 }).startOf("day").toJSDate();
}

export function getDaysDiff(date: Date): number {
  return Math.floor(create().diff(create(date), "days").days);
}

export function substractDays(date: Date, days: number): Date {
  return create(date).minus({ days }).toJSDate();
}

export function addDays(date: Date, days: number): Date {
  return create(date).plus({ days }).toJSDate();
}

export function addMinutes(date: Date, minutes: number): Date {
  return create(date).plus({ minutes }).toJSDate();
}

export function setTime(
  date: Date,
  hour: number,
  minute: number,
  second: number
): Date {
  return create(date).set({ hour, minute, second }).toJSDate();
}

export function addSeconds(date: Date, seconds: number): Date {
  return create(date).plus({ seconds }).toJSDate();
}
