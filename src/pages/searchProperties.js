// src/pages/SearchProperties.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lisbon from '../assets/lisbon.jpg';
import bali from '../assets/bali.jpg';
import tokyo from '../assets/tokyo.jpg';
import edinburgh from '../assets/edinburgh.jpg';

const properties = [
  {
    id: 1, title: 'Cosy Studio in Lisbon', location: 'Lisbon, Portugal',
    type: 'Studio', guests: 2, bedrooms: 1, price: '£65 / night', image: lisbon,
    tags: ['WiFi', 'City View', 'Self Check-in'],
    description: 'A bright and cosy studio in the heart of Alfama. Walking distance to trams, restaurants and the river. Perfect for couples or solo travellers.',
    host: 'Maria S.', rating: 4.8, reviews: 32,
  },
  {
    id: 2, title: 'Beachfront Villa in Bali', location: 'Seminyak, Bali',
    type: 'Villa', guests: 6, bedrooms: 3, price: '£180 / night', image: bali,
    tags: ['Pool', 'Beach Access', 'Air Con'],
    description: 'A stunning 3-bedroom villa steps from the beach. Features a private pool, tropical garden and daily housekeeping. Great for families or groups.',
    host: 'Wayan K.', rating: 4.9, reviews: 58,
  },
  {
    id: 3, title: 'Modern Flat in Tokyo', location: 'Shinjuku, Tokyo',
    type: 'Apartment', guests: 3, bedrooms: 2, price: '£95 / night', image: tokyo,
    tags: ['WiFi', 'Kitchen', 'Metro Nearby'],
    description: "Sleek and modern apartment in vibrant Shinjuku. Close to the metro, shopping and some of Tokyo's best restaurants. Ideal for exploring the city.",
    host: 'Yuki T.', rating: 4.7, reviews: 44,
  },
  {
    id: 4, title: 'Charming Cottage in Edinburgh', location: 'Old Town, Edinburgh',
    type: 'Cottage', guests: 4, bedrooms: 2, price: '£110 / night', image: edinburgh,
    tags: ['Fireplace', 'Garden', 'Pet Friendly'],
    description: "A charming stone cottage tucked in Edinburgh's historic Old Town. Cosy fireplace, private garden and just minutes from the castle. Perfect for a winter getaway.",
    host: 'Fiona M.', rating: 4.6, reviews: 27,
  },
];

// ── Booking Modal 
function BookingModal({ property, onClose }) {
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '1' });
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
      const key = `propertyBookings_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newBooking = {
        id: Date.now(),
        title: property.title,
        location: property.location,
        price: property.price,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        status: 'Confirmed',
        image: property.image,
      };
      localStorage.setItem(key, JSON.stringify([...existing, newBooking]));
      setStep('confirm');
    }
  };

  if (!property) return null;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.18s ease', maxHeight: '90vh', overflowY: 'auto' }}>

        {step === 'confirm' ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800, color: '#1e3a5f' }}>Booking Confirmed!</h2>
            <p style={{ margin: '0 0 1.5rem', color: '#666', fontSize: '0.95rem' }}>
              Thank you, <strong>{form.name}</strong>! Your stay at <strong>{property.title}</strong> has been booked.
            </p>
            <div style={{ background: '#f8faff', borderRadius: 12, padding: '1.2rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              {[
                { label: 'Property', value: property.title },
                { label: 'Location', value: property.location },
                { label: 'Check-in', value: form.checkIn },
                { label: 'Check-out', value: form.checkOut },
                { label: 'Guests', value: form.guests },
                { label: 'Price', value: property.price },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>{row.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '0 0 1.5rem', color: '#888', fontSize: '0.82rem' }}>
              A confirmation has been sent to <strong>{form.email}</strong>
            </p>
            <button onClick={onClose} style={{ width: '100%', padding: '12px 32px', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ position: 'relative' }}>
              <img src={property.image} alt={property.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <button onClick={onClose} style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: '1.3rem 1.5rem' }}>
              <h2 style={{ margin: '0 0 2px', fontSize: '1.15rem', fontWeight: 800 }}>{property.title}</h2>
              <p style={{ margin: '0 0 1.2rem', color: '#888', fontSize: '0.85rem' }}>{property.location} · {property.price}</p>

              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
                { label: 'Phone (optional)', key: 'phone', type: 'tel', placeholder: '+44 7700 900000' },
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

              <div style={{ marginBottom: '1.3rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Guests</label>
                <select value={form.guests} onChange={set('guests')} style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  {Array.from({ length: property.guests }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleConfirm} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ── Property Modal 
function PropertyModal({ property, onClose, onBook }) {
  if (!property) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.18s ease' }}>
        <div style={{ position: 'relative' }}>
          <img src={property.image} alt={property.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{property.title}</h2>
              <p style={{ margin: '3px 0 0', color: '#666', fontSize: '0.88rem' }}>{property.location}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#1e3a5f' }}>{property.price}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#f59e0b' }}>{property.rating} <span style={{ color: '#aaa' }}>({property.reviews} reviews)</span></p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', padding: '0.8rem', background: '#f8faff', borderRadius: 10 }}>
            {[{ label: 'Type', value: property.type }, { label: 'Guests', value: property.guests }, { label: 'Bedrooms', value: property.bedrooms }].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                <p style={{ margin: '3px 0 0', fontWeight: 700, fontSize: '0.95rem', color: '#333' }}>{s.value}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#555', lineHeight: 1.6 }}>{property.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.2rem' }}>
            {property.tags.map(tag => (
              <span key={tag} style={{ background: '#f0f4ff', color: '#3b5bdb', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Hosted by <strong>{property.host}</strong></p>
            <button onClick={() => { onClose(); onBook(property); }} style={{ background: 'linear-gradient(135deg, #1e3a5f, #3b5bdb)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
              Book Now
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ── Property Card 
function PropertyCard({ property, onClick }) {
  return (
    <div onClick={() => onClick(property)} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s', border: '1px solid #f0f0f0' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
    >
      <img src={property.image} alt={property.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{property.title}</h3>
            <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.82rem' }}>{property.location}</p>
          </div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1e3a5f', whiteSpace: 'nowrap' }}>{property.price}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: '0.7rem', flexWrap: 'wrap' }}>
          {property.tags.map(tag => (
            <span key={tag} style={{ background: '#f0f4ff', color: '#3b5bdb', padding: '2px 9px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', paddingTop: '0.7rem', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{property.guests} guests · {property.bedrooms} bed</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b' }}>{property.rating}</p>
        </div>
      </div>
    </div>
  );
}

// ── Page 
function SearchProperties() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Segoe UI', sans-serif" }}>
      <PropertyModal property={selected} onClose={() => setSelected(null)} onBook={setBooking} />
      <BookingModal property={booking} onClose={() => setBooking(null)} />

      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)', padding: '2.5rem 2rem 3.5rem', color: '#fff', position: 'relative', textAlign: 'center' }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem' }}>← Back</button>
        <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>Search Properties</h1>
        <p style={{ margin: '0.5rem 0 1.5rem', opacity: 0.85, fontSize: '1rem' }}>Find your perfect stay anywhere in the world</p>
        <input type="text" placeholder="Search by city, country or type..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', maxWidth: 480, padding: '0.75rem 1.2rem', borderRadius: 30, border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '2.5rem auto 0', padding: '0 1.5rem 3rem' }}>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Showing {filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}
        </p>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem' }}></div>
            <p>No properties found for "{search}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.3rem' }}>
            {filtered.map(p => <PropertyCard key={p.id} property={p} onClick={setSelected} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProperties;