'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

const ResumeUploadButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setUploadStatus('');
        } else {
            setUploadStatus('Please select a valid PDF file');
            setSelectedFile(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file first');
            return;
        }

        setIsUploading(true);
        setUploadStatus('');

        try {
            // Simulate upload process - replace with your actual upload logic
            const formData = new FormData();
            formData.append('resume', selectedFile);

            // Example API call - replace with your endpoint
            // const response = await fetch('/api/upload-resume', {
            //     method: 'POST',
            //     body: formData,
            // });

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate success
            setUploadStatus('Resume uploaded successfully!');

            // Reset after success
            setTimeout(() => {
                setIsOpen(false);
                setSelectedFile(null);
                setUploadStatus('');
            }, 1500);

        } catch (error) {
            setUploadStatus('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setUploadStatus('');
        setIsUploading(false);
        setDragActive(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetModal();
        setIsOpen(false);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isOpen) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Upload Resume</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                disabled={isUploading}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Upload your resume in PDF format for interview preparation</p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Drag and Drop Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                                dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedFile
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />

                            {selectedFile ? (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                        disabled={isUploading}
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Drop your PDF here</p>
                                        <p className="text-sm text-gray-500">or click to browse files</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        {uploadStatus && (
                            <div className={`mt-4 p-3 rounded-lg text-sm ${
                                uploadStatus.includes('successfully')
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                {uploadStatus}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            disabled={isUploading}
                            className="min-w-20"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="min-w-24 bg-blue-600 hover:bg-blue-700"
                        >
                            {isUploading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </div>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="max-sm:w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium shadow-sm"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Resume for Interview
        </Button>
    );
};

export default ResumeUploadButton;