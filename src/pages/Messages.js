// src/pages/Messages.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const conversations = [
  {
    id: 1,
    name: 'Maria S.',
    property: 'Cosy Studio in Lisbon',
    lastMessage: 'Hi! Just to confirm your check-in time is 3pm.',
    time: '10:32 AM',
    unread: 2,
    avatar: 'M',
    color: '#fde8d8',
  },
  {
    id: 2,
    name: 'Wayan K.',
    property: 'Beachfront Villa in Bali',
    lastMessage: '',
    time: '',
    unread: 0,
    avatar: 'W',
    color: '#d0eaf8',
  },
  {
    id: 3,
    name: 'Yuki T.',
    property: 'Modern Flat in Tokyo',
    lastMessage: '',
    time: '',
    unread: 0,
    avatar: 'Y',
    color: '#d4edda',
  },
  {
    id: 4,
    name: 'Fiona M.',
    property: 'Charming Cottage in Edinburgh',
    lastMessage: '',
    time: '',
    unread: 0,
    avatar: 'F',
    color: '#e8d5b7',
  },
];

const messagesByConv = {
  1: [
    { id: 1, from: 'host', text: 'Hi! Welcome, so glad you booked with us.', time: '10:00 AM' },
    { id: 2, from: 'me', text: 'Thank you! Really excited for the trip.', time: '10:15 AM' },
    { id: 3, from: 'host', text: 'Just to confirm your check-in time is 3pm.', time: '10:32 AM' },
  ],
};

function Messages() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(conversations[0]);

  const messages = messagesByConv[selected?.id] || [];

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #3b5bdb 100%)',
        padding: '2rem 2rem 1.5rem', color: '#fff',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none',
          color: '#fff', padding: '6px 14px', borderRadius: 20,
          cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1rem',
        }}>← Back</button>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Messages</h2>
        <p style={{ margin: '4px 0 0', opacity: 0.75, fontSize: '0.88rem' }}>Chat with your hosts</p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '1.5rem', gap: '1.2rem', boxSizing: 'border-box' }}>

        {/* Left — conversation list */}
        <div style={{
          width: 280, flexShrink: 0, background: '#fff', borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden',
        }}>
          <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
            <input
              type="text"
              placeholder="Search messages..."
              style={{
                width: '100%', padding: '0.5rem 0.8rem', borderRadius: 20,
                border: '1.5px solid #e0e0e0', fontSize: '0.85rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelected(conv)}
              style={{
                padding: '1rem 1.2rem', borderBottom: '1px solid #f8f8f8',
                cursor: 'pointer',
                background: selected?.id === conv.id ? '#f0f4ff' : '#fff',
                transition: 'background 0.15s',
                display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: conv.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1rem', flexShrink: 0, color: '#555',
              }}>
                {conv.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{conv.name}</p>
                  {conv.time && <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa' }}>{conv.time}</p>}
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.property}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#bbb', fontStyle: conv.lastMessage ? 'normal' : 'italic' }}>
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                  {conv.unread > 0 && (
                    <span style={{
                      background: '#3b5bdb', color: '#fff', borderRadius: '50%',
                      width: 18, height: 18, fontSize: '0.7rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — chat window */}
        <div style={{
          flex: 1, background: '#fff', borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Chat header */}
          <div style={{
            padding: '1rem 1.3rem', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: selected?.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#555',
            }}>{selected?.avatar}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{selected?.name}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>{selected?.property}</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: '0.5rem' }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No messages yet</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '70%', padding: '0.65rem 1rem',
                    borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'me' ? 'linear-gradient(135deg, #1e3a5f, #3b5bdb)' : '#f0f4ff',
                    color: msg.from === 'me' ? '#fff' : '#333',
                    fontSize: '0.88rem', lineHeight: 1.5,
                  }}>
                    {msg.text}
                    <p style={{ margin: '4px 0 0', fontSize: '0.68rem', opacity: 0.65, textAlign: 'right' }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input bar */}
          <div style={{
            padding: '1rem 1.2rem', borderTop: '1px solid #f0f0f0',
            display: 'flex', gap: '0.8rem', alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="Type a message... (coming soon)"
              disabled
              style={{
                flex: 1, padding: '0.7rem 1rem', borderRadius: 24,
                border: '1.5px solid #e0e0e0', fontSize: '0.9rem',
                outline: 'none', background: '#f8faff', color: '#aaa', cursor: 'not-allowed',
              }}
            />
            <button disabled style={{
              background: '#e0e0e0', color: '#aaa', border: 'none',
              padding: '0.7rem 1.2rem', borderRadius: 24,
              cursor: 'not-allowed', fontWeight: 700, fontSize: '0.88rem',
            }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;