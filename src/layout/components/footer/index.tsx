

interface Footer {
    isOpen: boolean
}

export default function Footer(props: Footer) {
    return (
        <footer className={`duration-300 ${props.isOpen ? `ml-0 sm:ml-72` : 'ml-0 sm:ml-20'}`}>
            <div className="w-full p-2 sm:flex sm:items-center sm:justify-between">
                <span className="ml-10 sm:ml-0 text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    {import.meta.env.VITE_VERSION}
                </span>
                <span>
                {import.meta.env.VITE_COPYRIGHT}
                </span>
            </div>
        </footer>

    )
}
