import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm border border-blue-100">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-2xl">🚀</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Tailwind V4 + Vite ADMIN PAGE 
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this colorful design with shadows, Tailwind is running perfectly!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95">
          Excellent
        </button>
      </div>
    </div>
  )
}

export default App;
