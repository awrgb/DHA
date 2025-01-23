// components/CircularLoader.tsx
import React from "react"

const CircularLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-800 border-opacity-75"></div>
    </div>
  )
}

export default CircularLoader
