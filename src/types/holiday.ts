import type { UnknownAction } from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { AuthState } from "../core/auth/reducer";

export interface Holiday {
  start: string;
  end?: string;
  name?: string;
  half?: "first" | "last" | null;
  isBHoliday?: boolean;
  length?: number;
}

export interface NamedDay {
  start: string;
  name: string;
}

export interface HolidayMapEntry {
  hol: Holiday;
  length: number;
}

export interface SelectedDay {
  formattedDay: string;
  isBHoliday?: boolean;
  /** Set when the memorable-date dot (rather than the day itself) was clicked. */
  isMemorable?: boolean;
}

export type MemorableRepeat = "once" | "monthly" | "yearly";

/** A user-defined group of memorable dates, e.g. "Birthdays", with its own dot colour. */
export interface MemorableCalendar {
  id: string;
  name: string;
  /** CSS hex colour, e.g. "#ec4899". */
  colour: string;
}

export interface MemorableDate {
  id: string;
  calendarId: string;
  name: string;
  /** Anchor date in YYYY-MM-DD (full year so birth years before 2000 round-trip). */
  date: string;
  repeat: MemorableRepeat;
}

/** A memorable date resolved onto a specific calendar day. */
export interface MemorableOccurrence {
  entry: MemorableDate;
  calendar: MemorableCalendar;
  /** Day the occurrence falls on, formatted YY-MM-DD like the rest of the calendar. */
  day: string;
  /** Whole years since the anchor date for yearly repeats; 0 for the anchor year itself. */
  years: number;
}

export interface HolidayState {
  holidays: Holiday[];
  bankHolidays: Holiday[];
  memorableCalendars: MemorableCalendar[];
  memorableDates: MemorableDate[];
  selected: SelectedDay | null;
  startDay: string;
  endOfCurrent: string;
  currentYear: number;
  startMonth: number;
  daysPerYear: number;
  carriedOver: Record<number, number>;
  loading: boolean;
}

export interface ConfigState {
  configIsOpen: boolean;
  /** Tab the settings sheet opens on (index into the settings tab list). */
  configTab: number;
  loading: boolean;
  data: {
    google_account?: string;
    /** API Gateway base (stage path only), e.g. https://xxx.execute-api.region.amazonaws.com/prod */
    api_base_url?: string;
  };
}

export interface RootState {
  dates: HolidayState;
  auth: {
    ww: AuthState;
  };
  config: ConfigState;
  teams: TeamsState;
}

export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;

export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  undefined,
  UnknownAction
>;

export interface ServerData {
  text: {
    startMonth: number;
    currentYear: number;
    daysPerYear: number;
    carriedOver: Record<number, number>;
    holidays: Holiday[];
    bankHolidays: Holiday[];
    /** Absent for users whose data predates memorable dates. */
    memorableCalendars?: MemorableCalendar[];
    memorableDates?: MemorableDate[];
  };
}

export interface BankHolidayCountry {
  key: string;
  display: string;
  dates: Array<{
    name: string;
    start: string;
  }>;
}

export interface Team {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  email: string;
  role: "admin" | "member";
  status: "pending" | "active";
  joinedAt: string;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  email: string;
  invitedBy: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "declined";
  expiresAt: string;
  createdAt: string;
}

export interface TeamHoliday {
  userId: string;
  email: string;
  start: string;
  end?: string;
  name?: string;
  half?: "first" | "last" | null;
}

export interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  invites: TeamInvite[];
  teamHolidays: TeamHoliday[];
  loading: boolean;
  error: string | null;
}
