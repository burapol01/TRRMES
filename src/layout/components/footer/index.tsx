

interface Footer {
    isOpen: boolean
}

export default function Footer(props:Footer) {
    return (
        <footer className={`duration-300 ${props.isOpen ? `ml-0 sm:ml-72` : 'ml-0 sm:ml-20'}`}>
            <div className="w-full p-2 sm:flex sm:items-center sm:justify-between">
                <span className="ml-10 sm:ml-0 text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024 <a href="" className="hover:underline">Rodbenz™</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>

    )
}
