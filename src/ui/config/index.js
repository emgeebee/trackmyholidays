import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { getIsConfig } from '../../core/config/selectors';

import './style.css';

export const Config = () => {
  const isConfig = useSelector(getIsConfig);
  const dispatch = useDispatch();
  const closeConfig = useCallback(() => dispatch({
      type: CHANGE_CONFIG,
  }), [dispatch]);

  return (
  !isConfig ? null : <div className="modal">
    <div className="controls">
      <div className="control">
        <button onClick={closeConfig}>A</button>
        <button onClick={closeConfig}>B</button>
      </div>
      <div className="control">
        <button onClick={closeConfig}>Close</button>
      </div>
      <div className="control">
      </div>
    </div>
  </div>)
}
