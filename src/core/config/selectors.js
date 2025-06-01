import { bankHolidayCountries } from "../../config";
// import { createSelector } from 'reselect';

export const getIsConfig = (state) =>
  state ? state.config.configIsOpen : false;
export const getIsConfigLoading = (state) =>
  state ? state.config.loading : false;
export const getConfigData = (state) => (state ? state.config.data : {});

export const getBankHolidayOptions = () =>
  Object.keys(bankHolidayCountries).map((key) => ({
    key,
    display: bankHolidayCountries[key].display,
  }));
