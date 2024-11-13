import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { db, storage } from '../firebase'; // Ensure you have the correct imports for Firebase
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ProfileDashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    country: ''
  });

  // Image upload handling
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        showNotification('Profile picture updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  // Handle form submission and save data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    try {
      if (profileImage) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `profileImages/${Date.now()}`);
        const uploadTask = uploadBytesResumable(imageRef, profileImage);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // You can track the progress if needed here
          },
          (error) => {
            console.error('Image upload failed:', error);
            showNotification('Error uploading image', 'error');
          },
          async () => {
            // Get the image download URL
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Save form data and image URL to Firestore
            await addDoc(collection(db, 'UserProfiles'), {
              ...formData,
              profileImage: imageUrl,
              createdAt: new Date(),
            });

            showNotification('Profile successfully updated!', 'success');
            // Clear form data and image after submission
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              dateOfBirth: '',
              city: '',
              country: ''
            });
            setProfileImage(null);
          }
        );
      } else {
        showNotification('Please upload a profile image', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Error saving changes', 'error');
    }
  };

  // Handle phone number formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    const match = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}`;
    setFormData({ ...formData, phone: value });
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-white py-8 px-4 animate-gradient-xy">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Profile Dashboard
          </h1>
          <p className="text-gray-300 text-xl font-light tracking-wide">
            Manage your personal information with style
          </p>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-12 group">
          <div 
            className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 animate-spin-slow cursor-pointer hover:scale-105 transition-transform duration-500 ease-out"
            onClick={() => document.getElementById('avatar-input').click()}
          >
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl animate-bounce spin-slow 5s">👤</span>
              )}
            </div>
          </div>
          <button 
            className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transform hover:scale-110 transition-all duration-300 animate-pulse group-hover:animate-none"
            onClick={() => document.getElementById('avatar-input').click()}
          >
            <Camera className="w-6 h-6" />
          </button>
          <input
            type="file"
            id="avatar-input"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  Email Address
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  Date of Birth
                </label>
                <input
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your birthdate"
                  required
                  type="date"
                />
              </div>
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your city"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="group">
                <label className="block text-gray-300 text-sm mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  Country
                </label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transform transition-all duration-300 hover:border-purple-500"
                  placeholder="Enter your country"
                  required
                />
              </div>
            </div>

            <div className="text-center mt-8">
              <button 
                type="submit" 
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
