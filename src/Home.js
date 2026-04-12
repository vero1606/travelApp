// src/pages/Home.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryColors = {
  history: '#e8d5b7', culture: '#d4edda', food: '#fde8d8',
  beach: '#d0eaf8', nature: '#d4edda', nightlife: '#e8d0f8',
  art: '#ffd6e7', mountains: '#d8f0e8', shopping: '#fff3cd',
  default: '#f0f0f0',
};

function getCategoryColor(category) {
  if (!category) return categoryColors.default;
  const first = category.split(',')[0].trim().toLowerCase();
  return categoryColors[first] || categoryColors.default;
}

function DestinationCard({ dest }) {
  const tags = dest.category ? dest.category.split(',').slice(0, 4) : [];
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
    >
      <div style={{ height: 8, background: getCategoryColor(dest.category) }} />

      <div style={{ padding: '1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{dest.city}</h3>
            <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.85rem' }}>🌍 {dest.country}</p>
          </div>
        </div>

        <div style={{ marginTop: '0.7rem', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              background: '#f0f4ff', color: '#3b5bdb',
              padding: '2px 9px', borderRadius: 20, fontSize: '0.73rem', fontWeight: 500,
            }}>
              {tag.trim()}
            </span>
          ))}
          {dest.category && dest.category.split(',').length > 4 && (
            <span style={{ color: '#999', fontSize: '0.73rem', padding: '2px 4px' }}>
              +{dest.category.split(',').length - 4} more
            </span>
          )}
        </div>

        <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#555', borderTop: '1px solid #f0f0f0', paddingTop: '0.7rem' }}>
          🗓️ <strong>Best time:</strong> {dest.bestTimeToTravel || 'Year-round'}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async (query = '') => { //fetches data from MongoDB
    try {
      setLoading(true);
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const { data } = await axios.get(`http://localhost:8000/api/destinations${params}`); //pulls data from server.js
      setDestinations(data);
    } catch (err) {
      setError('Failed to load destinations. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { //method that controls the search bar
    const val = e.target.value;
    setSearch(val);
    setTimeout(() => fetchDestinations(val), 300);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>🌏 Travel Destinations</h1>
        <p style={{ margin: '0.6rem 0 1.8rem', opacity: 0.85, fontSize: '1.05rem' }}>
          Explore {destinations.length} destinations around the world
        </p>
        <input
          type="text"
          placeholder="Search by city or category (e.g. beach, food, history...)"
          value={search}
          onChange={handleSearch} //search bar
          style={{
            width: '100%', maxWidth: 520, padding: '0.75rem 1.2rem',
            borderRadius: 30, border: 'none', fontSize: '1rem',
            outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', color: '#c00' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem' }}>✈️</div>
            <p>Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem' }}>🔍</div>
            <p>No destinations found for "{search}"</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#888', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
              Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
              {search && ` for "${search}"`}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.2rem',
            }}>
              {destinations.map(dest => (
                <DestinationCard key={dest._id} dest={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
