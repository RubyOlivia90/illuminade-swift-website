export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-300 via-yellow-200 to-green-800">
      <h1 className="text-6xl font-extrabold text-green-900 mb-6 drop-shadow-lg">
        Tailwind is working if you see this styled text!
      </h1>
      <p className="text-xl text-green-900 max-w-xl text-center drop-shadow-md">
        Welcome to your colorful solarpunk-inspired homepage. Enjoy the pastel vibes and feel the energy of nature and tech combined.
      </p>
    </div>
  );
}