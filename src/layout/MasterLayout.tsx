import React from 'react'
import { Outlet } from 'react-router-dom';
import NavBar from './components/Navbar';
import SideBar from './components/sidebar';
import Footer from './components/footer';

export default function MasterLayout() {
    const [open, setOpen] = React.useState(false)


    const headleOpen = (val:boolean) => {
        setOpen(val);
    }
    return (
        <div
            className="d-flex flex-column flex-root app-root scroll scroll-pull"
            id="kt_app_root"
            data-scroll="true"
            data-wheel-propagation="true"
        >
            <div
                className="app-page flex-column flex-column-fluid bg-gray-200"
                id="kt_app_page"
            >
                <NavBar open={open} />
                <div className='hidden sm:block'>
                    <SideBar isOpen={open} headleOpen={headleOpen}/>
                </div>
                <div className={`${open ? `ml-0 sm:ml-72` : `ml-0 sm:ml-20`} pt-[6.5rem] pl-5 pr-5 duration-300`}>
                    <Outlet />
                </div>
            </div>
            <Footer isOpen={open} />
        </div>
    )
}
