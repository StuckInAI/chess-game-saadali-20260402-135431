'use client'

import { Board, Position, PieceColor } from '@/lib/types'
import { isInCheck } from '@/lib/chess'

interface ChessBoardProps {
  board: Board
  selectedCell: Position | null
  validMoves: Position[]
  onCellClick: (position: Position) => void
  currentPlayer: PieceColor
  inCheck: boolean
}

export default function ChessBoard({
  board,
  selectedCell,
  validMoves,
  onCellClick,
  currentPlayer,
  inCheck,
}: ChessBoardProps) {
  const isSelected = (row: number, col: number) =>
    selectedCell?.row === row && selectedCell?.col === col

  const isValidMove = (row: number, col: number) =>
    validMoves.some(m => m.row === row && m.col === col)

  const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0

  const getKingPosition = (color: PieceColor): Position | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c]
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row: r, col: c }
        }
      }
    }
    return null
  }

  const kingPos = inCheck ? getKingPosition(currentPlayer) : null

  const getCellStyle = (row: number, col: number): string => {
    const isLight = isLightSquare(row, col)
    const selected = isSelected(row, col)
    const valid = isValidMove(row, col)
    const isKingInCheck = kingPos?.row === row && kingPos?.col === col
    const hasPiece = board[row][col] !== null

    let base = 'relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 transition-all duration-150 '

    if (isKingInCheck) {
      base += 'bg-red-500 '
    } else if (selected) {
      base += 'bg-yellow-400 '
    } else if (isLight) {
      base += 'bg-amber-100 '
    } else {
      base += 'bg-amber-800 '
    }

    if (valid) {
      base += 'cursor-pointer '
    } else if (hasPiece) {
      base += 'cursor-pointer '
    }

    return base
  }

  const colLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  return (
    <div className="flex flex-col items-center">
      <div
        className="border-4 border-amber-900 rounded-sm shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(180, 120, 60, 0.4)' }}
      >
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {/* Row label */}
            <div className="flex items-center justify-center w-6 text-amber-200 text-xs font-bold bg-amber-900">
              {8 - rowIdx}
            </div>
            {row.map((piece, colIdx) => (
              <div
                key={colIdx}
                className={getCellStyle(rowIdx, colIdx)}
                onClick={() => onCellClick({ row: rowIdx, col: colIdx })}
              >
                {/* Valid move indicator */}
                {isValidMove(rowIdx, colIdx) && (
                  <div
                    className={`absolute rounded-full z-10 pointer-events-none ${
                      board[rowIdx][colIdx]
                        ? 'inset-0 border-4 border-green-500 border-opacity-70 rounded-none'
                        : 'w-4 h-4 bg-green-500 bg-opacity-60'
                    }`}
                  />
                )}
                {/* Chess piece */}
                {piece && (
                  <span
                    className="chess-piece text-3xl md:text-4xl z-20 select-none"
                    style={{
                      textShadow: piece.color === 'white'
                        ? '0 1px 3px rgba(0,0,0,0.8)'
                        : '0 1px 3px rgba(255,255,255,0.3)',
                      filter: piece.color === 'white' ? 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' : 'none',
                    }}
                  >
                    {piece.symbol}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
        {/* Column labels */}
        <div className="flex">
          <div className="w-6 bg-amber-900" />
          {colLabels.map(label => (
            <div
              key={label}
              className="flex items-center justify-center w-14 h-6 md:w-16 text-amber-200 text-xs font-bold bg-amber-900"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
