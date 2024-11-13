import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, FaBolt, FaChartLine, FaArrowRight, FaLock, 
  FaServer, FaUserShield, FaRegBell, FaFingerprint, FaCode 
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  // Animated background shapes component
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-72 h-72 bg-white/5 rounded-full -top-10 -left-10 animate-float-slow" />
      <div className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-20 -right-20 animate-float" />
      <div className="absolute w-48 h-48 bg-[#EC008C]/10 rounded-full top-1/2 left-1/4 animate-float-delayed" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00188f] to-[#EC008C] text-white overflow-hidden">
      {/* Hero Section with Enhanced Animation */}
      <section className="hero-section py-16 md:py-24 px-6 md:px-12 text-center relative">
        <BackgroundAnimation />
        <div className={`hero-content max-w-4xl mx-auto relative z-10 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Animated Icon Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8 opacity-75">
            {[FaLock, FaServer, FaUserShield].map((Icon, index) => (
              <div
                key={index}
                className="text-2xl animate-pulse"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Icon />
              </div>
            ))}
          </div>

          <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f0f0f0]">
            AI-Powered Fraud Detection
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaFingerprint className="text-2xl text-[#EC008C]" />
            <p className="text-lg md:text-xl opacity-90">
              Protecting Your Transactions in Real-Time
            </p>
          </div>
          <button
            onClick={handleGetStartedClick}
            className="cta-button group bg-white text-[#00188f] font-bold py-3 px-6 rounded-full hover:scale-105 transition-all duration-300 flex items-center mx-auto space-x-2"
          >
            <span>Start Protecting Now</span>
            <FaArrowRight className="transform group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Animated Stats Counter */}
        <div className="stats-counter grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          {[
            { icon: FaBolt, value: '90%', label: 'Accuracy Rate', delay: '0' },
            { icon: FaCode, value: '0.5s', label: 'Response Time', delay: '200' },
            { icon: FaRegBell, value: '24/7', label: 'Monitoring', delay: '400' }
          ].map((stat, index) => (
            <div
              key={index}
              className={`stat-box bg-white/10 backdrop-blur-md p-6 rounded-lg transform transition-all duration-1000 hover:bg-white/20 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${stat.delay}ms` }}
            >
              <stat.icon className="text-2xl mb-3 text-[#EC008C]" />
              <div className="stat-number text-3xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="stat-label text-sm opacity-75">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Features Section with Hover Effects */}
      <section className="features-section py-16 md:py-24 bg-white text-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-50" />
        <h2 className="text-center text-3xl font-bold mb-12 text-[#00188f]">
          Advanced Protection Features
        </h2>
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {[
            {
              icon: FaShieldAlt,
              title: "AI Detection",
              description: "Real-time pattern analysis with machine learning models"
            },
            {
              icon: FaRegBell,
              title: "Instant Alerts",
              description: "Immediate fraud notifications via SMS and email"
            },
            {
              icon: FaChartLine,
              title: "Analytics Dashboard",
              description: "Comprehensive transaction monitoring and reporting"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card group bg-white shadow-md rounded-xl p-6 hover:translate-y-[-5px] transition-all duration-300 hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00188f] to-[#EC008C] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="feature-icon text-[#00188f] text-3xl mb-4 transform group-hover:scale-110 transition-transform">
                <feature.icon />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section with Enhanced Animations */}
      <section className="workflow-section py-16 md:py-24 bg-[#f8f9fa]">
        <h2 className="text-center text-3xl font-bold mb-12 text-[#00188f]">How It Works</h2>
        <div className="workflow-steps grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          {[
            { icon: FaRegBell, title: "SMS Reception", description: "Secure transaction SMS intake" },
            { icon: FaServer, title: "Processing", description: "Data extraction and analysis" },
            { icon: FaBolt, title: "AI Analysis", description: "Pattern evaluation and detection" },
            { icon: FaUserShield, title: "Response", description: "Instant status notifications" }
          ].map((step, index) => (
            <div
              key={index}
              className="step-card group bg-white shadow-md rounded-xl p-6 relative hover:shadow-xl transition-all duration-300"
            >
              <div className="step-number absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-[#00188f] to-[#EC008C] text-white rounded-full flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <step.icon className="text-2xl text-[#00188f] mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#00188f]">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section py-16 md:py-24 text-center relative overflow-hidden">
        <BackgroundAnimation />
        <div className="relative z-10">
          <FaFingerprint className="text-4xl mx-auto mb-6 text-[#EC008C]" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Secure Your Business?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join the next generation of fraud prevention
          </p>
          <button
            onClick={handleGetStartedClick}
            className="cta-button group bg-white text-[#00188f] font-bold py-3 px-6 rounded-full hover:scale-105 transition-all duration-300 flex items-center mx-auto space-x-2"
          >
            <span>Get Started</span>
            <FaArrowRight className="transform group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;