import { Board, Piece, PieceColor, PieceType, Position } from './types'

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
}

function createPiece(type: PieceType, color: PieceColor): Piece {
  return { type, color, symbol: PIECE_SYMBOLS[color][type], hasMoved: false }
}

export function initializeBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))

  const backRank: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

  // Black pieces
  backRank.forEach((type, col) => {
    board[0][col] = createPiece(type, 'black')
  })
  for (let col = 0; col < 8; col++) {
    board[1][col] = createPiece('pawn', 'black')
  }

  // White pieces
  backRank.forEach((type, col) => {
    board[7][col] = createPiece(type, 'white')
  })
  for (let col = 0; col < 8; col++) {
    board[6][col] = createPiece('pawn', 'white')
  }

  return board
}

function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)))
}

function isOnBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function getRawMoves(board: Board, pos: Position): Position[] {
  const piece = board[pos.row][pos.col]
  if (!piece) return []

  const moves: Position[] = []
  const { row, col } = pos
  const { type, color } = piece

  const addIfValid = (r: number, c: number): boolean => {
    if (!isOnBoard(r, c)) return false
    const target = board[r][c]
    if (target && target.color === color) return false
    moves.push({ row: r, col: c })
    return target === null
  }

  const slide = (dr: number, dc: number) => {
    let r = row + dr
    let c = col + dc
    while (isOnBoard(r, c)) {
      const target = board[r][c]
      if (target) {
        if (target.color !== color) moves.push({ row: r, col: c })
        break
      }
      moves.push({ row: r, col: c })
      r += dr
      c += dc
    }
  }

  switch (type) {
    case 'pawn': {
      const dir = color === 'white' ? -1 : 1
      const startRow = color === 'white' ? 6 : 1

      // Forward move
      if (isOnBoard(row + dir, col) && !board[row + dir][col]) {
        moves.push({ row: row + dir, col })
        // Double move from start
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push({ row: row + 2 * dir, col })
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const nr = row + dir
        const nc = col + dc
        if (isOnBoard(nr, nc) && board[nr][nc] && board[nr][nc]!.color !== color) {
          moves.push({ row: nr, col: nc })
        }
      }
      break
    }
    case 'knight': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ]
      knightMoves.forEach(([dr, dc]) => addIfValid(row + dr, col + dc))
      break
    }
    case 'bishop': {
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => slide(dr, dc))
      break
    }
    case 'rook': {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => slide(dr, dc))
      break
    }
    case 'queen': {
      [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => slide(dr, dc))
      break
    }
    case 'king': {
      [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ].forEach(([dr, dc]) => addIfValid(row + dr, col + dc))

      // Castling
      if (!piece.hasMoved) {
        // Kingside
        const kingsideRook = board[row][7]
        if (
          kingsideRook && kingsideRook.type === 'rook' && !kingsideRook.hasMoved &&
          !board[row][5] && !board[row][6]
        ) {
          moves.push({ row, col: col + 2 })
        }
        // Queenside
        const queensideRook = board[row][0]
        if (
          queensideRook && queensideRook.type === 'rook' && !queensideRook.hasMoved &&
          !board[row][1] && !board[row][2] && !board[row][3]
        ) {
          moves.push({ row, col: col - 2 })
        }
      }
      break
    }
  }

  return moves
}

export function movePiece(board: Board, from: Position, to: Position): Board {
  const newBoard = cloneBoard(board)
  const piece = newBoard[from.row][from.col]
  if (!piece) return newBoard

  // Handle castling
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    if (to.col > from.col) {
      // Kingside
      newBoard[from.row][5] = newBoard[from.row][7]
      newBoard[from.row][7] = null
      if (newBoard[from.row][5]) newBoard[from.row][5]!.hasMoved = true
    } else {
      // Queenside
      newBoard[from.row][3] = newBoard[from.row][0]
      newBoard[from.row][0] = null
      if (newBoard[from.row][3]) newBoard[from.row][3]!.hasMoved = true
    }
  }

  // Handle pawn promotion
  if (piece.type === 'pawn') {
    if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
      newBoard[to.row][to.col] = createPiece('queen', piece.color)
      newBoard[from.row][from.col] = null
      return newBoard
    }
  }

  newBoard[to.row][to.col] = { ...piece, hasMoved: true }
  newBoard[from.row][from.col] = null

  return newBoard
}

export function isInCheck(board: Board, color: PieceColor): boolean {
  // Find king
  let kingPos: Position | null = null
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.type === 'king' && p.color === color) {
        kingPos = { row: r, col: c }
      }
    }
  }
  if (!kingPos) return false

  const opponent: PieceColor = color === 'white' ? 'black' : 'white'
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.color === opponent) {
        const moves = getRawMoves(board, { row: r, col: c })
        if (moves.some(m => m.row === kingPos!.row && m.col === kingPos!.col)) {
          return true
        }
      }
    }
  }
  return false
}

export function getValidMoves(board: Board, pos: Position, color: PieceColor): Position[] {
  const rawMoves = getRawMoves(board, pos)
  return rawMoves.filter(move => {
    const newBoard = movePiece(board, pos, move)
    return !isInCheck(newBoard, color)
  })
}

export function isCheckmate(board: Board, color: PieceColor): boolean {
  if (!isInCheck(board, color)) return false
  return !hasAnyValidMoves(board, color)
}

export function isStalemate(board: Board, color: PieceColor): boolean {
  if (isInCheck(board, color)) return false
  return !hasAnyValidMoves(board, color)
}

function hasAnyValidMoves(board: Board, color: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.color === color) {
        const moves = getValidMoves(board, { row: r, col: c }, color)
        if (moves.length > 0) return true
      }
    }
  }
  return false
}
