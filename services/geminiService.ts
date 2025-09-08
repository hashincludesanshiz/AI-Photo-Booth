import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, GeneratedResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'webp': return 'image/webp';
        default: return 'image/png'; // Default to png
    }
};

export const generateCompositeImage = async (
    baseImage: ImageFile,
    guestImage: ImageFile,
    optionalNotes: string
): Promise<GeneratedResult> => {
    const baseInstructions = `You are a professional event photo compositor. Your task is to seamlessly merge the guest's photo into the base couple's photo, making it look like a real, on-stage portrait.

PRIMARY INSTRUCTIONS:
Seamlessly blend the guest into the main photo. Place them where they fit most naturally and match the lighting and style of the original photo.`;

    const additionalInstructions = optionalNotes.trim()
        ? `\n\nADDITIONAL INSTRUCTIONS:\n${optionalNotes.trim()}`
        : '';

    const hardRequirements = `\n\nHARD REQUIREMENTS:
- Keep the couple EXACTLY as in the base image: same pose, outfits, expressions, framing, and their original background unless explicitly told to change it in the prompt.
- Place the guest naturally into the scene.
- Match lighting, color temperature, shadows, and grain from the base image to the guest.
- Preserve hair edges and fine details; avoid halos or cutout artifacts.
- Maintain realistic scale and perspective; align shoulders and eyelines naturally.
- Ensure hands and fingers look natural; avoid creating extra or duplicate limbs.
- Apply subtle retouching only if necessary or requested in the primary instructions.

OUTPUT:
- One photorealistic merged image suitable for print.
- Maintain the original aspect ratio. Never crop out the couple.`;
    
    const imageEditingPrompt = `${baseInstructions}${additionalInstructions}${hardRequirements}`;

    // Step 2: Use the constructed prompt to edit the image.
    const imageEditingModel = 'gemini-2.5-flash-image-preview';

    const baseImagePart = {
        inlineData: {
            data: baseImage.preview.split(',')[1],
            mimeType: getMimeType(baseImage.file.name),
        },
    };

    const guestImagePart = {
        inlineData: {
            data: guestImage.preview.split(',')[1],
            mimeType: getMimeType(guestImage.file.name),
        },
    };

    const textPart = {
        text: imageEditingPrompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: imageEditingModel,
            contents: {
                parts: [textPart, baseImagePart, guestImagePart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: GeneratedResult = { image: null, text: null };

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType;
                    const base64ImageBytes = part.inlineData.data;
                    result.image = `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        
        // Always set the text to be the prompt that was used for generation if an image was returned.
        if (result.image) {
             result.text = imageEditingPrompt;
        }


        if (!result.image) {
            throw new Error("The AI model did not return an image. It may have refused the request. Try adjusting your prompt or using different images.");
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the image.");
    }
};