import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A photorealistic image of a cat wearing a tiny hat');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl('');

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const fileName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30) || 'generated-image';
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <div className="flex flex-col space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Image Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cute capybara bathing in a hot spring"
            className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center relative min-h-[300px]">
        {isLoading && <LoadingSpinner message="Generating your image..." />}
        {error && <p className="text-red-400">{error}</p>}
        {!isLoading && !error && !imageUrl && (
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Your generated image will appear here.</p>
          </div>
        )}
        {imageUrl && (
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <img src={imageUrl} alt="Generated" className="rounded-lg object-contain w-full max-h-[60vh]" />
            <button
              onClick={handleDownload}
              className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;