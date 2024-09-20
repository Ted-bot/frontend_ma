import { Component } from 'react'

export default class PaymentErrorBoundary extends Component {
  
    state = { 
        hasError: false, 
        error : undefined
    }

    // constructor(props) {
    //     super(props)
    //     this.state = { 
    //         hasError: false,
    //         error: undefined
    //     }
    //   }    

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { 
            hasError: true,
            error: error
        }
    }

    componentDidCatch(error, info) {
        console.log('Caught Error!')
        console.error(error)
        console.error(info)
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        // logErrorToMyService(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
        // You can render any custom fallback UI
        // return this.props.fallback
        return <>Oh no! Epic fail!</>
        }

        return this.props.children
    }
}