import React, { useState } from 'react';
import { Search, MapPin, Shield, Zap, Package } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    const found = storage.getParcelById(trackingId);
    if (found) {
      setParcel(found);
      setError('');
    } else {
      setParcel(null);
      setError('Parcel not found. Please check your tracking ID.');
    }
  };

  return (
    <div className="container animate-fade-in">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Fast, Reliable & <span className="text-gradient">Secure Delivery</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          The world's leading parcel tracking and management system. Send your packages anywhere with full transparency.
        </p>

        {/* Tracking Search */}
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Track Your Shipment</h3>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                placeholder="Enter Tracking ID (e.g. TRK...)" 
                className="form-input" 
                style={{ paddingLeft: '3rem' }}
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Track Now</button>
          </form>

          {error && <p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</p>}

          {parcel && (
            <div style={{ marginTop: '2rem', textAlign: 'left', padding: '1.5rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>{parcel.id}</span>
                <span className={`badge badge-${parcel.status.toLowerCase().replace(' ', '')}`}>
                  {parcel.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Sender</label>
                  <span>{parcel.senderName}</span>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Receiver</label>
                  <span>{parcel.receiverName}</span>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Destination</label>
                  <span>{parcel.destination}</span>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Booked On</label>
                  <span>{new Date(parcel.bookedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', padding: '4rem 0' }}>
        {[
          { icon: <Zap color="var(--primary)" />, title: 'Lightning Fast', desc: 'Optimized logistics for the quickest delivery times in the industry.' },
          { icon: <Shield color="var(--secondary)" />, title: 'Secure Handling', desc: 'Every parcel is insured and handled with extreme care.' },
          { icon: <MapPin color="var(--accent)" />, title: 'Real-time Tracking', desc: 'Know exactly where your package is at any second.' }
        ].map((f, i) => (
          <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--glass)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
