import { useState, useEffect } from 'react';
import { Heart, BarChart2, Send, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BADGE_EMOJIS = {
  'Teamwork': '👥',
  'Innovation': '💡',
  'Client Focus': '🎯',
  'Above and Beyond': '⭐',
  'Excellence': '🏆',
  'Helping Hand': '🤝'
};

const Home = ({ currentUser }) => {
  const [kudos, setKudos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kudos?userId=${currentUser._id}`)
      .then(res => res.json())
      .then(data => setKudos(data));
  }, [currentUser._id]);

  const handleLike = async (kudoId) => {
    const res = await  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kudos/${kudoId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id })
    });
    const data = await res.json();
    setKudos(prev =>
      prev.map(kudo =>
        kudo._id === kudoId ? { ...kudo, likeCount: data.likes, likedByCurrentUser: !kudo.likedByCurrentUser } : kudo
      )
    );
  };

  const ChatBubble = ({ kudo }) => {
    const isCurrentUserKudo = kudo.from._id === currentUser._id;

    return (
      <div className={`flex ${isCurrentUserKudo ? 'justify-end' : 'justify-start'} mb-6 group`}>
        <div className="flex flex-col max-w-[85%]">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-50 rounded-full px-4 py-2 flex items-center gap-2">
              <span>{kudo.from.name}</span>
              <Award className="w-4 h-4 text-blue-500" />
              <span className="text-xl" role="img" aria-label={kudo.category}>
                {BADGE_EMOJIS[kudo.category]}
              </span>
              <span className="text-blue-500">→</span>
              <span className="font-medium text-blue-700">{kudo.to.name}</span>
            </div>
          </div>
          
          <div className={`rounded-2xl p-4 ${kudo.likedByCurrentUser ? 'bg-blue-100' : 'bg-white'}`}>
            <p className="mb-3">{kudo.message}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2">
                  {BADGE_EMOJIS[kudo.category]} {kudo.category}
                </span>
                <button 
                  onClick={() => handleLike(kudo._id)} 
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300
                    ${kudo.likedByCurrentUser 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${kudo.likedByCurrentUser ? 'fill-current' : ''}`} 
                  />
                  <span className="text-sm font-medium">{kudo.likeCount || 0}</span>
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(kudo.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white bg-opacity-80 border-b border-gray-200">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome, {currentUser.name}! 👋
                </h1>
                <p className="text-sm text-gray-600">Share your appreciation with the team</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {kudos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <Award className="w-12 h-12 text-blue-500" />
              <p className="text-lg">No kudos yet. Be the first to appreciate someone!</p>
            </div>
          ) : (
            kudos.map(kudo => (
              <ChatBubble key={kudo._id} kudo={kudo} />
            ))
          )}
        </div>
      </div>


      <div className="sticky bottom-0 backdrop-blur-md bg-white bg-opacity-80 border-t border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => navigate('/give-kudos')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Send className="w-5 h-5" />
            <span className="font-medium">Give Kudos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;