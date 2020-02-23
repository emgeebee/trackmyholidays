// import { createSelector } from 'reselect';

export const getIsConfig = state => console.log(encodeURI(JSON.stringify(state))) || state ? state.config.configIsOpen : false;
