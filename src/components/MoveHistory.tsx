'use client'

import { useEffect, useRef } from 'react'

interface MoveHistoryProps {
  moves: string[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [moves])

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur rounded-2xl p-5 shadow-xl border border-gray-700 flex flex-col">
      <h2 className="text-lg font-bold text-white mb-3">Move History</h2>
      <div className="overflow-y-auto max-h-72 space-y-1 pr-1">
        {moves.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No moves yet...</p>
        ) : (
          moves.map((move, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                idx % 2 === 0
                  ? 'bg-gray-700 bg-opacity-60'
                  : 'bg-gray-600 bg-opacity-40'
              }`}
            >
              <span className="text-gray-400 text-xs w-6 text-right">{Math.floor(idx / 2) + 1}{idx % 2 === 0 ? 'w' : 'b'}.</span>
              <span className="text-white">{move}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
