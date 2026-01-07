import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Our App
        </h1>

        <p className="text-gray-500 mb-8">
          Your one-stop place to manage everything easily.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
