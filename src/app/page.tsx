import ChessGame from '@/components/ChessGame'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
        ♟ Chess Game
      </h1>
      <p className="text-gray-400 mb-6 text-sm">Built with Next.js & TypeScript</p>
      <ChessGame />
    </main>
  )
}
