'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import { CustomStatistics } from '@/app/types/types'

import './style.css'

export const Statistics = () => {
  const [kmCleaned, setKmCleaned] = useState(0)

  useEffect(() => {
    // TODO: get these values from the back end
    fetch(
      'https://plokkari-api-service.azurewebsites.net//api/Trash/statistics',
    )
      .then((res) => res.json())
      .then((stat: CustomStatistics) => {
        if (stat !== null) {
          setKmCleaned(parseFloat(stat.areaCleaned.toFixed(2)))
        }
      })
  }, [])

  return (
    <div className="statistics-window">
      <div className="statistics-left">
        <h3>Trash picked</h3>
        <h2>
          {' '}
          {kmCleaned} km<sup>2</sup>
        </h2>
      </div>
      <div className="statistics-right">
        <div className="statistics-image">
          <Image alt="icleand" src="/iceland.png" width={130} height={90} />
        </div>
      </div>
    </div>
  )
}
