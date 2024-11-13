import { NavLink } from "react-router-dom"

export default function ActionCallButton(){

    return (
        <NavLink to='/contact'>
             <button className="text-slate-100 h-16 w-42 px-8 rounded-b-full text-2xl rounded-t-full -translate-y-8 border-0 ring-2 shadow-xl ring-red-500 bg-red-500 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-300 hover:from-orange-400 hover:text-yellow-200 hover:to-red-400 hover:ring-red-400 hover:h-20 hover:text-3xl hover:shadow-2xl"
                >Try Out Lessons
            </button>
        </NavLink>
    )
}