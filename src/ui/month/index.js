import React from 'react';

import { Day } from '..';

import './style.css';

const moment = require('moment');

export const Month = ({month}) => {
  return (
    <div className="month">
        <h3>{moment(month[0]).format('MMMM YYYY')}</h3>
        <span className="dow">M</span>
        <span className="dow">T</span>
        <span className="dow">W</span>
        <span className="dow">T</span>
        <span className="dow">F</span>
        <span className="dow">S</span>
        <span className="dow">S</span>
        {month.map((day) => <Day day={day} />)}
    </div>
  )

}
