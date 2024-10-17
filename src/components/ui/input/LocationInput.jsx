import {  useEffect, useState } from 'react'
import { useSelector } from 'react-redux' //connect
import { NativeSelect } from '@mui/material'
import { selectStateList } from '../../../store/features/users/userSlice'

const LocationInput = ({errorMessage: error, id, cityId, stateId, onChangeState, onChangeCity}) => {

        const stateList = useSelector((state) => state.users.user.state_list)
        const cityList = useSelector((state) => state.users.user.city_list)
    

    return (
        <>
        <h1>Test</h1>
            <NativeSelect
                className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id={stateId}
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
            <NativeSelect
                className={`${error && 'border-red-500 border '}w-full block text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id={id}
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
