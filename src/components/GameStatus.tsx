'use client'

import { PieceColor } from '@/lib/types'

interface GameStatusProps {
  currentPlayer: PieceColor
  gameOver: string | null
  inCheck: boolean
  onReset: () => void
}

export default function GameStatus({ currentPlayer, gameOver, inCheck, onReset }: GameStatusProps) {
  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur rounded-2xl p-5 shadow-xl border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-4 text-center">Game Status</h2>

      {gameOver ? (
        <div className="text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-yellow-300 font-semibold text-center text-sm">{gameOver}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg ${
                currentPlayer === 'white'
                  ? 'bg-white border-gray-300 text-gray-800'
                  : 'bg-gray-900 border-gray-500 text-white'
              }`}
            >
              {currentPlayer === 'white' ? '♙' : '♟'}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {currentPlayer === 'white' ? 'White' : 'Black'}'s Turn
              </p>
              {inCheck && (
                <p className="text-red-400 text-xs font-medium animate-pulse">⚠ In Check!</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-4 w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 text-sm"
      >
        🔄 New Game
      </button>
    </div>
  )
}
