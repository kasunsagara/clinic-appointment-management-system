import { Link } from "react-router-dom";
import { FaUserMd, FaCalendarCheck, FaHeartbeat } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
        <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 flex items-center to-teal-50 min-h-[90vh] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 border border-blue-200">
                #1 Healthcare Platform
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Health Is Our <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Top Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Book appointments with the best doctors in our country. Experience hassle free scheduling, timely consultations, and premium healthcare services all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/doctors"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FaUserMd />
                  Find a Doctor
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-bold rounded-xl border-2 border-blue-100 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FaCalendarCheck />
                  Register Now
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-teal-300 rounded-[3rem] transform rotate-3 scale-105 opacity-20"></div>
              <img
                src="/photo1.jpg"
                alt="Doctor smiling"
                className="relative rounded-[3rem] shadow-2xl object-cover h-[600px] w-full"
              />
              
              {/* Floating Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                <div className="bg-green-100 p-3 rounded-full text-green-600 text-2xl">
                  <FaHeartbeat />
                </div>
                <div>
                  <p className="font-bold text-gray-800">10k+</p>
                  <p className="text-xs text-gray-500 font-medium">Happy Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ClinicCare?</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <FaUserMd />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Doctors</h3>
              <p className="text-gray-600">
                Our team consists of highly qualified and experienced medical professionals dedicated to your well-being.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <FaCalendarCheck />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Appointment</h3>
              <p className="text-gray-600">
                Book appointments anytime, anywhere. Our intuitive system makes scheduling hassle-free and quick.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <FaHeartbeat />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Care</h3>
              <p className="text-gray-600">
                We provide comprehensive and personalized healthcare services tailored to meet your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};