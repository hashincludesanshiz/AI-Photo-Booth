import React from 'react';

const LoadingAnimation: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-64 h-40 bg-black/30 rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-700 backdrop-blur-sm">
                <div className="absolute w-[150%] h-12 bg-teal-400/80 animate-vertical-scan"></div>
            </div>
            <p className="mt-4 text-gray-300 font-semibold">Compositing image...</p>
            <p className="text-sm text-gray-400 max-w-xs">The AI is analyzing lighting, shadows, and perspective to create a seamless blend. This may take a moment.</p>
        </div>
    );
};

export default LoadingAnimation;
