
import React, { useRef, useCallback } from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
    id: string;
    label: string;
    image: ImageFile | null;
    onImageChange: (image: ImageFile | null) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9l2 2 2-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, image, onImageChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    }, [onImageChange]);

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div
                onClick={handleClick}
                className="relative cursor-pointer group w-full h-48 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center hover:border-teal-500 transition-colors duration-200"
            >
                <input
                    type="file"
                    id={id}
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                {image ? (
                    <>
                        <img src={image.preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-gray-400">Click to upload</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
