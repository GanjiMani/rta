// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
//         <h1 className="text-2xl font-bold text-blue-600">RTA Portal</h1>
//         <div className="space-x-4">
//           <Link
//             to="/login"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Investor Login
//           </Link>
//           <Link
//             to="/admin/login"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Admin Login
//           </Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="flex flex-col items-center text-center py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
//         <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
//           Investor Portal — Simple. Secure. Smart.
//         </h2>
//         <p className="text-lg text-gray-600 max-w-2xl mb-6">
//           Manage folios, set SIPs, redeem and track your investments with ease. 
//           Start investing today with complete transparency and security.
//         </p>
//         <div className="space-x-4">
//           <Link
//             to="/register"
//             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Create Account
//           </Link>
//           <Link
//             to="/login"
//             className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//           >
//             Login
//           </Link>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 px-6 bg-white">
//         <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
//           Why Choose RTA Portal?
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {[
//             {
//               title: "Secure KYC",
//               desc: "Upload documents and complete KYC in minutes.",
//             },
//             {
//               title: "Auto NAV Updates",
//               desc: "NAVs are updated daily from AMC feeds.",
//             },
//             {
//               title: "Portfolio Dashboard",
//               desc: "Get a real-time view of all your holdings in one place.",
//             },
//             {
//               title: "One-Click Transactions",
//               desc: "Invest, Redeem, or Switch with just a few clicks.",
//             },
//             {
//               title: "Bank-Grade Security",
//               desc: "End-to-end encryption and 2FA authentication.",
//             },
//             {
//               title: "Downloadable Reports",
//               desc: "Access CAS, Tax, and Capital Gains reports anytime.",
//             },
//           ].map((f, i) => (
//             <div
//               key={i}
//               className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gray-50"
//             >
//               <h4 className="text-lg font-semibold text-blue-600 mb-2">
//                 {f.title}
//               </h4>
//               <p className="text-gray-600">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Trust Section */}
//       <section className="py-16 px-6 bg-blue-50 text-center">
//         <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted & Secure</h3>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           SEBI Registered RTA | ISO Certified Security | Trusted by top AMCs
//         </p>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
//         <h3 className="text-3xl font-bold mb-4">
//           Join thousands of investors already using RTA Portal
//         </h3>
//         <p className="mb-6 text-blue-100">
//           Get started today and simplify your investment journey.
//         </p>
//         <Link
//           to="/register"
//           className="px-6 py-3 bg-white text-blue-700 rounded-md hover:bg-gray-100 font-semibold"
//         >
//           Get Started →
//         </Link>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-16 px-6 bg-white">
//         <h3 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h3>
//         <div className="max-w-3xl mx-auto space-y-6">
//           <div>
//             <h4 className="font-semibold text-gray-800">Is this portal secure?</h4>
//             <p className="text-gray-600">Yes, all data is encrypted and protected with two-factor authentication.</p>
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-800">How do I register?</h4>
//             <p className="text-gray-600">Click on “Create Account” and follow the simple KYC steps.</p>
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-800">Can I link multiple bank accounts?</h4>
//             <p className="text-gray-600">Yes, you can add and manage multiple bank mandates for redemptions.</p>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
//         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between">
//           <p>© 2025 RTA Portal. All rights reserved.</p>
//           <div className="space-x-6">
//             <Link to="/about" className="hover:text-white">About Us</Link>
//             <Link to="/contact" className="hover:text-white">Contact</Link>
//             <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">RTA Portal</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Investor Login
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Global Portal Nav Section */}
      <section className="bg-white p-8 max-w-5xl mx-auto mt-6 rounded-xl shadow flex flex-wrap justify-center gap-6">
        <Link
          to="/login"
          className="btn btn-primary px-6 py-3 rounded-md"
          aria-label="Investor Portal"
        >
          Investor Portal
        </Link>
        <Link
          to="/distributor/login"
          className="btn btn-primary px-6 py-3 rounded-md"
          aria-label="Distributor Portal"
        >
          Distributor Portal
        </Link>
        <Link
          to="/amc/login"
          className="btn btn-primary px-6 py-3 rounded-md"
          aria-label="AMC Portal"
        >
          AMC Portal
        </Link>
        <Link
          to="/sebi/login"
          className="btn btn-primary px-6 py-3 rounded-md"
          aria-label="SEBI Portal"
        >
          SEBI Portal
        </Link>
        <Link
          to="/admin/login"
          className="btn btn-primary px-6 py-3 rounded-md"
          aria-label="Admin Portal"
        >
          Admin Portal
        </Link>
      </section>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Investor Portal — Simple. Secure. Smart.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          Manage folios, set SIPs, redeem and track your investments with ease. 
          Start investing today with complete transparency and security.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Why Choose RTA Portal?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Secure KYC",
              desc: "Upload documents and complete KYC in minutes.",
            },
            {
              title: "Auto NAV Updates",
              desc: "NAVs are updated daily from AMC feeds.",
            },
            {
              title: "Portfolio Dashboard",
              desc: "Get a real-time view of all your holdings in one place.",
            },
            {
              title: "One-Click Transactions",
              desc: "Invest, Redeem, or Switch with just a few clicks.",
            },
            {
              title: "Bank-Grade Security",
              desc: "End-to-end encryption and 2FA authentication.",
            },
            {
              title: "Downloadable Reports",
              desc: "Access CAS, Tax, and Capital Gains reports anytime.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gray-50"
            >
              <h4 className="text-lg font-semibold text-blue-600 mb-2">
                {f.title}
              </h4>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6 bg-blue-50 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted & Secure</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          SEBI Registered RTA | ISO Certified Security | Trusted by top AMCs
        </p>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Join thousands of investors already using RTA Portal
        </h3>
        <p className="mb-6 text-blue-100">
          Get started today and simplify your investment journey.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-700 rounded-md hover:bg-gray-100 font-semibold"
        >
          Get Started →
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800">Is this portal secure?</h4>
            <p className="text-gray-600">Yes, all data is encrypted and protected with two-factor authentication.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">How do I register?</h4>
            <p className="text-gray-600">Click on “Create Account” and follow the simple KYC steps.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Can I link multiple bank accounts?</h4>
            <p className="text-gray-600">Yes, you can add and manage multiple bank mandates for redemptions.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <p>© 2025 RTA Portal. All rights reserved.</p>
          <div className="space-x-6">
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
