import { Link } from 'react-router-dom'

export default function MenuItem() {
    return (
        <div className="flex space-x-4 items-center">
            <Link className="text-gray-300 hover:bg-gray-200  rounded-md px-3 py-2 text-lg font-bold" aria-current="page" to={'/home'}>
                <span className='hover:text-blue-500'>Home</span>
            </Link >
            <Link className="text-gray-300 hover:bg-gray-200 rounded-md px-3 py-2 text-lg font-bold" aria-current="page" to={'/apps/about'}>
                <span className='hover:text-blue-500'>About</span>
            </Link>
            <Link className="text-gray-300 hover:bg-gray-200 rounded-md px-3 py-2 text-lg font-bold" aria-current="page" to={'/apps/contact'}>
                <span className='hover:text-blue-500'>Contact</span>
            </Link>
            <Link className="text-gray-300 hover:bg-gray-200 rounded-md px-3 py-2 text-lg font-bold" aria-current="page" to={'/apps/example'}>
                <span className='hover:text-blue-500'>Example Componens</span>
            </Link>
        </div>
    )
}
