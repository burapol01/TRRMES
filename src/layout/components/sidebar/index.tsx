import React from 'react';
import SideberMenuMain from './SideberMenuMain';

interface SideBar {
    headleOpen: (val: boolean) => void
    isOpen: boolean
}
export default function SideBar({ headleOpen, isOpen }: SideBar) {
    return (
        <SideberMenuMain isOpen={isOpen} headleOpen={headleOpen} />
    )
}