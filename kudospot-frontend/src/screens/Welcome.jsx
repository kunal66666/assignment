import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Welcome = ({ onEnter }) => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      toast.error('Error loading users. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setName(value);
    const filtered = value
      ? users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()))
      : [];
    setSuggestions(filtered);
  };

  const handleUserSelect = (user) => {
    setName(user.name);
    setSuggestions([]);
    onEnter(user);
    toast.success('Welcome back!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const matchedUser = users.find(
        (user) => user.name.toLowerCase() === name.toLowerCase()
      );

      if (matchedUser) {
        handleUserSelect(matchedUser);
      } else {
        toast.error(
          'This name is not registered in our organization. Please check the name or contact HR.'
        );
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to KudoSpot</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto z-10">
                {suggestions.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.department}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Start typing to see suggestions
        </p>
      </div>
    </div>
  );
};

export default Welcome;
