import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import LoadingAnimation from './components/LoadingAnimation';
import type { ImageFile, GeneratedResult } from './types';
import { generateCompositeImage } from './services/geminiService';

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 10l-2.293-2.293a1 1 0 010-1.414L13 4zm6 10l2.293 2.293a1 1 0 010 1.414L17 20l-2.293-2.293a1 1 0 010-1.414L17 14z" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const App: React.FC = () => {
    const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
    const [guestImage, setGuestImage] = useState<ImageFile | null>(null);
    const [optionalNotes, setOptionalNotes] = useState<string>('');
    const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!baseImage || !guestImage) {
            setError('Please upload both a base image and a guest image.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setGeneratedResult(null);

        try {
            const result = await generateCompositeImage(
                baseImage,
                guestImage,
                optionalNotes
            );
            setGeneratedResult(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [baseImage, guestImage, optionalNotes]);

    const handleDownload = useCallback(() => {
        if (!generatedResult?.image) return;
        const link = document.createElement('a');
        link.href = generatedResult.image;
        link.download = 'composite-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [generatedResult]);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Control Panel */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-6">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-3">Configuration</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ImageUploader id="base-image" label="1. Base Image (Couple)" image={baseImage} onImageChange={setBaseImage} />
                            <ImageUploader id="guest-image" label="2. Guest Image" image={guestImage} onImageChange={setGuestImage} />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">3. Optional Notes</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-2">Add any specific requests (e.g., change background)</label>
                                    <textarea
                                        id="notes"
                                        rows={4}
                                        value={optionalNotes}
                                        onChange={(e) => setOptionalNotes(e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="e.g., Change background to a beach at sunset, and make the lighting warmer."
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !baseImage || !guestImage}
                            className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                            <span>{isLoading ? 'Generating...' : 'Create Composite'}</span>
                        </button>
                    </div>

                    {/* Image Display */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col justify-center items-center min-h-[400px]">
                         <h2 className="text-xl font-semibold text-white w-full border-b border-gray-600 pb-3 mb-4">Result</h2>
                        {isLoading && (
                            <LoadingAnimation />
                        )}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md text-center">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && generatedResult?.image && (
                            <div className="w-full space-y-4">
                                <img src={generatedResult.image} alt="Generated composite" className="w-full max-w-lg mx-auto rounded-lg shadow-2xl" />
                                <button
                                    onClick={handleDownload}
                                    className="w-full max-w-lg mx-auto flex justify-center items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                    <span>Download Image</span>
                                </button>
                                {generatedResult.text && (
                                     <div className="bg-gray-700/50 p-4 rounded-md max-w-lg mx-auto text-left">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Prompt Used For Generation</p>
                                        <p className="text-sm text-gray-300 italic">"{generatedResult.text}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {!isLoading && !error && !generatedResult && (
                            <div className="text-center text-gray-500">
                                <SparklesIcon className="w-16 h-16 mx-auto mb-2" />
                                <p>Your generated image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;