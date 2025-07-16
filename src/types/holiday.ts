import { AuthState } from "../core/auth/reducer";

export interface Holiday {
  start: string;
  end?: string;
  name?: string;
  half?: "first" | "last" | null;
  isBHoliday?: boolean;
  length?: number;
}

export interface HolidayMapEntry {
  hol: Holiday;
  length: number;
}

export interface HolidayState {
  holidays: Holiday[];
  bankHolidays: Holiday[];
  selected: {
    formattedDay: string;
  } | null;
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
  loading: boolean;
  data: {
    google_account: string;
  };
}

export interface RootState {
  dates: HolidayState;
  auth: {
    ww: AuthState;
  };
  config: ConfigState;
}

export interface Action {
  type: string;
  payload?: any;
}

export interface ServerData {
  text: {
    startMonth: number;
    currentYear: number;
    daysPerYear: number;
    carriedOver: Record<number, number>;
    holidays: Holiday[];
    bankHolidays: Holiday[];
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
