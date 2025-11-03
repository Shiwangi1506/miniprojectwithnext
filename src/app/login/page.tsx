"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "worker") {
        router.replace("/worker-dashboard");
      } else {
        router.replace("/user-dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please provide both email/username and password.");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email: username,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        return;
      }

      if (res?.ok) {
        // Session will update automatically; useEffect will handle redirection
      }
    } catch (error) {
      console.error("LOGIN_ERROR:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('./image/login.jpg')" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 sm:w-4/5 lg:max-w-3xl rounded-2xl overflow-hidden shadow-xl bg-white/20 backdrop-blur-lg">
        <div className="bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="text-white text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back!</h2>
            <p className="text-sm sm:text-base">
              Login to continue using our services.
            </p>
            <p className="text-xs sm:text-sm">
              Fast and reliable service for your home needs.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 relative">
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-4">
              Login
            </h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/40 text-black placeholder-gray-800"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/40 text-black placeholder-gray-800"
            />

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-[#e61717] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-[#e61717] transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-black/80 mt-2">
              New account?{" "}
              <Link href="/sign-up" className="text-[#e61717] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!username || !password) {
//       setError("Please provide both email/username and password.");
//       return;
//     }

//     try {
//       const res = await signIn("credentials", {
//         email: username,
//         password: password,
//         redirect: false,
//       });
//       if (res?.error) {
//         setError("Invalid Credentials");
//         return;
//       }
//       if (res?.ok) {
//         // The authorize callback in [...nextauth] returns the user object.
//         // We need to parse the session to get the role and redirect.
//         // A simple way is to just reload and let next-auth handle session.
//         // A better way is to get session and redirect.
//         router.replace("/user-dashboard"); // Redirect to a common authenticated page
//       }
//     } catch (error) {
//       console.error("LOGIN_ERROR:", error);
//       setError("An error occurred during login.");
//     } finally {
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
//       style={{ backgroundImage: "url('./image/login.jpg')" }}
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 sm:w-4/5 lg:max-w-3xl rounded-2xl overflow-hidden shadow-xl bg-white/20 backdrop-blur-lg">
//         <div className="bg-black bg-opacity-80 flex items-center justify-center p-6">
//           <div className="text-white text-center space-y-2">
//             <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back!</h2>
//             <p className="text-sm sm:text-base">
//               Login to continue using our services.
//             </p>
//             <p className="text-xs sm:text-sm">
//               Fast and reliable service for your home needs.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center justify-center p-6 relative">
//           <form className="w-full space-y-4" onSubmit={handleSubmit}>
//             <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-4">
//               Login
//             </h2>
//             {error && <div className="text-red-500 text-sm">{error}</div>}

//             <input
//               type="text"
//               placeholder="Username or Email"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/40 text-black placeholder-gray-800"
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/40 text-black placeholder-gray-800"
//             />

//             <div className="flex items-center justify-between text-sm">
//               <a href="#" className="text-[#e61717] hover:underline">
//                 Forgot Password?
//               </a>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-[#e61717] transition"
//             >
//               Login
//             </button>

//             <p className="text-center text-sm text-black/80 mt-2">
//               New account?{" "}
//               <Link href="/sign-up" className="text-[#e61717] hover:underline">
//                 Sign Up
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
