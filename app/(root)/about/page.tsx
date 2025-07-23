import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                    About Interview Practice AI
                </h1>
                <p className="text-xl text-gray-400">
                    Your AI-powered interview preparation companion
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    What is this app?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    This application is designed to help candidates practice and improve their interviewing skills
                    using advanced AI technology. Whether you're preparing for your first job interview or looking
                    to sharpen your skills for a senior position, our AI interviewer provides a safe, judgment-free
                    environment to practice.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/20">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">
                        Current Features
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Coding interviews with real-time feedback</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Technical interview simulations</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Behavioral interview practice</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Tailored interview sessions based on your role and experience</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">
                        Coming Soon
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Personal feedback tracking and analytics</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Progress monitoring and improvement insights</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Advanced personalized interview tracking (POC stage)</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Body Language & Facial Analysis
                </h3>
                <p className="text-gray-300 mb-4">
                    Our advanced body language and facial expression analysis technology is already implemented!
                    Check out our proof of concept that demonstrates real-time facial expression tracking
                    and interview body language analysis. This technology is being integrated into the main platform.
                </p>
                <Link
                    href="https://eye-interview-tracker.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Try Live Demo →
                </Link>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-semibold text-white mb-4">
                    Get in Touch
                </h3>
                <p className="text-gray-300 mb-6">
                    We're always looking to improve and would love to hear your feedback!
                    Whether you have suggestions, found a bug, or want to collaborate on this project,
                    don't hesitate to reach out.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="mailto:tmurali@terpmail.umd.edu"
                        className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <span className="mr-2">📧</span>
                        tmurali@terpmail.umd.edu
                    </Link>

                    <Link
                        href="tel:301768777"
                        className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <span className="mr-2">📱</span>
                        301-768-777
                    </Link>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                    Open for collaboration and feedback opportunities!
                </p>
            </div>

            <div className="text-center">
                <Link
                    href="/"
                    className="inline-block bg-primary-100 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Start Practicing →
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;