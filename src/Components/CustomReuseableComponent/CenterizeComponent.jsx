import React from 'react'

const CenterizeComponent = ({children}) => {
  return (
    <div className='flex w-full  justify-center items-center p-8 h-screen'>{children}</div>
  )
}

export default CenterizeComponent