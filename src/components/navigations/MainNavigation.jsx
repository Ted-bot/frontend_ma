import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import classes from './MainNavigation.module.css'

function MainNavigation() {

    const [openNav, setOpenNav] = useState(false);
    const [openAvatarDropdown, setOpenAvatarDropdown] = useState(false);

    const toggleNav = () => {
        setOpenNav(!openNav);
        setOpenAvatarDropdown(false);
    };

    const toggleAvatarDropdown = () => {
        setOpenAvatarDropdown(!openAvatarDropdown);
    };

    const [colorChange, setColorchange] = useState(false);

    const changeNavbarColor = () => {
        if (window.scrollY >= 80) {
            setColorchange(true);
        } else {
            setColorchange(false);
        }
    };
    window.addEventListener("scroll", changeNavbarColor);

    const navList = () => {
        return (
            <>
                <NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "text-cyan-200 underline decoration-solid underline-offset-4  decoration-2 decoration-cyan-200" : ""
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/event"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "text-cyan-200 underline decoration-solid underline-offset-8 decoration-2 decoration-cyan-200" : ""
                    }
                >
                    Event
                </NavLink>
                {/* <NavLink
                    to="/services"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "text-blue-900" : ""
                    }
                >
                    Services
                </NavLink> */}
                <NavLink
                    to="/sign-up"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "text-cyan-200 underline decoration-solid underline-offset-8 decoration-2 decoration-cyan-200" : ""
                    }
                >
                    Registration
                </NavLink>
            </>
        );
    };

    return (
        <>
             <header className={`fixed w-full z-10 border-gray-200 transition-all duration-500 ease-in-out ${colorChange ? 'bg-red-400/70' : 'bg-gradient-to-b from-rose-400 to-opacity-50 md:bg-opacity-80'} `}>
                <section className="container mx-auto py-4 px-4 md:flex md:items-center md:justify-between">
                    <section className="flex items-center justify-between">
                        <NavLink 
                            to="/"                         
                        >
                            <img className='w-16' src="/img/symbol_opacity_75_balance.png" alt="" />
                        </NavLink>
                        <button
                            onClick={toggleNav}
                            className="block md:hidden border border-gray-600 p-2 rounded text-gray-600 hover:bg-cyan-200/90 focus:outline-none focus:bg-cyan-300/50"
                        >
                            <svg
                                className={`w-6 h-6 ${openNav ? 'hidden' : 'block'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                            <svg
                                className={`w-6 h-6 ${openNav ? 'block' : 'hidden'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </section>
                    <nav className="hidden md:flex space-x-4 text-cyan-400">
                        {navList()}
                    </nav>
                    <section
                        className={`${openNav ? '' : 'hidden'
                            } mt-4 bg-gradient-to-r from-violet-500 to-opacity-90 flex flex-col gap-4 p-6  rounded text-cyan-400`}
                    >
                        {navList()}
                    </section>
                    {/* <section onClick={toggleAvatarDropdown} className="relative transition-all duration-500 w-24">
                        <span className="cursor-pointer font-fondamento text-cyan-100">Wing Chun Amsterdam</span>
                        <section className={`absolute ${openAvatarDropdown ? 'block' : 'hidden'} bg-gradient-to-r from-emerald-700/75 to-cyan-500/50 rounded shadow-md mt-2 space-y-2 hover:bg-blue-900/75`}>
                            <section className='p-4 flex flex-col text-cyan-100'>
                                <NavLink 
                                    to="/"
                                    className={({isActive}) => {
                                        isActive ?? 'bg-yellow-500'
                                    }}                                
                                >
                                    Profile
                                </NavLink>
                                <NavLink 
                                    to="/sign-up"
                                    className={({isActive}) => {
                                        isActive ?? 'bg-yellow-500'
                                    }}                                
                                >
                                    Dashboard
                                </NavLink>
                            </section>
                        </section>
                    </section> */}
                </section>
            </header>
        </>
    )
}

export default MainNavigation