import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const fileToB64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<{ url: string; base64: string; mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState<string>('Add a retro filter');
  const [editedImageUrl, setEditedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedImageUrl('');
      setError(null);
      try {
        const { base64, mimeType } = await fileToB64(file);
        setSourceImage({ url: URL.createObjectURL(file), base64, mimeType });
      } catch (err) {
        setError("Could not read the selected file.");
        console.error(err);
      }
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImageUrl('');

    try {
      const url = await editImage(sourceImage.base64, sourceImage.mimeType, prompt);
      setEditedImageUrl(url);
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editedImageUrl) return;
    const link = document.createElement('a');
    link.href = editedImageUrl;
    const extension = editedImageUrl.split(';')[0].split('/')[1] || 'png';
    link.download = `edited-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const placeholder = (text: string) => (
    <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg flex items-center justify-center aspect-square relative">
      <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2">{text}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-8 w-full">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full md:w-auto flex-shrink-0 bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition"
        >
          {sourceImage ? 'Change Image' : 'Upload Image'}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Make it black and white"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleEdit}
          disabled={isLoading || !sourceImage}
          className="w-full md:w-auto flex-shrink-0 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Editing...' : 'Edit Image'}
        </button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sourceImage ? (
          <div className="w-full bg-gray-800 p-2 rounded-xl shadow-lg">
            <img src={sourceImage.url} alt="Source" className="rounded-lg object-contain w-full h-full max-h-[60vh]" />
             <p className="text-center text-sm font-semibold mt-2 text-gray-400">Original</p>
          </div>
        ) : (
          placeholder("Upload an image to start editing")
        )}
        
        {isLoading ? (
          <div className="w-full bg-gray-800 rounded-xl shadow-lg flex items-center justify-center aspect-square relative">
            <LoadingSpinner message="Applying AI magic..." />
          </div>
        ) : editedImageUrl ? (
          <div className="w-full bg-gray-800 p-2 rounded-xl shadow-lg flex flex-col gap-2">
            <img src={editedImageUrl} alt="Edited" className="rounded-lg object-contain w-full flex-1 min-h-0 max-h-[calc(60vh-40px)]" />
            <p className="text-center text-sm font-semibold text-gray-400">Edited</p>
             <button
              onClick={handleDownload}
              className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Edited Image
            </button>
          </div>
        ) : (
          placeholder("Your edited image will appear here")
        )}
      </div>
    </div>
  );
};

export default ImageEditor;