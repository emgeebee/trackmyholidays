// import { createSelector } from 'reselect';

export const getIsConfig = state => console.log(state) || state ? state.config.configIsOpen : false;
