'use client'

import { useState, useCallback } from 'react'
import { initializeBoard, getValidMoves, movePiece, isInCheck, isCheckmate, isStalemate } from '@/lib/chess'
import { Board, Position, PieceColor } from '@/lib/types'
import ChessBoard from './ChessBoard'
import GameStatus from './GameStatus'
import MoveHistory from './MoveHistory'

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(initializeBoard())
  const [selectedCell, setSelectedCell] = useState<Position | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white')
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameOver, setGameOver] = useState<string | null>(null)
  const [capturedWhite, setCapturedWhite] = useState<string[]>([])
  const [capturedBlack, setCapturedBlack] = useState<string[]>([])

  const handleCellClick = useCallback((position: Position) => {
    if (gameOver) return

    const { row, col } = position
    const piece = board[row][col]

    if (selectedCell) {
      const isValidMove = validMoves.some(m => m.row === row && m.col === col)

      if (isValidMove) {
        const fromPiece = board[selectedCell.row][selectedCell.col]
        const toPiece = board[row][col]

        const newBoard = movePiece(board, selectedCell, position)
        setBoard(newBoard)

        // Track captured pieces
        if (toPiece) {
          if (toPiece.color === 'white') {
            setCapturedWhite(prev => [...prev, toPiece.symbol])
          } else {
            setCapturedBlack(prev => [...prev, toPiece.symbol])
          }
        }

        // Record move in algebraic-like notation
        const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const moveNotation = `${fromPiece?.symbol ?? ''}${cols[selectedCell.col]}${8 - selectedCell.row} → ${cols[col]}${8 - row}`
        setMoveHistory(prev => [...prev, moveNotation])

        const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white'

        if (isCheckmate(newBoard, nextPlayer)) {
          setGameOver(`${currentPlayer === 'white' ? 'White' : 'Black'} wins by checkmate! 🏆`)
        } else if (isStalemate(newBoard, nextPlayer)) {
          setGameOver("Stalemate! It's a draw. 🤝")
        } else {
          setCurrentPlayer(nextPlayer)
        }

        setSelectedCell(null)
        setValidMoves([])
      } else if (piece && piece.color === currentPlayer) {
        setSelectedCell(position)
        setValidMoves(getValidMoves(board, position, currentPlayer))
      } else {
        setSelectedCell(null)
        setValidMoves([])
      }
    } else {
      if (piece && piece.color === currentPlayer) {
        setSelectedCell(position)
        setValidMoves(getValidMoves(board, position, currentPlayer))
      }
    }
  }, [board, selectedCell, validMoves, currentPlayer, gameOver])

  const resetGame = () => {
    setBoard(initializeBoard())
    setSelectedCell(null)
    setCurrentPlayer('white')
    setValidMoves([])
    setMoveHistory([])
    setGameOver(null)
    setCapturedWhite([])
    setCapturedBlack([])
  }

  const inCheck = !gameOver && isInCheck(board, currentPlayer)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-5xl">
      <div className="flex flex-col items-center gap-4">
        {/* Captured pieces - Black captured */}
        <div className="w-full bg-gray-800 bg-opacity-60 rounded-xl p-3 min-h-[48px] flex flex-wrap gap-1 items-center">
          <span className="text-gray-400 text-xs mr-2">Captured:</span>
          {capturedBlack.map((p, i) => (
            <span key={i} className="text-xl">{p}</span>
          ))}
        </div>

        <ChessBoard
          board={board}
          selectedCell={selectedCell}
          validMoves={validMoves}
          onCellClick={handleCellClick}
          currentPlayer={currentPlayer}
          inCheck={inCheck}
        />

        {/* Captured pieces - White captured */}
        <div className="w-full bg-gray-800 bg-opacity-60 rounded-xl p-3 min-h-[48px] flex flex-wrap gap-1 items-center">
          <span className="text-gray-400 text-xs mr-2">Captured:</span>
          {capturedWhite.map((p, i) => (
            <span key={i} className="text-xl">{p}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-72">
        <GameStatus
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          inCheck={inCheck}
          onReset={resetGame}
        />
        <MoveHistory moves={moveHistory} />
      </div>
    </div>
  )
}
