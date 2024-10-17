// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      // Do something here based on the different types of actions
      case 'location/update': {
        // We need to return a new state object
        return {
          // that has all the existing state data
          ...state,
          // but has a new array for the `todos` field
          location: [
            // with all of the old todos
            ...state.location,
            // and the new todo object
            {
              // Use an auto-incrementing numeric ID for this example
              id: nextTodoId(state.todos),
              text: action.payload,
              completed: false
            }
          ]
        }
      }
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }