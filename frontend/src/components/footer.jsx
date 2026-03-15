import { FaHeart, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold text-white shadow-lg">
                C
              </div>
              <span className="font-bold text-xl tracking-tight">
                ClinicCare
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Providing exceptional healthcare services with our easy-to-use
              appointment management system. Your health is our priority.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/doctors"
                  className="hover:text-blue-400 transition-colors"
                >
                  Find a Doctor
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-400 transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-blue-400 transition-colors"
                >
                  Register
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ClinicCare. All rights reserved.
          </p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <FaHeart className="text-red-500" /> by Kasun Sagara
          </p>
        </div>
      </div>
    </footer>
  );
};


