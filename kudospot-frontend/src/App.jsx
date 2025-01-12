import  { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import GiveKudos from './screens/GiveKudos';
import Analytics from './screens/Analytics';

const Navigation = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">KudoSpot</div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/give-kudos" className="hover:text-gray-300">Give Kudos</Link>
        <Link to="/analytics" className="hover:text-gray-300">Analytics</Link>
      </div>
    </div>
  </nav>
);

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <div>
        {currentUser && <Navigation />}
        
        <main className="min-h-screen bg-gray-100">
          <Routes>
            <Route 
              path="/welcome" 
              element={
                currentUser ? 
                  <Navigate to="/" replace /> : 
                  <Welcome onEnter={setCurrentUser} />
              } 
            />

            <Route
              path="/"
              element={
                <ProtectedRoute user={currentUser}>
                  <Home currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/give-kudos"
              element={
                <ProtectedRoute user={currentUser}>
                  <GiveKudos currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute user={currentUser}>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route 
              path="*" 
              element={
                <Navigate to={currentUser ? "/" : "/welcome"} replace />
              } 
            />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
