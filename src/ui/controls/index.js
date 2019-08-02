import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSelected } from '../../core/dates/selectors';
import { deselectAction } from '../../core/dates/actions';

import './style.css';

export const Controls = () => {
  const selected = useSelector(getSelected);
  const dispatch = useDispatch();
  const deselect = useCallback(
      (selected) => dispatch(deselectAction(selected)),
      [ dispatch ]
  );

  return ( !selected ? null :
    <footer>
        <span className="from">From: {selected.hol.start}</span>
        <span className="to">To: {selected.hol.end}</span>
        <span className="length">({selected.length} days)</span>
        <button onClick={deselect.bind(null, selected)}>Deselect</button>
    </footer>
  )
}
