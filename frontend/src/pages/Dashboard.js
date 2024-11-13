import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Home, 
  History, 
  LineChart, 
  User, 
  Settings, 
  Shield, 
  Menu, 
  Plus,
  Mail 
} from 'lucide-react';
import { collection, addDoc, getDocs,  } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    serialNo: '',
    fraudType: '',
    description: '',
    isFraudulent: 'no'
  });
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    fetchEntries();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = entries.filter(entry => 
      Object.values(entry).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredEntries(filtered);
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'dashboard'));
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(fetchedEntries);
      setFilteredEntries(fetchedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'dashboard'), formData);
      setFormData({
        serialNo: '',
        fraudType: '',
        description: '',
        isFraudulent: 'no'
      });
      fetchEntries();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm h-[70px] z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-primary p-2">
                <Menu size={24} />
              </button>
              <div className="flex items-center ml-3">
                <Shield size={24} className="text-pink-600" />
                <span className="text-2xl font-bold ml-2 bg-gradient-to-r from-blue-900 to-pink-600 text-transparent bg-clip-text">
                  Fraudect
                </span>
              </div>
            </div>

            <div className="hidden md:block w-[40%]">
              <div className="relative">
                <input
                  type="search"
                  className="w-full rounded-full border px-4 py-2 pr-10"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Bell className="text-gray-500" size={20} />
              <Mail className="text-gray-500" size={20} />
              <img src="/api/placeholder/40/40" alt="Profile" className="rounded-full w-10 h-10" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-[70px] flex">
        {/* Sidebar */}
        <div className={`fixed lg:static bg-gradient-to-br from-blue-900 to-pink-600 text-white h-[calc(100vh-70px)] transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'
        }`}>
          <div className="py-3">
            <div className="flex flex-col">
              {[
                { icon: <Home size={20} />, text: 'Dashboard', active: true },
                { icon: <Bell size={20} />, text: 'Alerts' },
                { icon: <History size={20} />, text: 'Transaction History' },
                { icon: <LineChart size={20} />, text: 'Analytics' },
                { icon: <User size={20} />, text: 'Profile' },
                { icon: <Settings size={20} />, text: 'Settings' }
              ].map((item, index) => (
                <a
                  key={index}
                  href="/"
                  className={`flex items-center px-4 py-2 hover:bg-white/10 transition-colors ${
                    item.active ? 'bg-white/20' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-3'
        }`}>
          {/* Add Entry Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Fraud Detection Entries</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add New Entry
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial No
                    </label>
                    <input
                      type="text"
                      name="serialNo"
                      value={formData.serialNo}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type of Fraud
                    </label>
                    <select
                      name="fraudType"
                      value={formData.fraudType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 border p-2"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Identity Theft">Identity Theft</option>
                      <option value="Credit Card Fraud">Credit Card Fraud</option>
                      <option value="Phishing">Phishing</option>
                      <option value="Wire Fraud">Wire Fraud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fraudulent
                    </label>
                    <select
                      name="isFraudulent"
                      value={formData.isFraudulent}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 border p-2"
                      required
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 border p-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Entries Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type of Fraud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fraudulent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.serialNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.fraudType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.isFraudulent === 'yes' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.isFraudulent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;