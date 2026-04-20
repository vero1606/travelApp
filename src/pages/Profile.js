// src/pages/Profile.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UNSPLASH_KEY = 'j6037wgdkYswYf-VLWyWHOsGJvtqnH33OfA3bAIREok';

const styleKeywords = {
  'Explorer':     ['history', 'ancient ruins', 'culture', 'heritage', 'adventure', 'trekking', 'mountains'],
  'Relaxed':      ['beach', 'island', 'resort', 'lagoon', 'spa', 'peaceful', 'scenic'],
  'Adventure':    ['hiking', 'trekking', 'mountains', 'surfing', 'diving', 'safari', 'volcanoes', 'canyon'],
  'Cultural':     ['culture', 'history', 'museums', 'art', 'architecture', 'temples', 'heritage', 'mythology'],
  'Beach lover':  ['beach', 'island', 'snorkeling', 'diving', 'coral', 'lagoon', 'surfing'],
};
const climateKeywords = {
  'Warm':     ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct'],
  'Cold':     ['dec', 'jan', 'feb', 'nov'],
  'Tropical': ['jun', 'jul', 'aug', 'sep', 'oct', 'nov'],
  'Mild':     ['apr', 'may', 'sep', 'oct'],
  'Any':      [],
};
const lengthKeywords = {
  'Weekend':    ['city', 'culture', 'museums', 'nightlife', 'canals'],
  '3–5 days':   ['city', 'culture', 'history', 'food', 'beach'],
  '1–2 weeks':  ['nature', 'mountains', 'safari', 'beach', 'island', 'temples'],
  '3+ weeks':   ['adventure', 'trekking', 'hiking', 'national park', 'wildlife', 'mountains'],
};

function scoreDestination(dest, prefs) {
  let score = 0;
  const cats = (dest.category || '').toLowerCase();
  const best = (dest.bestTimeToTravel || '').toLowerCase();
  (styleKeywords[prefs.style] || []).forEach(k => { if (cats.includes(k)) score += 3; });
  const months = climateKeywords[prefs.climate] || [];
  if (months.length === 0) score += 1;
  months.forEach(m => { if (best.includes(m)) score += 1; });
  (lengthKeywords[prefs.length] || []).forEach(k => { if (cats.includes(k)) score += 2; });
  return score;
}

const categoryColors = {
  history: '#e8d5b7', culture: '#d4edda', food: '#fde8d8',
  beach: '#d0eaf8', nature: '#d4edda', nightlife: '#e8d0f8',
  art: '#ffd6e7', mountains: '#d8f0e8', shopping: '#fff3cd',
  default: '#dbeafe',
};
function getCategoryColor(category) {
  if (!category) return categoryColors.default;
  const first = (category.split(',')[0] || '').trim().toLowerCase();
  return categoryColors[first] || categoryColors.default;
}

// ── Unsplash photo fetcher ────────────────────────────────────────────────────
const photoCache = {};
async function fetchCityPhoto(city, country) {
  const key = `${city},${country}`;
  if (photoCache[key] !== undefined) return photoCache[key];
  try {
    const { data } = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: `${city} ${country} travel`, per_page: 1, orientation: 'landscape' },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    const url = data.results?.[0]?.urls?.regular || null;
    photoCache[key] = url;
    return url;
  } catch {
    photoCache[key] = null;
    return null;
  }
}

