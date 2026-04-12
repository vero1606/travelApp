// src/pages/Dashboard.js
import { useNavigate } from 'react-router-dom';

const tiles = [
  {
    id: 'destinations',
    title: 'Travel Destinations',
    description: 'Explore 111 destinations across the world',
    emoji: '🌍',
    color: '#dbeafe',
    path: '/destinations',
  },
  {
    id: 'search',
    title: 'Search Properties',
    description: 'Find your perfect stay anywhere',
    emoji: '🏠',
    color: '#dcfce7',
    path: '/search',
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'View and manage your trips',
    emoji: '📅',
    color: '#fef9c3',
    path: '/profile',
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Chat with hosts and guests',
    emoji: '💬',
    color: '#fce7f3',
    path: '/messages',
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Legend */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)',
        padding: '3rem 2rem 5rem',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
          🌏 Welcome to TravelApp
        </h1>
        <p style={{ margin: '0.6rem 0 0', opacity: 0.8, fontSize: '1.05rem' }}>
          Your all-in-one travel companion
        </p>
      </div>

      {/* Tiles */}
      <div style={{ maxWidth: 1200, margin: '2.5rem auto 0', padding: '2.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2.2rem',
        }}>
          {tiles.map(tile => (
            <div
              key={tile.id}
              onClick={() => navigate(tile.path)}
              style={{
                background: '#fff', borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '2.4rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '1.2rem',
                transition: 'transform 0.18s, box-shadow 0.18s',
                border: '1px solid #f0f0f0',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: 80, height: 100, borderRadius: 12,
                background: tile.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', flexShrink: 0,
              }}>
                {tile.emoji}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>
                  {tile.title}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#777' }}>
                  {tile.description}
                </p>
              </div>
              <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: '1.4rem' }}>›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;