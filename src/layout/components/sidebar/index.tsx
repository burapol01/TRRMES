import React from 'react';
import SideberMenuItem from './SideberMenuItem';
import SideberMenuMain from './SideberMenuMain';

interface SideBar {
    headleOpen: (val: boolean) => void
    isOpen: boolean
}
export default function SideBar({ headleOpen, isOpen }: SideBar) {
    const [active, setActive] = React.useState(false);

    return (
        <div className='flex' >
            <div
                className={`${isOpen ? `w-72` : `w-20`} fixed duration-300 h-screen bg-white border-1 z-20  ${active ? `w-72` : `w-20`}`}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
            >
                <div className='h-28'>
                    {isOpen ? (
                        <div className=' absolute cursor-pointer rounded-full -right-4 top-6 bg-white z-50'
                            onClick={() => {
                                headleOpen(false)
                                setActive(false)
                            }}
                        >
                            <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"  >  <circle cx="12" cy="12" r="10" />  <polyline points="12 8 8 12 12 16" />  <line x1="16" y1="12" x2="8" y2="12" /></svg>
                        </div>
                    ) : (
                        <div className=' absolute cursor-pointer rounded-full -right-4 top-6 bg-white  z-50' onClick={() => headleOpen(true)}>
                            <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" >  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                        </div>
                    )}
                    <div className='inline-flex'>
                        <div className={`${isOpen || active ? `block` : `hidden`} `}>
                            <img
                                alt="Logo"
                                src="http://trr-web.trrgroup.com/storage/INTRANET/DMZ/Asset/Logo/Logo_TRR_Lin_TH.png"
                                className="py-2 px-8"
                            />
                        </div>
                        <div className={`${isOpen || active ? `hidden` : `block`} `}>
                            <img
                                alt="Logo"
                                src="http://trr-web.trrgroup.com/storage/EVI/DEV/Logo/TRR.png"
                                className="h-[40px] m-3"
                            />
                        </div>
                    </div>
                </div>
                <SideberMenuMain isOpen={isOpen || active} />
            </div>
        </div>
    )
}