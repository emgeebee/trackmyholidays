import { createSelector } from 'reselect';

export const authSelector = state => state.auth.ww;

export const getIsLoggedIn = createSelector(
    authSelector,
    ww => console.log('ww', ww) || ww && ww.tokenObj ? true : false
)

export const getName = createSelector(
    authSelector,
    ww => ww && ww.Qt ? ww.Qt.Bd : ''
)

export const getToken = createSelector(
    authSelector,
    ww => ww && ww.tokenObj ? ww.tokenObj.id_token : ''
)
