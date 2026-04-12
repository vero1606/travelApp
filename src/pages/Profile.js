// src/pages/Profile.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Messages Tab Content ──────────────────────────────────────────────────────
const conversations = [
  {
    id: 1, name: 'Maria S.', property: 'Cosy Studio in Lisbon',
    lastMessage: 'Hi! Just to confirm your check-in time is 3pm.',
    time: '10:32 AM', unread: 2, avatar: 'M', color: '#fde8d8',
  },
  {
    id: 2, name: 'Wayan K.', property: 'Beachfront Villa in Bali',
    lastMessage: '', time: '', unread: 0, avatar: 'W', color: '#d0eaf8',
  },
  {
    id: 3, name: 'Yuki T.', property: 'Modern Flat in Tokyo',
    lastMessage: '', time: '', unread: 0, avatar: 'Y', color: '#d4edda',
  },
  {
    id: 4, name: 'Fiona M.', property: 'Charming Cottage in Edinburgh',
    lastMessage: '', time: '', unread: 0, avatar: 'F', color: '#e8d5b7',
  },
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
      {/* Left */}
      <div style={{
        width: 240, flexShrink: 0, background: '#fff', borderRadius: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden',
      }}>
        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
          <input type="text" placeholder="Search..." style={{
            width: '100%', padding: '0.45rem 0.8rem', borderRadius: 20,
            border: '1.5px solid #e0e0e0', fontSize: '0.82rem',
            outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        {conversations.map(conv => (
          <div key={conv.id} onClick={() => setSelected(conv)} style={{
            padding: '0.9rem 1rem', borderBottom: '1px solid #f8f8f8',
            cursor: 'pointer',
            background: selected?.id === conv.id ? '#f0f4ff' : '#fff',
            display: 'flex', gap: '0.7rem', alignItems: 'flex-start',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', background: conv.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, color: '#555',
            }}>{conv.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{conv.name}</p>
                {conv.time && <p style={{ margin: 0, fontSize: '0.68rem', color: '#aaa' }}>{conv.time}</p>}
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.75rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.property}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.73rem', color: '#bbb', fontStyle: conv.lastMessage ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                  {conv.lastMessage || 'No messages yet'}
                </p>
                {conv.unread > 0 && (
                  <span style={{
                    background: '#3b5bdb', color: '#fff', borderRadius: '50%',
                    width: 16, height: 16, fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{conv.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right */}
      <div style={{
        flex: 1, background: '#fff', borderRadius: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: selected?.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#555', fontSize: '0.85rem',
          }}>{selected?.avatar}</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{selected?.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{selected?.property}</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: '0.4rem' }}>
              <div style={{ fontSize: '2rem' }}>💬</div>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No messages yet</p>
            </div>
          ) : messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '0.6rem 0.9rem',
                borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.from === 'me' ? 'linear-gradient(135deg, #1e3a5f, #3b5bdb)' : '#f0f4ff',
                color: msg.from === 'me' ? '#fff' : '#333',
                fontSize: '0.85rem', lineHeight: 1.5,
              }}>
                {msg.text}
                <p style={{ margin: '3px 0 0', fontSize: '0.65rem', opacity: 0.65, textAlign: 'right' }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '0.7rem' }}>
          <input type="text" placeholder="Type a message... (coming soon)" disabled style={{
            flex: 1, padding: '0.6rem 0.9rem', borderRadius: 24,
            border: '1.5px solid #e0e0e0', fontSize: '0.85rem',
            outline: 'none', background: '#f8faff', color: '#aaa', cursor: 'not-allowed',
          }} />
          <button disabled style={{
            background: '#e0e0e0', color: '#aaa', border: 'none',
            padding: '0.6rem 1rem', borderRadius: 24,
            cursor: 'not-allowed', fontWeight: 700, fontSize: '0.85rem',
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Info Modal ───────────────────────────────────────────────────────────
function EditInfoModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, location: user.location });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    onSave(form); onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="✏️ Edit Profile" onClose={onClose} />
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

// ── Edit Preferences Modal ────────────────────────────────────────────────────
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
      <ModalHeader title="✈️ Travel Preferences" onClose={onClose} />
      <div style={{ padding: '1.5rem' }}>
        {[
          { label: '💰 Budget', key: 'budget' },
          { label: '🧭 Travel Style', key: 'style' },
          { label: '☀️ Preferred Climate', key: 'climate' },
          { label: '📆 Trip Length', key: 'length' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
            <select value={form[f.key]} onChange={set(f.key)} style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
              border: '1.5px solid #e0e0e0', fontSize: '0.95rem',
              outline: 'none', background: '#fff', cursor: 'pointer', boxSizing: 'border-box',
            }}
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

// ── Shared ────────────────────────────────────────────────────────────────────
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
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
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

// ── Main Profile Page ─────────────────────────────────────────────────────────
function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditPrefs, setShowEditPrefs] = useState(false);

  const [user, setUser] = useState({
    name: 'Veronica Andrade', email: 'veronica.a@email.com',
    location: 'London, UK', memberSince: 'March 2026',
  });

  const [prefs, setPrefs] = useState({
    budget: 'Mid-range', style: 'Explorer', climate: 'Warm', length: '1–2 weeks',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Segoe UI', sans-serif" }}>

      {showEditInfo && <EditInfoModal user={user} onClose={() => setShowEditInfo(false)} onSave={u => setUser({ ...user, ...u })} />}
      {showEditPrefs && <EditPrefsModal prefs={prefs} onClose={() => setShowEditPrefs(false)} onSave={p => setPrefs({ ...prefs, ...p })} />}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)', padding: '2rem 2rem 0', color: '#fff' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem' }}>← Back</button>
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

        {/* ── Messages Tab ── */}
        {activeTab === 'messages' && <MessagesTab />}

        {/* ── Bookings / List Property Tab ── */}
        {activeTab !== 'messages' && (
          <>
            {/* User info card */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.2rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #3b5bdb, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{user.name}</h3>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '0.88rem' }}>📧 {user.email}</p>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '0.88rem' }}>📍 {user.location}</p>
                <p style={{ margin: '3px 0', color: '#aaa', fontSize: '0.8rem' }}>Member since {user.memberSince}</p>
              </div>
              <button onClick={() => setShowEditInfo(true)} style={{ background: '#1e3a5f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Edit</button>
            </div>

            {/* Preferences card */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '1.5rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>✈️ Travel Preferences</h4>
                <button onClick={() => setShowEditPrefs(true)} style={{ background: '#1e3a5f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Update</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {[
                  { label: 'Budget', key: 'budget', emoji: '💰' },
                  { label: 'Travel Style', key: 'style', emoji: '🧭' },
                  { label: 'Preferred Climate', key: 'climate', emoji: '☀️' },
                  { label: 'Trip Length', key: 'length', emoji: '📆' },
                ].map(p => (
                  <div key={p.key} style={{ background: '#f8faff', borderRadius: 10, padding: '0.8rem 1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.emoji} {p.label}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 600, color: '#333' }}>{prefs[p.key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 style={{ margin: '0 0 0.8rem', fontSize: '1rem', fontWeight: 700 }}>⭐ Recommended for You</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { city: 'Lisbon', country: 'Portugal', emoji: '🏙️', color: '#fde8d8' },
                  { city: 'Bali', country: 'Indonesia', emoji: '🏝️', color: '#d0eaf8' },
                ].map(rec => (
                  <div key={rec.city} onClick={() => navigate('/destinations')} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ background: rec.color, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{rec.emoji}</div>
                    <div style={{ padding: '0.7rem 0.9rem' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{rec.city}</p>
                      <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.8rem' }}>{rec.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;