// ── Recommendation Card ───────────────────────────────────────────────────────
function RecCard({ dest, onClick }) {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCityPhoto(dest.city, dest.country).then(url => {
      setPhoto(url);
      setLoading(false);
    });
  }, [dest.city, dest.country]);

  return (
    <div onClick={onClick}
      style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.09)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.09)'; }}
    >
      <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 24, height: 24, border: '3px solid #e0e0e0', borderTop: '3px solid #3b5bdb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        {!loading && photo && (
          <img src={photo} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        {!loading && !photo && (
          <div style={{ position: 'absolute', inset: 0, background: getCategoryColor(dest.category) }} />
        )}
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <span style={{ background: 'rgba(30,58,95,0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
            Book
          </span>
        </div>
      </div>
      <div style={{ padding: '0.75rem 0.9rem' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{dest.city}</p>
        <p style={{ margin: '2px 0 6px', color: '#888', fontSize: '0.8rem' }}>{dest.country}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(dest.category || '').split(',').slice(0, 2).map((tag, i) => (
            <span key={i} style={{ background: '#f0f4ff', color: '#3b5bdb', padding: '2px 7px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 500 }}>{tag.trim()}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Destination Info Modal ────────────────────────────────────────────────────
function DestModal({ dest, onClose, onBook }) {
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    if (dest) fetchCityPhoto(dest.city, dest.country).then(setPhoto);
  }, [dest]);

  if (!dest) return null;
  const tags = dest.category ? dest.category.split(',') : [];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.18s ease' }}>
        <div style={{ position: 'relative', height: 200 }}>
          {photo
            ? <img src={photo} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ height: '100%', background: getCategoryColor(dest.category) }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.5rem', color: '#fff' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{dest.city}</h2>
            <p style={{ margin: '2px 0 0', opacity: 0.85 }}>{dest.country}</p>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <div style={{ background: '#f8faff', borderRadius: 10, padding: '0.9rem 1.1rem', marginBottom: '1.3rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Time to Visit</p>
            <p style={{ margin: '3px 0 0', fontSize: '0.95rem', color: '#333', fontWeight: 500 }}>{dest.bestTimeToTravel || 'Year-round'}</p>
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

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ destination, onClose }) {
  const navigate = useNavigate();
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
      localStorage.setItem(key, JSON.stringify([...existing, {
        id: Date.now(), city: destination.city, country: destination.country,
        checkIn: form.checkIn, checkOut: form.checkOut, guests: form.guests,
        status: 'Confirmed', color: getCategoryColor(destination.category), emoji: '',
      }]));
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
            <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Confirmation sent to <strong>{form.email}</strong></p>
            <div style={{ background: '#f0f4ff', borderRadius: 14, padding: '1.2rem', border: '1.5px solid #dbeafe' }}>
              <p style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a5f' }}>Need a place to stay in {destination.city}?</p>
              <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: '#666' }}>Browse properties and find your perfect accommodation.</p>
              <div style={{ display: 'flex', gap: '0.7rem' }}>
                <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>No thanks</button>
                <button onClick={() => { onClose(); navigate('/search'); }} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Find a Property</button>
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
              <textarea placeholder="Any special requests..." value={form.notes} onChange={set('notes')} rows={2}
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

// ── Messages Tab ──────────────────────────────────────────────────────────────
const conversations = [
  { id: 1, name: 'Maria S.', property: 'Cosy Studio in Lisbon', lastMessage: 'Hi! Just to confirm your check-in time is 3pm.', time: '10:32 AM', unread: 2, avatar: 'M', color: '#fde8d8' },
  { id: 2, name: 'Wayan K.', property: 'Beachfront Villa in Bali', lastMessage: '', time: '', unread: 0, avatar: 'W', color: '#d0eaf8' },
  { id: 3, name: 'Yuki T.', property: 'Modern Flat in Tokyo', lastMessage: '', time: '', unread: 0, avatar: 'Y', color: '#d4edda' },
  { id: 4, name: 'Fiona M.', property: 'Charming Cottage in Edinburgh', lastMessage: '', time: '', unread: 0, avatar: 'F', color: '#e8d5b7' },
];
const messagesByConv = {
  1: [
    { id: 1, from: 'host', text: 'Hi! Welcome, so glad you booked with us.', time: '10:00 AM' },
    { id: 2, from: 'me', text: 'Thank you! Really excited for the trip.', time: '10:15 AM' },
    { id: 3, from: 'host', text: 'Just to confirm your check-in time is 3pm.', time: '10:32 AM' },
  ],
};

function MessagesTab() {
  const [selected, setSelected] = useState(conversations[0]);
  const messages = messagesByConv[selected?.id] || [];
  return (
    <div style={{ display: 'flex', gap: '1.2rem', height: 480 }}>
      <div style={{ width: 240, flexShrink: 0, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
          <input type="text" placeholder="Search..." style={{ width: '100%', padding: '0.45rem 0.8rem', borderRadius: 20, border: '1.5px solid #e0e0e0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {conversations.map(conv => (
          <div key={conv.id} onClick={() => setSelected(conv)} style={{ padding: '0.9rem 1rem', borderBottom: '1px solid #f8f8f8', cursor: 'pointer', background: selected?.id === conv.id ? '#f0f4ff' : '#fff', display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: conv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, color: '#555' }}>{conv.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{conv.name}</p>
                {conv.time && <p style={{ margin: 0, fontSize: '0.68rem', color: '#aaa' }}>{conv.time}</p>}
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.75rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.property}</p>
              <p style={{ margin: 0, fontSize: '0.73rem', color: '#bbb', fontStyle: conv.lastMessage ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.lastMessage || 'No messages yet'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: selected?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#555', fontSize: '0.85rem' }}>{selected?.avatar}</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{selected?.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{selected?.property}</p>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.85rem' }}>No messages yet</div>
          ) : messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', padding: '0.6rem 0.9rem', borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.from === 'me' ? 'linear-gradient(135deg, #1e3a5f, #3b5bdb)' : '#f0f4ff', color: msg.from === 'me' ? '#fff' : '#333', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {msg.text}
                <p style={{ margin: '3px 0 0', fontSize: '0.65rem', opacity: 0.65, textAlign: 'right' }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '0.7rem' }}>
          <input type="text" placeholder="Type a message... (coming soon)" disabled style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: 24, border: '1.5px solid #e0e0e0', fontSize: '0.85rem', outline: 'none', background: '#f8faff', color: '#aaa', cursor: 'not-allowed' }} />
          <button disabled style={{ background: '#e0e0e0', color: '#aaa', border: 'none', padding: '0.6rem 1rem', borderRadius: 24, cursor: 'not-allowed', fontWeight: 700, fontSize: '0.85rem' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── Shared Modal Components ───────────────────────────────────────────────────
function Overlay({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeIn 0.18s ease' }}>
        {children}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}
function ModalHeader({ title, onClose }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
      <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
    </div>
  );
}
function FieldInput({ label, type, placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = '#3b5bdb'}
        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
      />
    </div>
  );
}
function ModalButtons({ onCancel, onSave }) {
  return (
    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
      <button onClick={onCancel} style={{ flex: 1, padding: '0.75rem', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      <button onClick={onSave} style={{ flex: 1, padding: '0.75rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
    </div>
  );
}
function ErrorBox({ msg }) {
  return <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '0.6rem 0.9rem', color: '#c00', fontSize: '0.83rem', marginBottom: '1rem' }}>⚠️ {msg}</div>;
}
function EditInfoModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, location: user.location || '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handleSave = () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    onSave(form); onClose();
  };
  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Edit Profile" onClose={onClose} />
      <div style={{ padding: '1.5rem' }}>
        {error && <ErrorBox msg={error} />}
        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
          { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
          { label: 'Location', key: 'location', type: 'text', placeholder: 'City, Country' },
        ].map(f => <FieldInput key={f.key} {...f} value={form[f.key]} onChange={set(f.key)} />)}
        <ModalButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </Overlay>
  );
}
function EditPrefsModal({ prefs, onClose, onSave }) {
  const [form, setForm] = useState({ ...prefs });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const options = {
    budget: ['Budget', 'Mid-range', 'Luxury'],
    style: ['Explorer', 'Relaxed', 'Adventure', 'Cultural', 'Beach lover'],
    climate: ['Warm', 'Cold', 'Tropical', 'Mild', 'Any'],
    length: ['Weekend', '3–5 days', '1–2 weeks', '3+ weeks'],
  };
  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Travel Preferences" onClose={onClose} />
      <div style={{ padding: '1.5rem' }}>
        {[
          { label: 'Budget', key: 'budget' },
          { label: 'Travel Style', key: 'style' },
          { label: 'Preferred Climate', key: 'climate' },
          { label: 'Trip Length', key: 'length' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
            <select value={form[f.key]} onChange={set(f.key)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none', background: '#fff', cursor: 'pointer', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#3b5bdb'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            >
              {options[f.key].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
        <ModalButtons onCancel={onClose} onSave={() => { onSave(form); onClose(); }} />
      </div>
    </Overlay>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'guest';

  const [activeTab, setActiveTab] = useState('bookings');
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditPrefs, setShowEditPrefs] = useState(false);
  const [showListProperty, setShowListProperty] = useState(false);
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [bookingDest, setBookingDest] = useState(null);
  const [listingForm, setListingForm] = useState({
    title: '', location: '', type: 'Apartment',
    price: '', bedrooms: '1', guests: '1', description: '',
    image: null, imagePreview: null,
  });

  const [listings, setListings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`listings_${userId}`) || '[]'); } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('userData'); if (s) return JSON.parse(s); } catch {}
    return { name: 'User', email: '', location: '', memberSince: '' };
  });
  const [prefs, setPrefs] = useState(() => {
    try { const s = localStorage.getItem(`prefs_${userId}`); if (s) return JSON.parse(s); } catch {}
    return { budget: 'Mid-range', style: 'Explorer', climate: 'Warm', length: '1–2 weeks' };
  });
  const [tripBookings, setTripBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`tripBookings_${userId}`) || '[]'); } catch { return []; }
  });
  const [propertyBookings, setPropertyBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`propertyBookings_${userId}`) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/destinations');
        const scored = data
          .map(d => ({ ...d, score: scoreDestination(d, prefs) }))
          .filter(d => d.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        setRecommendations(scored);
      } catch {}
    };
    fetchRecs();
  }, [prefs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  const handleSavePrefs = (updated) => {
    const n = { ...prefs, ...updated };
    setPrefs(n);
    localStorage.setItem(`prefs_${userId}`, JSON.stringify(n));
  };
  const cancelTrip = (id) => {
    const u = tripBookings.filter(b => b.id !== id);
    setTripBookings(u);
    localStorage.setItem(`tripBookings_${userId}`, JSON.stringify(u));
  };
  const cancelPropertyBooking = (id) => {
    const u = propertyBookings.filter(b => b.id !== id);
    setPropertyBookings(u);
    localStorage.setItem(`propertyBookings_${userId}`, JSON.stringify(u));
  };
  const handleSaveUser = (updated) => {
    const n = { ...user, ...updated };
    setUser(n);
    localStorage.setItem('userData', JSON.stringify(n));
  };
  const addListing = () => {
    if (listingForm.title && listingForm.location && listingForm.price) {
      const n = [...listings, { ...listingForm, id: Date.now() }];
      setListings(n);
      localStorage.setItem(`listings_${userId}`, JSON.stringify(n));
      setListingSubmitted(true);
    }
  };
  const saveListing = (id) => {
    const u = listings.map(x => x.id === id ? { ...x, ...editForm } : x);
    setListings(u);
    localStorage.setItem(`listings_${userId}`, JSON.stringify(u));
    setEditingId(null);
  };
  const deleteListing = (id) => {
    const r = listings.filter(x => x.id !== id);
    setListings(r);
    localStorage.setItem(`listings_${userId}`, JSON.stringify(r));
  };
  const resetListing = () => {
    setShowListProperty(false);
    setListingSubmitted(false);
    setListingForm({ title: '', location: '', type: 'Apartment', price: '', bedrooms: '1', guests: '1', description: '', image: null, imagePreview: null });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Segoe UI', sans-serif" }}>

      {showEditInfo && <EditInfoModal user={user} onClose={() => setShowEditInfo(false)} onSave={handleSaveUser} />}
      {showEditPrefs && <EditPrefsModal prefs={prefs} onClose={() => setShowEditPrefs(false)} onSave={handleSavePrefs} />}
      <DestModal dest={selectedDest} onClose={() => setSelectedDest(null)} onBook={(d) => { setSelectedDest(null); setBookingDest(d); }} />
      <BookingModal destination={bookingDest} onClose={() => setBookingDest(null)} />

      {/* List Property Modal */}
      {showListProperty && (
        <div onClick={resetListing} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.18s ease' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>List a Property</h3>
              <button onClick={resetListing} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {listingSubmitted ? (
              <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#1e3a5f', fontSize: '1.3rem', fontWeight: 800 }}>Property Listed!</h3>
                <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '1.5rem' }}><strong>{listingForm.title}</strong> in {listingForm.location} saved.</p>
                <button onClick={resetListing} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <div style={{ padding: '1.5rem' }}>
                {[
                  { label: 'Property Title', key: 'title', type: 'text', placeholder: 'e.g. Cosy Studio in Lisbon' },
                  { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Lisbon, Portugal' },
                  { label: 'Price per night', key: 'price', type: 'text', placeholder: 'e.g. £80 / night' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={listingForm[f.key]} onChange={e => setListingForm({ ...listingForm, [f.key]: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#3b5bdb'} onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Type', key: 'type', options: ['Apartment', 'House', 'Villa', 'Studio', 'Cottage'] },
                    { label: 'Bedrooms', key: 'bedrooms', options: ['1', '2', '3', '4', '5+'] },
                    { label: 'Max Guests', key: 'guests', options: ['1', '2', '3', '4', '5', '6', '7', '8'] },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                      <select value={listingForm[f.key]} onChange={e => setListingForm({ ...listingForm, [f.key]: e.target.value })}
                        style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                  <textarea placeholder="Describe your property..." value={listingForm.description} onChange={e => setListingForm({ ...listingForm, description: e.target.value })}
                    rows={3} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#3b5bdb'} onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <div style={{ marginBottom: '1.3rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Property Photo</label>
                  {listingForm.imagePreview && <img src={listingForm.imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 8, display: 'block' }} />}
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) setListingForm({ ...listingForm, image: file, imagePreview: URL.createObjectURL(file) }); }} style={{ width: '100%', fontSize: '0.88rem', color: '#555', padding: '0.4rem 0' }} />
                </div>
                <button onClick={addListing} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Submit Listing</button>
              </div>
            )}
          </div>
          <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)', padding: '2rem 2rem 0', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem' }}>Back</button>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Log Out</button>
        </div>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>User Profile</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['bookings', 'messages', 'list property'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'none', border: 'none',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: activeTab === tab ? 700 : 400,
              fontSize: '0.9rem', cursor: 'pointer', padding: '0 0 0.8rem',
              borderBottom: activeTab === tab ? '2px solid #fff' : '2px solid transparent',
              textTransform: 'capitalize',
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: activeTab === 'messages' ? 900 : 600, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {activeTab === 'messages' && <MessagesTab />}

        {/* List Property Tab */}
        {activeTab === 'list property' && (
          <div>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#aaa' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#555', fontWeight: 700 }}>No properties listed yet</h3>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem' }}>When you list a property it will appear here.</p>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Your Listings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {listings.map(l => (
                    <div key={l.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                      {l.imagePreview && <img src={l.imagePreview} alt={l.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />}
                      {editingId === l.id ? (
                        <div style={{ padding: '1.2rem' }}>
                          {[{ label: 'Title', key: 'title', placeholder: 'Property title' }, { label: 'Location', key: 'location', placeholder: 'Location' }, { label: 'Price per night', key: 'price', placeholder: '£80 / night' }].map(f => (
                            <div key={f.key} style={{ marginBottom: '0.8rem' }}>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase' }}>{f.label}</label>
                              <input value={editForm[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                                style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = '#3b5bdb'} onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                              />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '0.7rem' }}>
                            <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>Cancel</button>
                            <button onClick={() => saveListing(l.id)} style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' }}>Save</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{l.title}</h3>
                            <p style={{ margin: '3px 0', color: '#888', fontSize: '0.85rem' }}>{l.location}</p>
                            <p style={{ margin: '3px 0', color: '#888', fontSize: '0.85rem' }}>{l.price} · {l.type} · {l.bedrooms} bed · {l.guests} guests</p>
                            {l.description && <p style={{ margin: '6px 0 0', color: '#666', fontSize: '0.82rem', lineHeight: 1.5 }}>{l.description}</p>}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0, marginLeft: '1rem' }}>
                            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>Active</span>
                            <button onClick={() => { setEditingId(l.id); setEditForm({ title: l.title, location: l.location, price: l.price, description: l.description }); }}
                              style={{ background: '#f0f4ff', color: '#3b5bdb', border: 'none', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => deleteListing(l.id)}
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setShowListProperty(true)} style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>+ List a Property</button>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            {/* User info */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.2rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #3b5bdb, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{user.name}</h3>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '0.88rem' }}>{user.email}</p>
                {user.location && <p style={{ margin: '3px 0', color: '#666', fontSize: '0.88rem' }}>{user.location}</p>}
                {user.memberSince && <p style={{ margin: '3px 0', color: '#aaa', fontSize: '0.8rem' }}>Member since {user.memberSince}</p>}
              </div>
              <button onClick={() => setShowEditInfo(true)} style={{ background: '#1e3a5f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Edit</button>
            </div>

            {/* Trip Bookings */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', marginBottom: '1.2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>My Trip Bookings</h4>
              {tripBookings.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '0.88rem', textAlign: 'center', padding: '1rem 0', margin: 0 }}>No trips booked yet. Go to <strong>Travel Destinations</strong> to book one!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {tripBookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8faff', borderRadius: 12, padding: '0.9rem 1rem' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: b.color || '#dbeafe', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{b.city}, {b.country}</p>
                        <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.82rem' }}>{b.checkIn} → {b.checkOut} · {b.guests} guest{b.guests > '1' ? 's' : ''}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{b.status}</span>
                        <button onClick={() => cancelTrip(b.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Bookings */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', marginBottom: '1.2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>My Property Bookings</h4>
              {propertyBookings.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '0.88rem', textAlign: 'center', padding: '1rem 0', margin: 0 }}>No properties booked yet. Go to <strong>Search Properties</strong> to book one!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {propertyBookings.map(b => (
                    <div key={b.id} style={{ background: '#f8faff', borderRadius: 12, overflow: 'hidden' }}>
                      {b.image && <img src={b.image} alt={b.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />}
                      <div style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{b.title}</p>
                          <p style={{ margin: '2px 0', color: '#888', fontSize: '0.82rem' }}>{b.location} · {b.price}</p>
                          <p style={{ margin: '2px 0', color: '#888', fontSize: '0.82rem' }}>{b.checkIn} → {b.checkOut} · {b.guests} guest{b.guests > '1' ? 's' : ''}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0, marginLeft: '1rem' }}>
                          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{b.status}</span>
                          <button onClick={() => cancelPropertyBooking(b.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Travel Preferences</h4>
                <button onClick={() => setShowEditPrefs(true)} style={{ background: '#1e3a5f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Update</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {[
                  { label: 'Budget', key: 'budget' },
                  { label: 'Travel Style', key: 'style' },
                  { label: 'Preferred Climate', key: 'climate' },
                  { label: 'Trip Length', key: 'length' },
                ].map(p => (
                  <div key={p.key} style={{ background: '#f8faff', borderRadius: 10, padding: '0.8rem 1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.label}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 600, color: '#333' }}>{prefs[p.key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recommended for You</h4>
                <span style={{ fontSize: '0.78rem', color: '#888' }}>Based on your preferences</span>
              </div>
              {recommendations.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', textAlign: 'center', color: '#aaa', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>Update your preferences to get personalised recommendations</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {recommendations.map(dest => (
                    <RecCard key={dest._id} dest={dest} onClick={() => setSelectedDest(dest)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;