import React from 'react';
import { toggleMode } from '../Stores/slice1';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
const Logo = new URL('../assets/Brain.jpg', import.meta.url).href;
function Navbar(){
    let isDark = useSelector((state) => state.isDark.isDark);
    let dispatch = useDispatch();
    return(
       <>
       <div className='shadow-2xl shadow-gray-900 sticky top-0 z-20 bg-gray-700'>
       <Link to={'/'} className='flex justify-between items-center bg-gray-700 p-2 md:mx-25 mx-5'>
        <div className='flex items-center justify-center gap-2'>
            <div>
                <img className='sm:h-15 h-10 rounded-full' src={Logo} alt="Logo"/>
            </div>
            <div><p className='font-bold md:text-4xl sm:text-3xl sm:inline hidden text-xl text-white'>DSA.io</p></div>
        </div>
        <div className='flex justify-between items-center gap-5'>
        <button
      onClick={() => dispatch(toggleMode())}
      className={`px-2 py-2 rounded-2xl border text-xs sm:text-xl font-light ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {isDark ? `☀️ Light Mode` : `🌙 Dark Mode`}
    </button>
        </div>
       </Link>
       </div>
       </>
    );
}
export default Navbar;