import { useListContext } from "react-admin"

export const SubscribedBy = () => {
    const { data, resource } = useListContext()
    console.log({TrainingSession_subscribedBy: resource})
    return (
        <ul>
            {data.map((subscribed, index) => (
                <li key={index}>
                    {subscribed.username}
                </li>
            ))}
        </ul>
    )
}

export const SubscribedTo = () => {
    const { data, resource } = useListContext()
    console.log({SubscribedTo_trainingSession: resource})
    return (
        <ul>
            {data.map((trainingsession, index) => (
                <li key={index}>
                    <hr  style={{ border: '1px solid black'}}/>
                    {trainingsession.title} <br />
                    {trainingsession?.startDate}
                    {/* <hr  style={{ border: '1px solid black'}}/> */}
                </li>
            ))}
        </ul>
    )
}