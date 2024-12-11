import { useListContext } from "react-admin"

export const SubscribedTo = () => {
    const { data, resource } = useListContext()
    console.log({TrainingSession_subscribedTo: resource})
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