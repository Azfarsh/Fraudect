import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('What is your favourite sport?');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore under the "registerdetail" collection
      await addDoc(collection(db, 'registerdetail'), {
        uid: user.uid,
        email,
        firstName,
        lastName,
        securityQuestion,
        securityAnswer,
        timestamp: Timestamp.fromDate(new Date())
      });

      setMessage('User registered successfully!');
      setError('');
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.code === 'auth/email-already-in-use' 
        ? 'Email address already in use' 
        : error.message);
      setMessage('');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Add user data to Firestore under the "registerdetail" collection
      await addDoc(collection(db, 'registerdetail'), {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '', // Splitting display name to extract first name
        lastName: user.displayName?.split(' ')[1] || '', // Splitting display name to extract last name
        securityQuestion: 'Google Sign-In', // Can be adjusted as needed
        securityAnswer: 'Not Applicable', // Can be adjusted as needed
        timestamp: Timestamp.fromDate(new Date())
      });

      navigate('/profile'); // Redirect to profile after successful Google sign-in
    } catch (error) {
      console.error('Error signing up with Google:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto flex max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
          {/* Left side - Image */}
          <motion.div 
            className="hidden lg:block w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
           <div 
  className="absolute inset-0 flex items-center justify-center"
  style={{ background: 'linear-gradient(80deg, #00188f, #EC008C)' }}
> 
  <motion.div 
    className="text-white text-center p-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h2 className="text-3xl font-bold mb-4">Welcome to Fraudect</h2>
    <p className="text-lg">Join us and start your journey towards success!</p>
  </motion.div>
</div>

          </motion.div>

          {/* Right side - Form */}
          <motion.div 
            className="w-full lg:w-1/2 bg-white p-6 lg:p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Create Account</h2>
              <p className="text-gray-600 mb-6 text-sm">Please fill in your details to register</p>
            </motion.div>

            <form onSubmit={handleRegister} className="space-y-4">
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                  <motion.input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                  <motion.input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <motion.input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                  <motion.input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                  <motion.input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">Security Question</label>
                <motion.select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option>What is your favourite sport?</option>
                  <option>What is the name of your school?</option>
                  <option>What is your favourite pet name?</option>
                  <option>What is the name of the town where you were born?</option>
                </motion.select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">Security Answer</label>
                <motion.input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Security Answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div
                className="mt-4 flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
                whileTap={{ scale: 0.98 }}
              >
                Register
              </motion.button>
            </form>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-600">
                Already have an account? 
                <a href="/login" className="text-purple-500 hover:text-purple-700">Login here</a>
              </p>
            </motion.div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={handleGoogleSignup}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign up with Google
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
