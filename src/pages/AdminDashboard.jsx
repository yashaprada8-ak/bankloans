import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { storage } from '../utils/storage';

export default function AdminDashboard() {
  const [parcels, setParcels] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setParcels(storage.getParcels());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    storage.updateParcelStatus(id, newStatus);
    setParcels(storage.getParcels());
  };

  const filteredParcels = filter === 'All' ? parcels : parcels.filter(p => p.status === filter);

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Administrator Panel</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage all courier shipments and delivery statuses</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Orders', value: parcels.length, icon: <Package size={20} color="var(--primary)" /> },
          { label: 'Pending', value: parcels.filter(p => p.status === 'Pending').length, icon: <Clock size={20} color="var(--warning)" /> },
          { label: 'In Transit', value: parcels.filter(p => p.status === 'In Transit').length, icon: <Truck size={20} color="var(--accent)" /> },
          { label: 'Delivered', value: parcels.filter(p => p.status === 'Delivered').length, icon: <CheckCircle size={20} color="var(--success)" /> }
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--glass)', padding: '0.75rem', borderRadius: '12px' }}>{stat.icon}</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{stat.label}</p>
              <h3 style={{ margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['All', 'Pending', 'In Transit', 'Delivered'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Admin Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--glass)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem' }}>TRACKING ID</th>
              <th style={{ padding: '1rem 1.5rem' }}>SENDER</th>
              <th style={{ padding: '1rem 1.5rem' }}>RECEIVER</th>
              <th style={{ padding: '1rem 1.5rem' }}>DESTINATION</th>
              <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{p.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>{p.senderName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.senderEmail}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500 }}>{p.receiverName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.receiverEmail}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>{p.destination}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className={`badge badge-${p.status.toLowerCase().replace(' ', '')}`}>{p.status}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <select 
                    className="form-input" 
                    style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.875rem' }}
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredParcels.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No parcels found with status "{filter}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
