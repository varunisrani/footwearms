'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function AIAgentPage() {
  useEffect(() => {
    // This effect runs after the component mounts
    // The widget will be initialized by the script
  }, []);

  return (
    <>
      {/* Load ElevenLabs ConvAI Widget Script */}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
        type="text/javascript"
      />

      <div className="min-h-screen p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              AI Agent Assistant
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Interact with our AI-powered conversational assistant for instant help and support
            </p>
          </div>

          {/* Main Content Area - Responsive */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
            <div className="space-y-4 md:space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 md:p-6 border border-blue-100">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Welcome to AI Assistant
                </h2>
                <p className="text-sm md:text-base text-gray-700 mb-4">
                  Our AI agent is here to help you with:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm md:text-base text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Product information and queries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Inventory management assistance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Sales and purchase guidance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>General system support</span>
                  </li>
                </ul>
              </div>

              {/* Instructions Card - Responsive */}
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  How to Use
                </h3>
                <div className="space-y-2 text-sm md:text-base text-gray-700">
                  <p className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center font-semibold mr-3 flex-shrink-0">
                      1
                    </span>
                    <span>Click on the AI assistant widget that appears on your screen</span>
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center font-semibold mr-3 flex-shrink-0">
                      2
                    </span>
                    <span>Start speaking or typing your question</span>
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center font-semibold mr-3 flex-shrink-0">
                      3
                    </span>
                    <span>Get instant responses and assistance</span>
                  </p>
                </div>
              </div>

              {/* Widget Container - Centered and Responsive */}
              <div className="flex flex-col items-center justify-center py-6 md:py-10 lg:py-12">
                <div className="w-full max-w-2xl">
                  <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-6 md:p-8 lg:p-10 shadow-inner border border-indigo-100">
                    <div className="text-center mb-4 md:mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full mb-3 md:mb-4">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        AI Assistant Active
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">
                        The AI assistant widget is now available on this page
                      </p>
                    </div>

                    {/* ElevenLabs ConvAI Widget */}
                    <div className="flex justify-center">
                      <elevenlabs-convai agent-id="agent_0101karv0x8kfvxa61tcdrq1tkqy"></elevenlabs-convai>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-green-600 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Fast Responses</h4>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Get instant answers to your queries</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">24/7 Available</h4>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Always ready to assist you</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Secure & Private</h4>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Your conversations are protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
