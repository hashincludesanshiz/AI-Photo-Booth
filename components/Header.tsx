
import React from 'react';

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="py-4 px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 w-full">
            <div className="container mx-auto flex items-center gap-4">
                <CameraIcon />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Event Photo <span className="text-teal-400">Compositor</span>
                </h1>
            </div>
        </header>
    );
};

export default Header;
