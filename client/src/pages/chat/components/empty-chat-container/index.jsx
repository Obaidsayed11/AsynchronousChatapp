import { animationDefaultOptions } from '@/utils/Utils'
import React from 'react'
import Lottie from 'react-lottie'

function EmptyChatConatiner() {
  return (
    <div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all'>
        <Lottie isClickToPauseDisabled={true} height={200} width={200} options={animationDefaultOptions}/>
        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text transition-all dura-30 text-center">
            <h3 className='poppins-medium'>
                Hi <span className='text-red-800'>!</span> Welcome to
                <span className='text-red-800'> Synchrnous</span> Chat App  <span className='text-red-800'>...</span>
            </h3>
        </div>
    </div>
  )
}

export default EmptyChatConatiner