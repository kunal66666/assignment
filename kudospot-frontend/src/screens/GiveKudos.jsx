
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const GiveKudos = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data.filter(user => user._id !== currentUser._id)));
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kudos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: currentUser._id,
          to: selectedUser,
          category,
          message
        })
      });
      
      if (response.ok) {
        setSelectedUser('');
        setCategory('');
        setMessage('');
        toast.success('Kudos sent successfully!');
      } else {
        throw new Error('Failed to send kudos');
      }
    } catch (error) {
      toast.error('Error sending kudos. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Give Kudos</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a colleague</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a Badges</option>
              <option value="Teamwork">Teamwork</option>
              <option value="Innovation">Innovation</option>
              <option value="Clinet Focus">Clinet Focus</option>
              <option value="Above and Beyond">Above and Beyond</option>
              <option value="Excellence">Excellence</option>
              <option value="Helping Hand">Helping Hand</option>
            </select>
          </div>
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write your kudos message..."
              rows="4"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Send Kudos
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveKudos;

