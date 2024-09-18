import { jsx as _jsx } from "react/jsx-runtime";
import SideberMenuMain from './SideberMenuMain';
export default function SideBar({ headleOpen, isOpen }) {
    return (_jsx(SideberMenuMain, { isOpen: isOpen, headleOpen: headleOpen }));
}
