export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
export type PieceColor = 'white' | 'black'

export interface Piece {
  type: PieceType
  color: PieceColor
  symbol: string
  hasMoved?: boolean
}

export interface Position {
  row: number
  col: number
}

export type Board = (Piece | null)[][]
