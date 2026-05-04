import React, { useState, useEffect } from 'react';
import { Plus, Package, Navigation, Weight, CreditCard } from 'lucide-react';
import { storage } from '../utils/storage';

export default function UserDashboard() {
  const user = storage.getCurrentUser();
  const [parcels, setParcels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: '',
    receiverEmail: '',
    destination: '',
    weight: ''
  });

  const costPerKg = 5;
  const basePrice = 10;
  const shippingCost = formData.weight ? basePrice + (formData.weight * costPerKg) : 0;

  useEffect(() => {
    if (user) {
      setParcels(storage.getUserParcels(user.email));
    }
  }, [user]);

  const handleBook = (e) => {
    e.preventDefault();
    const newParcel = storage.addParcel({
      ...formData,
      senderName: user.name,
      senderEmail: user.email,
      cost: shippingCost
    });
    setParcels([...parcels, newParcel]);
    setShowModal(false);
    setFormData({ receiverName: '', receiverEmail: '', destination: '', weight: '' });
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>My Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Book New Parcel</span>
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Shipments</p>
          <h3 style={{ fontSize: '2rem', margin: 0 }}>{parcels.length}</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>In Transit</p>
          <h3 style={{ fontSize: '2rem', margin: 0 }}>{parcels.filter(p => p.status === 'In Transit').length}</h3>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Spent</p>
          <h3 style={{ fontSize: '2rem', margin: 0 }}>${parcels.reduce((acc, p) => acc + p.cost, 0).toFixed(2)}</h3>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3>Recent Parcels</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--glass)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem' }}>TRACKING ID</th>
              <th style={{ padding: '1rem 1.5rem' }}>RECEIVER</th>
              <th style={{ padding: '1rem 1.5rem' }}>DESTINATION</th>
              <th style={{ padding: '1rem 1.5rem' }}>COST</th>
              <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--primary)' }}>{p.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>{p.receiverName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.receiverEmail}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>{p.destination}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>${p.cost.toFixed(2)}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className={`badge badge-${p.status.toLowerCase().replace(' ', '')}`}>{p.status}</span>
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No parcels found. Book your first parcel today!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Book Shipment</h2>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Receiver Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Receiver's full name"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Receiver Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="receiver@example.com"
                  value={formData.receiverEmail}
                  onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Destination</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="City, Country"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0.0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Base Shipping Fee:</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
                  <span>Total Cost:</span>
                  <span className="text-gradient">${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
