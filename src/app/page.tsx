import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center">Welcome to Build Lab Academy</h1>
          <p className="text-xl text-center mt-4 text-gray-600">Your content goes here</p>
        </div>
      </main>
    </div>
  );
}
