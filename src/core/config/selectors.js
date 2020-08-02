import { bankHolidayCountries } from '../../config';
// import { createSelector } from 'reselect';

export const getIsConfig = state => state ? state.config.configIsOpen : false;

export const getBankHolidayOptions = () => Object.keys(bankHolidayCountries).map(key => ({key, display: bankHolidayCountries[key].display}));
