"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { findUser } from "@/lib/firestore/user";
import CustomAlert from "@/components/ui/CustomAlert";

export default function LoginPage() {
  const [alert, setAlert] = React.useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await findUser(email, password);
      if (user) {
        // alert(`Login berhasil! Selamat datang, ${user.name || 'User'} 👋`);

        localStorage.setItem("user", JSON.stringify(user));
        // redirect jika ingin: window.location.href = "/dashboard";
         window.location.href = "/"
      } else {
        // alert("Login gagal. Email atau password salah.");
        setAlert({
          type: "error",
          message: "Email and password not found",
          show: true,
        });
      }
    } catch (err) {
      console.error(err);
      // alert("Terjadi kesalahan saat login.");
      setAlert({
        type: "error",
        message: "An error occurred while logging in.",
        show: true,
      });
    }
    // Sembunyikan setelah 3 detik
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full space-y-10 p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          {/* University logo placeholder */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
            }}
            className="mx-auto mb-6 w-25 h-25 rounded-md bg-white p-1 flex items-center justify-center text-white text-3xl font-bold font-serif"
          >
            <Image
              src={"/img/adzkia.png"}
              alt="logo"
              height={250}
              width={250}
            />
          </motion.div>
          <h1 className="text-3xl font-serif font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
            Kampus Adzkia
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-serif">
            Please sign in to your account
          </p>
        </motion.div>
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 space-y-6"
          method="POST"
          noValidate
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <motion.div
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
              }}
              className=""
            >
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-400 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base bg-white dark:bg-gray-700 transition duration-300 ease-in-out"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
              }}
              className=""
            >
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-400 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base bg-white dark:bg-gray-700 transition duration-300 ease-in-out"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300 font-serif"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-serif font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
              Sign in
            </button>
          </motion.div>
        </motion.form>
        <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 font-serif">
          &copy; {new Date().getFullYear()} Kampus Adzkia. All rights reserved.
        </footer>
      </motion.div>
      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </motion.div>
  );
}
