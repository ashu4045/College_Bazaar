import React from 'react'
import { Link } from 'react-router-dom'
export default function Footer() {

    return (
        <div className="w-full py-2 bg-gray-500 select-none text-custom-muted sm:py-4">
            <div className="flex flex-col justify-around text-xs xs:text-sm between:text-base sm:flex-row sm:text-lg lg:text-xl">
                <div className="flex-col hidden mt-2 text-center sm:flex">
                    <h3 className="text-sm font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Creators</h3>
                    <a href="https://www.linkedin.com/in/ashutosh-singh-6478551a6/">Ashutosh Singh</a>
                    <a href="https://www.linkedin.com/in/ajay-oraon-3b2997208/">Ajay Oraon</a>
                    <a href="https://www.linkedin.com/in/ayush-prince-a12959209/">Ayush Prince</a>
                </div>
                <div className="py-1 text-center sm:flex sm:flex-col ">
                    <span className="mr-2 text-sm font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Feedback:</span>
                    <input className="w-20 mr-2 text-black bg-gray-300 border rounded-sm md:w-32 lg:w-36 sm:w-28" />
                    <a className="w-20 px-1 mt-2 border border-white rounded-sm hover:bg-gray-500" href='mailto:ashishkv.2016@gmail.com'>Send</a>
                </div>
            </div>
            <p className="py-4 text-center select-none xs:text-base sm:text-lg md:text-xl lg:text-2xl">© 2022 College Bazaar, CodeRelay</p>
        </div>
    )
}