export default function CalendarModal({title, start, end}){
    return (
        <dialog className="z-10 sticky top-1/3 left-1/3 rounded-md p-8" open>
            <h1>{title}</h1>
            <section>
                <p>start time:{start}</p>
                <p>end time:{end}</p>
                <form method="dialog">
                    <button>Sign Up</button>
                </form>
            </section>
        </dialog>
    )
}