import {  useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux' //connect
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
// import { NativeSelect } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import { dataProvider } from '../../../dataProvider/main/DataProvider'
import { getStates } from '../../class/userData/FormHelper';
import { GetState, GetCity } from 'react-country-state-city/dist/cjs'
import { countryid } from '../../../js/util/auth'
import { useGetIdentity } from 'react-admin'
import { LocationState, LocationCity } from '../../../store'
// import { GetState, GetCity } from 'react-country-state-city/dist/cjs'

const LocationInput = ({errorMessage: error, stateId, cityId}) => { // id,

    const [enteredInput, setEnteredInput] = useState({state_id: 2612, city_id: 77618})
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])

    useEffect(() => {
        setState()
        setCities(stateId)
        handleGeneralUserInput('state_id',stateId)
    }, [stateId])

    useEffect(() => {
        handleGeneralUserInput('city_id',cityId)
    }, [cityId])

    useEffect(() => {
        setCities(enteredInput?.state_id)        
    }, [enteredInput?.state_id])

    const handleGeneralUserInput = (identifier, value) => {
        setEnteredInput((prevValues) => ({
            ...prevValues,
            [identifier]: value
        }))
    }

    const setState = async () => {
        GetState(countryid).then((result) => {
          setStateList(result)
        })
    }

    const setCities = async (id) => {
        GetCity(countryid, id).then((result) => {
            console.log({CityResults: result})
          setCityList(result)
        })
    }
    
    return (
        <>
            <FormControl className='w-full'>
                <InputLabel id="state" >State</InputLabel>
                {stateList.length > 0 && <Select
                    labelid='state'
                    label='state'
                    className={`${error && 'border-red-500 border'} w-full block text-gray-700 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                    id='state'
                    onChange={(e) => handleGeneralUserInput('state_id', e.target.value)}
                    value={enteredInput.state_id}             
                >
                    {
                        stateList.map((value, index) => (<MenuItem key={index} value={value.id}>{value.name}</MenuItem>))                        
                    }
                </Select>}
            </FormControl>

            <FormControl className='w-full'>
                <InputLabel id="location" >City</InputLabel>
                <Select
                    labelid="location"
                    label='location'
                    className={`${error && 'border-red-500 border'} w-full block text-gray-700 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                    id='location'
                    onChange={(e) => handleGeneralUserInput('city_id', e.target.value)}
                    value={enteredInput.city_id} //libReactCity
                >
                    {
                        cityList.map((value, index) => (<MenuItem key={index} value={value.id}>{value.name}</MenuItem>))
                    }
                </Select>
            </FormControl>
        </>
    )
}

export default LocationInput

    // const stableCallback = useCallback(() => {
    //     // Callback logic that doesn't change between renders
    //     dataProvider.getLocations(libReactCity).then((response) => {
    //         setCityList(response.getCities)
    //         setStateList(() => ([...response.getStates]))
    //         // setStateList(() => ([...response.getStates]))
    //         }
    //     )
    //   }, [libReactCity, libReactState]);
    // useEffect(() => {
    //     stableCallback()
    // }, [stableCallback])