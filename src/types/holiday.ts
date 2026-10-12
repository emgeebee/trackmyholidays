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

export interface HolidayMapEntry {
  hol: Holiday;
  length: number;
}

export interface SelectedDay {
  formattedDay: string;
  isBHoliday?: boolean;
}

export interface HolidayState {
  holidays: Holiday[];
  bankHolidays: Holiday[];
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
