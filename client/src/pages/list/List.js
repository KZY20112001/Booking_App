import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Navbar from '../../components/Navbar/Navbar'
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import './List.css'
import SearchItem from '../../components/SearchItem/SearchItem'
import useFetch from '../../hooks/useFetch'

const List = () => {
  const location = useLocation()
  const [destination, setDestination] = useState(location.state.destination)
  const [dates, setDates] = useState(location.state.dates)
  const [options, setOptions] = useState(location.state.options)
  const [openDate, setOpenDate] = useState(false)
  const [min, setMin] = useState(undefined)
  const [max, setMax] = useState(undefined)
  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`
  )

  const handleClick = () => {
    reFetch()
  }

  return (
    <div>
      <Navbar />
      <Header type='list' />
      <div className='listContainer'>
        <div className='listWrapper'>
          <div className='listSearch'>
            <h1 className='listTitle'>Search</h1>
            <div className='listItem'>
              <label>Destination</label>
              <input placeholder={destination} type='text' />
            </div>

            <div className='listItem'>
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                'dd/MM/yyyy'
              )} to ${format(dates[0].endDate, 'dd/MM/yyyy')}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            <div className='listItem'>
              <label>Options</label>
              <div className='listOptions'>
                <div className='listOptionItem'>
                  <span className='listOptionText'>
                    Min Price <small>per night</small>
                  </span>
                  <input
                    type='number'
                    className='listOptionInput'
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>

                <div className='listOptionItem'>
                  <span className='listOptionText'>
                    Max Price <small>per night</small>
                  </span>
                  <input
                    type='number'
                    className='listOptionInput'
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>

                <div className='listOptionItem'>
                  <span className='listOptionText'>Adult</span>
                  <input
                    type='number'
                    className='listOptionInput'
                    placeholder={options.adult}
                    min={1}
                  />
                </div>

                <div className='listOptionItem'>
                  <span className='listOptionText'>Children</span>
                  <input
                    type='number'
                    className='listOptionInput'
                    placeholder={options.children}
                    min={0}
                  />
                </div>

                <div className='listOptionItem'>
                  <span className='listOptionText'>Room</span>
                  <input
                    type='number'
                    className='listOptionInput'
                    placeholder={options.room}
                    min={1}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className='listResult'>
            {loading ? (
              'Loading'
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
