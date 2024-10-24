import {  useEffect, useState } from 'react'
import { useSelector } from 'react-redux' //connect
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
// import { NativeSelect } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'

const LocationInput = ({errorMessage: error, onChangeState, onChangeCity}) => { // id,

    // const stateList = useSelector((state) => state.users.user.state_list)
    // const cityList = useSelector((state) => state.users.user.city_list)    
    // const cityId = useSelector((state) => state.users.user.city_id)    
    // const stateId = useSelector((state) => state.users.user.state_id)    
    const cityId = 33400
const stateId = 2612

    // console.log({stateId, cityId,cityList,stateList  })

    return (
        <>
             <FormControl className='w-full'>
                <InputLabel id="state" >State</InputLabel>
                <Select
                    labelid='state'
                    label='state'
                    className={`${error && 'border-red-500 border'} w-full block text-gray-700 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                    id='state'
                    onChange={(e) => onChangeState(e)}
                    placeholder='select state ...' 
                    defaultValue={stateId ?? '2612'}                                    
                >
                    {/* {
                        stateList instanceof Array && 
                        stateList.length > 0 && 
                        stateList.map((value, index) => (<MenuItem key={index} value={value.value}>{value.label}</MenuItem>))
                        
                    } */}
                </Select>
            </FormControl>

            <FormControl className='w-full'>
                <InputLabel id="location" >City</InputLabel>
                <Select
                    labelid="location"
                    className={`${error && 'border-red-500 border'} w-full block text-gray-700 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                    id='location'
                    onChange={(e) => onChangeCity(e)}
                    label='location'
                    defaultValue={cityId ?? '77340'}
                >
                    {/* {
                        cityList instanceof Array && 
                        cityList?.length > 0 && 
                        cityList?.map((value, index) => (<MenuItem value={value.value}>{value.label}</MenuItem>))
                        // cityList?.map((value, index) => (<option key={index} value={value.value}>{value.label}</option>))
                    } */}
                </Select>
            </FormControl>
        </>
    )
}

export default LocationInput
