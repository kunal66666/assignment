import  { useState, useEffect } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Heart } from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analytics/overview`)
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  if (!analytics) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const categoryData = analytics.categoryStats.map(stat => ({
    name: stat._id,
    value: stat.count
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <div className="space-y-2">
            <p>Total Users: {analytics.totalUsers}</p>
            <p>Total Kudos: {analytics.totalKudos}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Top Receivers</h2>
          <div className="space-y-2">
            {analytics.topReceivers.map((user, index) => (
              <div key={user._id} className="flex justify-between">
                <span>{user.name}</span>
                <span>{user.kudosCount} kudos</span>
              </div>
            ))}
          </div>
        </div>
        {analytics.mostLikedKudos && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Most Liked Kudos</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="text-red-500 w-5 h-5" />
                <span className="font-semibold">{analytics.mostLikedKudos.likeCount} likes</span>
              </div>
              <p className="text-sm text-gray-600">
                From: {analytics.mostLikedKudos.fromUser[0]?.name}<br />
                To: {analytics.mostLikedKudos.toUser[0]?.name}
              </p>
              <p className="mt-2 text-gray-800">"{analytics.mostLikedKudos.message}"</p>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Kudos by Category</h2>
          <div className="h-64">
            <BarChart width={600} height={200} data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;