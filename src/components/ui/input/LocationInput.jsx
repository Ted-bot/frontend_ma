import {  useEffect, useState } from 'react'
import { useSelector } from 'react-redux' //connect
import { NativeSelect } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'

const LocationInput = ({errorMessage: error,  cityId, stateId, onChangeState, onChangeCity}) => { // id,

        const stateList = useSelector((state) => state.users.user.state_list)
        const cityList = useSelector((state) => state.users.user.city_list)
    

    return (
        <>
        <h1>Test</h1>
            <InputLabel id="select_state" sx={{ display: 'none' }}>State</InputLabel>
            <NativeSelect
                labelid='select_state'
                className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id='region'
                onChange={(e) => onChangeState(e)}
                placeholder='select state ...' 
                value={stateId }                                    
            >
                {
                    stateList instanceof Array && 
                    stateList.length > 0 && 
                    stateList.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                    
                }
            </NativeSelect>

            <InputLabel id="select_location" sx={{ display: 'none' }}>City</InputLabel>
            <NativeSelect
                labelid="select_location"
                className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id='location'
                onChange={(e) => onChangeCity(e)}
                placeholder='select city ...'
                value={cityId}
            >
                {
                    cityList instanceof Array && 
                    cityList?.length > 0 && 
                    cityList?.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                }
            </NativeSelect>
        </>
    )
}

export default LocationInput
