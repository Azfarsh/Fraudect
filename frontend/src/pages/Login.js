import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Store user data in Firestore
  const storeUserDataInFirestore = async (user) => {
    try {
      const userRef = doc(db, 'Userlogin', user.uid);
      await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
        provider: user.providerData[0]?.providerId || 'email',
        lastLogin: new Date(),
      });
    } catch (error) {
      console.error('Error storing user data:', error);
      setError('Failed to store user data in Firestore.');
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await storeUserDataInFirestore(user);  // Store user data in Firestore
      navigate('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in.');
      setMessage('');
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      await storeUserDataInFirestore(user);  // Store user data in Firestore
      navigate('/profile');
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setError('Failed to log in with Google.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container mx-auto flex max-w-4xl">
        <motion.div
          className="hidden lg:block w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/logi.jpeg"
            alt="Welcome Back"
            className="object-cover w-full h-full rounded-l-2xl"
          />
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 bg-white p-6 lg:p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Login</h2>
            <p className="text-gray-600 mb-4 text-sm">Welcome back! Please login to your account.</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div>
                <label className="block text-gray-700 text-base mb-1">Email</label>
                <motion.input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-base mb-1">Password</label>
                <motion.input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
            </motion.div>

            <motion.div className="flex justify-end">
              <a href="/forgotpassword" className="text-purple-600 hover:text-purple-800 transition-colors text-sm">
                Forgot Password?
              </a>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>

              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login with Google
              </motion.button>
            </motion.div>

            <motion.div className="text-center mt-4">
              <a href="/register" className="text-purple-600 hover:text-purple-800 transition-colors text-sm">
                Don't have an account? Register
              </a>
            </motion.div>
          </form>

          {(message || error) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              {message && <p className="text-green-500 text-center text-sm">{message}</p>}
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
