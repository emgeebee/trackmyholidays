import { bankHolidayCountries } from "../../config";
import { RootState } from "../../types/holiday";
// import { createSelector } from 'reselect';

export const getIsConfig = (state: RootState) =>
  state ? state.config.configIsOpen : false;
export const getIsConfigLoading = (state: RootState) =>
  state ? state.config.loading : false;
export const getConfigData: (
  state: RootState
) => RootState["config"]["data"] = (state: RootState) =>
  state ? state.config.data : { google_account: "" };

export const getBankHolidayOptions = () =>
  Object.keys(bankHolidayCountries).map((key: string) => ({
    key,
    display:
      key in bankHolidayCountries
        ? bankHolidayCountries[key as keyof typeof bankHolidayCountries].display
        : "",
  }));
