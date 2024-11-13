import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/Home';
import ChatbotInterview from './pages/InterviewBot'; // Existing path for your InterviewBot component
import InterviewForm from './pages/InterviewForm';
import LearningPlanForm from './pages/LearningPlanForm';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Footer from './components/Footer'; // Import Footer component
import Navbar from './components/Navbar'; // Import Navbar component
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot'; // Import the Chatbot component
import ServicesPage from './pages/services';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/form" element={<InterviewForm />} />
            <Route path="/interview" element={<ChatbotInterview />} />
            <Route path="/learning" element={<LearningPlanForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* Add the route for the Chatbot component */}
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
