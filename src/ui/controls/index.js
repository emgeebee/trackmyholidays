import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSelected } from '../../core/dates/selectors';
import { deselectDay, halfDayToggle } from '../../core/dates/actions';

import './style.css';

export const Controls = () => {
  const selected = useSelector(getSelected);
  const dispatch = useDispatch();
  const deselect = useCallback(
      (selected) => dispatch(deselectDay(selected)),
      [ dispatch ]
  );

  const half = useCallback(
    (selected) => dispatch(halfDayToggle(selected)),
    [ dispatch ]
  );
  
  const isSingleDay = selected.hol ? selected.hol.start === selected.hol.end : false

  return ( !selected ? null :
    <footer>
        { selected.hol.isBHoliday ? (
          <>
            <span className="from">{selected.hol.name}: {selected.hol.start}</span>
          </>
         ) : (
          <>
            <span className="from">From: {selected.hol.start}</span>
            <span className="to">To: {selected.hol.end}</span>
            <span className="length">({selected.length} days)</span>
            {isSingleDay && (
              <button onClick={half.bind(null, selected)}>
                {selected.hol.half === 'first' ? 'Last Half' : 
                 selected.hol.half === 'last' ? 'Full Day' : 
                 'Half Day'}
              </button>
            )}
            <button onClick={deselect.bind(null, selected)}>Deselect</button>
          </>
         )
        }
    </footer>
  )
}
