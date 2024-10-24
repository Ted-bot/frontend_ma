// React-specific entry point that automatically generates
// hooks corresponding to the defined endpoints
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { HYDRATE } from 'next-redux-wrapper'
// import Notification from '../../../components/ui/notification/Notification'
// import { getAvailableLocations } from '../location/locationSlice'
import { sendUpdateNotification } from '../ui/notificationSlice'
import inMemoryJwt from '../../../js/util/inMemoryJwt'
import { getLocalStorageItem } from '../../../js/util/getUtil'
import { selectUsersResult } from '../users/userSlice'

export const apiSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    // extract
    // The "endpoints" represent operations and requests for this server
    tagTypes: ['UserByEmail', 'UserAddress'],
    endpoints: builder => ({
        getUserRecentAddress: builder.query({
            query: () => `/user_Addressess/?page=1&isDefault=true&addressUser=${selectUsersResult.id}`,
            providesTags: ['UserByEUserAddressmail'],
        }),
        // getUser: builder.query({
        //     // The URL for the request is '/fakeApi/posts'
        //         query: () => `/user_by_email/${getLocalStorageItem('email')}/email`,
        //         providesTags: ['UserByEmail'],
        //         // keepUnusedDataFor: 15,
        //     }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: `/user_by_email/${getLocalStorageItem('email')}/email`,
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'X-Authorization' : inMemoryJwt.getToken(),
                    'Content-Type': 'application/merge-patch+json'
                }
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                const messageSuccess = {
                    status: 'pending',
                    title: 'Pending!',
                    message: 'Updating data ...'
                }
                dispatch(sendUpdateNotification(messageSuccess))
            try {
                await queryFulfilled
                const messageSuccess = {
                    status: 'success',
                    title: 'Success!',
                    message: 'Updated data successfully'
                }
                dispatch(sendUpdateNotification(messageSuccess))
            } catch (error) {
                console.log({ApiSliceError: error})
                // patchResult.undo()
                const messageFailed = {
                    status: 'error',
                    title: 'Failed!',
                    message: 'Updated data failed'
                }
                dispatch(sendUpdateNotification(messageFailed))
            }
          }
        }),
        updateUsers: builder.mutation({
            query: (data) => ({
                url: `/user_by_email/${getLocalStorageItem('email')}/email`,
                // url: `/users/${id}`,
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'X-Authorization' : inMemoryJwt.getToken(),
                    'Content-Type': 'application/merge-patch+json'
                }
            }),     
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                    const messageSuccess = {
                        status: 'pending',
                        title: 'Pending!',
                        message: 'Updating data ...'
                    }
                    dispatch(sendUpdateNotification(messageSuccess))

                    const patchResult = dispatch(apiSlice.util.updateQueryData('getUser', undefined, (draft) => {
                        // console.log({FinallyBefore: draft?.phoneNumber, args})
                        draft.email = args.email
                        draft.phoneNumber = args.phoneNumber
                        // console.log({FinallyAfter: draft, args})
                    }))
                try {
                    await queryFulfilled
                    const messageSuccess = {
                        status: 'success',
                        title: 'Success!',
                        message: 'Updated data successfully'
                    }
                    dispatch(sendUpdateNotification(messageSuccess))
                } catch (error) {
                    console.log({ApiSliceError: error})
                    patchResult.undo()
                    const messageSuccess = {
                        status: 'error',
                        title: 'Failed!',
                        message: 'Updated data failed'
                    }
                    dispatch(sendUpdateNotification(messageSuccess))
        
                  /**
                   * Alternatively, on failure you can invalidate the corresponding cache tags
                   * to trigger a re-fetch:
                   * dispatch(api.util.invalidateTags(['Post']))
                   */
                }
              },       
            // invalidatesTags: ['UserByEmail']
        }),
    })
  })
  
  // Export the auto-generated hook for the `getPosts` query endpoint
  export const { 
        useGetUserQuery, 
        useUpdateUsersMutation, 
        useGetLocationsQuery, 
        useUpdatePasswordMutation, 
        useGetUserRecentAddressQuery,
        util,
    } = apiSlice
