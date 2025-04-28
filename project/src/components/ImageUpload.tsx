import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 
          transition-colors duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={isProcessing ? undefined : handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {isProcessing ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
                <Camera className="h-8 w-8 text-blue-500" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Processing image...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                {dragActive ? (
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <p className="text-base font-medium text-gray-700">
                Drag and drop an image, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, JPEG
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;