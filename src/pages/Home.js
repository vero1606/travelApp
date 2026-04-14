// src/pages/Home.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// ── Booking Modal 
function BookingModal({ destination, onClose, navigate }) {
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', checkIn: '', checkOut: '', guests: '1', notes: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.checkIn) e.checkIn = 'Required';
    if (!form.checkOut) e.checkOut = 'Required';
    if (form.checkIn && form.checkOut && form.checkIn >= form.checkOut) e.checkOut = 'Must be after check-in';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      const userId = localStorage.getItem('userId') || 'guest';
      const key = `tripBookings_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newBooking = {
        id: Date.now(),
        city: destination.city,
        country: destination.country,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        status: 'Confirmed',
        color: getCategoryColor(destination.category),
      };
      localStorage.setItem(key, JSON.stringify([...existing, newBooking]));
      setStep('confirm');
    }
  };

  if (!destination) return null;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 460, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.18s ease' }}>

        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', padding: '1.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>Book a Trip</h3>
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{destination.city}, {destination.country}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {step === 'confirm' ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></div>
            <h3 style={{ margin: '0 0 0.4rem', color: '#1e3a5f', fontSize: '1.3rem', fontWeight: 800 }}>Trip Booked!</h3>
            <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Thanks <strong>{form.name}</strong>! Your trip to <strong>{destination.city}</strong> has been confirmed.
            </p>
            <div style={{ background: '#f8faff', borderRadius: 12, padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              {[
                { label: 'Destination', value: `${destination.city}, ${destination.country}` },
                { label: 'Check-in', value: form.checkIn },
                { label: 'Check-out', value: form.checkOut },
                { label: 'Guests', value: form.guests },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontSize: '0.83rem', color: '#888' }}>{row.label}</span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#333' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Confirmation sent to <strong>{form.email}</strong>
            </p>
            {/* Find a property prompt */}
            <div style={{ background: '#f0f4ff', borderRadius: 14, padding: '1.2rem', marginBottom: '0.8rem', border: '1.5px solid #dbeafe' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}></div>
              <p style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a5f' }}>
                Need a place to stay in {destination.city}?
              </p>
              <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: '#666' }}>
                Browse properties and find your perfect accommodation.
              </p>
              <div style={{ display: 'flex', gap: '0.7rem' }}>
                <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  No thanks
                </button>
                <button onClick={() => { onClose(); navigate('/search'); }} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  Find a Property →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            {destination.bestTimeToTravel && (
              <div style={{ background: '#f0f4ff', borderRadius: 10, padding: '0.7rem 1rem', marginBottom: '1.2rem', fontSize: '0.83rem', color: '#3b5bdb' }}>
                <strong>Best time to visit:</strong> {destination.bestTimeToTravel}
              </div>
            )}

            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, border: `1.5px solid ${errors[f.key] ? '#f87171' : '#e0e0e0'}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#3b5bdb'}
                  onBlur={e => e.target.style.borderColor = errors[f.key] ? '#f87171' : '#e0e0e0'}
                />
                {errors[f.key] && <p style={{ margin: '3px 0 0', color: '#ef4444', fontSize: '0.75rem' }}>{errors[f.key]}</p>}
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.9rem' }}>
              {[{ label: 'Check-in', key: 'checkIn' }, { label: 'Check-out', key: 'checkOut' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <input type="date" value={form[f.key]} onChange={set(f.key)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, border: `1.5px solid ${errors[f.key] ? '#f87171' : '#e0e0e0'}`, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {errors[f.key] && <p style={{ margin: '3px 0 0', color: '#ef4444', fontSize: '0.75rem' }}>{errors[f.key]}</p>}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Guests</label>
              <select value={form.guests} onChange={set('guests')} style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} guest{n > '1' ? 's' : ''}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.3rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes (optional)</label>
              <textarea placeholder="Any special requests or notes..." value={form.notes} onChange={set('notes')} rows={2}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#3b5bdb'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <button onClick={handleConfirm} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              Confirm Booking
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ── Destination Modal 
function Modal({ dest, onClose, onBook }) {
  if (!dest) return null;
  const tags = dest.category ? dest.category.split(',') : [];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.18s ease' }}>
        <div style={{ background: getCategoryColor(dest.category), padding: '2rem 2rem 1.5rem', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#111' }}>{dest.city}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '1rem', color: '#444' }}>🌍 {dest.country}</p>
        </div>
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <div style={{ background: '#f8faff', borderRadius: 10, padding: '0.9rem 1.1rem', marginBottom: '1.3rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.3rem' }}></span>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Time to Visit</p>
              <p style={{ margin: '3px 0 0', fontSize: '0.95rem', color: '#333', fontWeight: 500 }}>{dest.bestTimeToTravel || 'Year-round'}</p>
            </div>
          </div>
          <p style={{ margin: '0 0 0.7rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What to expect</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ background: '#f0f4ff', color: '#3b5bdb', padding: '5px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500 }}>{tag.trim()}</span>
            ))}
          </div>
          <button onClick={() => { onClose(); onBook(dest); }} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            Book a Trip Here
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ── Destination Card 
function DestinationCard({ dest, onClick }) {
  const tags = dest.category ? dest.category.split(',').slice(0, 4) : [];
  return (
    <div onClick={() => onClick(dest)} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
    >
      <div style={{ height: 8, background: getCategoryColor(dest.category) }} />
      <div style={{ padding: '1.1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{dest.city}</h3>
        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.85rem' }}>{dest.country}</p>
        <div style={{ marginTop: '0.7rem', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{ background: '#f0f4ff', color: '#3b5bdb', padding: '2px 9px', borderRadius: 20, fontSize: '0.73rem', fontWeight: 500 }}>{tag.trim()}</span>
          ))}
          {dest.category && dest.category.split(',').length > 4 && (
            <span style={{ color: '#999', fontSize: '0.73rem', padding: '2px 4px' }}>+{dest.category.split(',').length - 4} more</span>
          )}
        </div>
        <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#555', borderTop: '1px solid #f0f0f0', paddingTop: '0.7rem' }}>
          <strong>Best time:</strong> {dest.bestTimeToTravel || 'Year-round'}
        </div>
      </div>
    </div>
  );
}

// ── Page 
function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async (query = '') => {
    try {
      setLoading(true);
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const { data } = await axios.get(`http://localhost:3001/api/destinations${params}`);
      setDestinations(data);
    } catch (err) {
      setError('Failed to load destinations. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setTimeout(() => fetchDestinations(val), 300);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff' }}>
      <Modal dest={selected} onClose={() => setSelected(null)} onBook={dest => setBooking(dest)} />
      <BookingModal destination={booking} onClose={() => setBooking(null)} navigate={navigate} />

      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)', padding: '3rem 2rem', textAlign: 'center', color: '#fff', position: 'relative' }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem' }}>← Back</button>
        <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>Travel Destinations</h1>
        <p style={{ margin: '0.6rem 0 1.8rem', opacity: 0.85, fontSize: '1.05rem' }}>
          Explore {destinations.length} destinations around the world
        </p>
        <input type="text" placeholder="Search by city or category (e.g. beach, food, history...)" value={search} onChange={handleSearch}
          style={{ width: '100%', maxWidth: 520, padding: '0.75rem 1.2rem', borderRadius: 30, border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {error && <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', color: '#c00' }}>{error}</div>}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem' }}>✈️</div>
            <p>Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem' }}></div>
            <p>No destinations found for "{search}"</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#888', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
              Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''}{search && ` for "${search}"`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {destinations.map(dest => (
                <DestinationCard key={dest._id} dest={dest} onClick={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;