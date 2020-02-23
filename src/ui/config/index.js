import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { DATES_SELECT_START_MONTH, DATES_UPDATE_CARRIED_OVER } from '../../core/dates/action-types';
import { getIsConfig } from '../../core/config/selectors';
import { getCurrentCO } from '../../core/dates/selectors';

import './style.css';

export const Config = () => {
  const isConfig = useSelector(getIsConfig);
  let co = useSelector(getCurrentCO);
  const dispatch = useDispatch();
  const closeConfig = useCallback(() => dispatch({
      type: CHANGE_CONFIG,
  }), [dispatch]);
  const chooseMonth = useCallback((month) => dispatch({
      type: DATES_SELECT_START_MONTH,
      payload: month
  }), [dispatch]);
  const updateCarriedOver = useCallback((newCo) => dispatch({
      type: DATES_UPDATE_CARRIED_OVER,
      payload: newCo
  }), [dispatch]);

  return (
  !isConfig ? null : <div className="modal">
    <div className="controls">
      <div className="control">
        <h4>Choose your holiday year start month:</h4>
        <button onClick={() => chooseMonth(0)}>Jan</button>
        <button onClick={() => chooseMonth(1)}>Feb</button>
        <button onClick={() => chooseMonth(2)}>Mar</button>
        <button onClick={() => chooseMonth(3)}>Apr</button>
        <button onClick={() => chooseMonth(4)}>May</button>
        <button onClick={() => chooseMonth(5)}>Jun</button>
        <button onClick={() => chooseMonth(6)}>Jul</button>
        <button onClick={() => chooseMonth(7)}>Aug</button>
        <button onClick={() => chooseMonth(8)}>Sept</button>
        <button onClick={() => chooseMonth(9)}>Oct</button>
        <button onClick={() => chooseMonth(10)}>Nov</button>
        <button onClick={() => chooseMonth(11)}>Dec</button>
      </div>
      <div className="control">
        <label for="co">Carried Over: </label>
        <input id="co"  type="number" onChange={(event) => updateCarriedOver(event.target.value)} value={co} />
      </div>
      <div className="control">
        <button onClick={closeConfig}>Close</button>
      </div>
    </div>
  </div>)
}
