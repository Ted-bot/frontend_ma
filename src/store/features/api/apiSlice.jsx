// React-specific entry point that automatically generates
// hooks corresponding to the defined endpoints
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { HYDRATE } from 'next-redux-wrapper'
// import Notification from '../../../components/ui/notification/Notification'
import { userActions, sendUpdatedUser } from '../users/userSlice'

// function isHydrateAction(action) {
//   return action.type === HYDRATE
// }

export const apiSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    // extractRß
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({
      // The `getPosts` endpoint is a "query" operation that returns data.
      // The return value is a `Post[]` array, and it takes no arguments.
      postUsers: builder.query({
        // The URL for the request is '/fakeApi/posts'
        query: (id) => `/users/${id}`,
         async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
            // dispatch(api.util.updateQueryData('getPosts', undefined,(draftPosts) => {
            // draftPosts.push({ id: 1, name: 'Teddy' })
            dispatch(userActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending Updated Data'
            }))
            try {
                const { data } = await queryFulfilled
                // `onSuccess` side-effect
                console.log({successApiSlice: data})
                dispatch(userActions.showNotification({
                    status: 'success',
                    title: 'Success updating personal details ...',
                    message: 'Sending Updated Data'
                }))
            } catch (err) {
            // `onError` side-effect
            console.log({errorApiSlice: error})
                dispatch(userActions.showNotification({
                    status: 'failed',
                    title: 'Failed Sending updated data!',
                    message:'Error fetching post!'}))
            }
        },
        keepUnusedDataFor: 5,
        }),
        invalidatesTags: ['Users']
    })
  })
  
  // Export the auto-generated hook for the `getPosts` query endpoint
  export const { usePostUsersQuery, usePostUsersMutation } = apiSlice
