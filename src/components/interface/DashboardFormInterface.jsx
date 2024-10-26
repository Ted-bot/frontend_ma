import UserDashboardInput from "../ui/input/UserDashboardInput"

// eslint-disable-next-line react/prop-types
export default function DashboardFormInterface({array}) {

        return array.map((item) => (
            <UserDashboardInput
                key={item.id}
                {...item}
            />
        ))
}