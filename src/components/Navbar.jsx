import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User, LayoutDashboard } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Navbar() {
  const user = storage.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
            <Package color="white" size={24} />
          </div>
          <span className="text-gradient">CourierLink</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
