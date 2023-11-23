import React, { ChangeEvent, useState } from 'react'

import './style.css'

export const DropdownBox = () => {
  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div className="dropdown-container">
      <label className="dropdown-label">The selected area is</label>
      <select
        className="dropdown"
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="clean">Just cleaned</option>
        <option value="dirty">To be cleaned</option>
      </select>
    </div>
  )
}
