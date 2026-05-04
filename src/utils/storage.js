const KEY_PARCELS = 'courier_parcels';
const KEY_USERS = 'courier_users';
const KEY_CURRENT_USER = 'courier_current_user';

export const storage = {
  // Users
  getUsers: () => JSON.parse(localStorage.getItem(KEY_USERS) || '[]'),
  saveUser: (user) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem(KEY_CURRENT_USER)),
  setCurrentUser: (user) => localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(KEY_CURRENT_USER),

  // Parcels
  getParcels: () => JSON.parse(localStorage.getItem(KEY_PARCELS) || '[]'),
  addParcel: (parcel) => {
    const parcels = storage.getParcels();
    parcels.push({
      ...parcel,
      id: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'Pending',
      bookedAt: new Date().toISOString()
    });
    localStorage.setItem(KEY_PARCELS, JSON.stringify(parcels));
    return parcels[parcels.length - 1];
  },
  updateParcelStatus: (id, status) => {
    const parcels = storage.getParcels();
    const index = parcels.findIndex(p => p.id === id);
    if (index !== -1) {
      parcels[index].status = status;
      localStorage.setItem(KEY_PARCELS, JSON.stringify(parcels));
    }
  },
  getParcelById: (id) => storage.getParcels().find(p => p.id === id),
  getUserParcels: (email) => storage.getParcels().filter(p => p.senderEmail === email)
};

// Initialize Admin
if (storage.getUsers().length === 0) {
  storage.saveUser({
    name: 'Admin User',
    email: 'admin@courier.com',
    password: 'admin123',
    role: 'admin'
  });
}
