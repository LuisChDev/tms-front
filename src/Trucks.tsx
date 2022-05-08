import React, { useEffect } from 'react';
import './Trucks.scss';

const ROOT_CLASS = 'tms-front-trucks'

export const Trucks = () => {
  useEffect(() => {
    // to be developed, fetch trucks from API
  }, [])

  return (
    <div className={ROOT_CLASS}>
      <p>
        This table lists the existing transportation vehicles.
      </p>

    </div>
  )
}
