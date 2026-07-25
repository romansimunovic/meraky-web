import React, { useState, useEffect, useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const extractDurationMin = (duration, fallback = 30) => {
  const match = String(duration || '').match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
};

const createEmptyService = (categoryId = '') => ({
  name: '',
  duration: '30 min',
  price: '',
  categoryId,
  description: '',
  order: 0
});

export default function AdminPanel({ onBackToSite }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editService, setEditService] = useState(createEmptyService());
  const [newService, setNewService] = useState(createEmptyService());

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  );

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Greška pri dohvaćanju rezervacija:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();

      const cats = Array.isArray(data) ? data : [];
      setCategories(cats);
      setServices(cats);

      setNewService((prev) => ({
        ...prev,
        categoryId: prev.categoryId || cats[0]?.id || ''
      }));
    } catch (err) {
      console.error('Greška pri dohvaćanju usluga:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchServices();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Neispravno korisničko ime ili lozinka');
      }

      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Greška pri ažuriranju statusa:', err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu rezervaciju?')) return;

    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Greška pri brisanju rezervacije:', err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      const payload = {
  categoryId: newService.categoryId,
  name: newService.name.trim(),
  durationMin: parseInt(newService.durationMin, 10) || 30,
  duration: `${parseInt(newService.durationMin, 10) || 30} min`,
  price: parseFloat(newService.price),
  description: newService.description.trim(),
  order: parseInt(newService.order, 10) || 0
};

      const res = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewService(createEmptyService(categories[0]?.id || ''));
        fetchServices();
      }
    } catch (err) {
      console.error('Greška pri dodavanju usluge:', err);
    }
  };

  const handleStartEdit = (item, categoryId) => {
  setEditingServiceId(item.id);
  setEditService({
    name: item.name || '',
    durationMin: item.durationMin || 30,
    price: item.price ?? '',
    categoryId: categoryId || '',
    description: item.description || '',
    order: item.order || 0
  });
};

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditService(createEmptyService());
  };

  const handleSaveEdit = async (id) => {
    try {
      const payload = {
  categoryId: editService.categoryId,
  name: editService.name.trim(),
  durationMin: parseInt(editService.durationMin, 10) || 30,
  duration: `${parseInt(editService.durationMin, 10) || 30} min`,
  price: parseFloat(editService.price),
  description: editService.description.trim(),
  order: parseInt(editService.order, 10) || 0
};

      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        handleCancelEdit();
        fetchServices();
      }
    } catch (err) {
      console.error('Greška pri uređivanju usluge:', err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Želite li obrisati ovu uslugu?')) return;

    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error('Greška pri brisanju usluge:', err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-clay flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-brand-sand shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif-elegant text-2xl text-brand-espresso">Admin Prijava</h2>
            <button
              onClick={onBackToSite}
              className="text-xs uppercase tracking-wider text-brand-espresso/60 hover:text-brand-espresso"
            >
              ← Na stranicu
            </button>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-brand-espresso mb-1">
                Korisničko ime
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-sand text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-brand-espresso mb-1">
                Lozinka
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-sand text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-espresso text-white rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-brand-gold transition-colors"
            >
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-clay p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-brand-sand shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <h1 className="font-serif-elegant text-3xl text-brand-espresso">Admin Nadzorna Ploča</h1>
            <p className="text-xs text-brand-espresso/60 mt-1">Upravljanje rezervacijama i cjenikom</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBackToSite}
              className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-bold uppercase text-brand-espresso hover:bg-brand-clay/30"
            >
              Pogledaj Web
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase hover:bg-red-100"
            >
              Odjava
            </button>
          </div>
        </div>

        <div className="flex gap-4 my-6 border-b border-brand-sand pb-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'bookings'
                ? 'bg-brand-espresso text-white'
                : 'bg-brand-clay/30 text-brand-espresso hover:bg-brand-clay/60'
            }`}
          >
            Rezervacije ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'services'
                ? 'bg-brand-espresso text-white'
                : 'bg-brand-clay/30 text-brand-espresso hover:bg-brand-clay/60'
            }`}
          >
            Upravljanje Cjenikom
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-brand-espresso">Sve rezervacije</h2>
              <button
                onClick={fetchBookings}
                className="text-xs font-bold text-brand-gold uppercase tracking-wider"
              >
                Osvježi
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-brand-espresso/60">Učitavam rezervacije...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-brand-espresso/60">Nema evidentiranih rezervacija.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-sand text-xs font-bold uppercase text-brand-espresso/60">
                      <th className="py-3 px-2">Klijent</th>
                      <th className="py-3 px-2">Usluga</th>
                      <th className="py-3 px-2">Datum i Vrijeme</th>
                      <th className="py-3 px-2">Kontakt</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-clay text-sm text-brand-espresso">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-brand-clay/10">
                        <td className="py-3 px-2 font-bold">{b.client?.fullName || '-'}</td>
                        <td className="py-3 px-2">{b.service?.name || '-'}</td>
                        <td className="py-3 px-2 font-mono text-xs">
                          {new Date(b.dateTime).toLocaleString('hr-HR', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="py-3 px-2 text-xs">
                          <div>{b.client?.phone || '-'}</div>
                          <div className="text-brand-espresso/60">{b.client?.email || ''}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              b.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-700'
                                : b.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {b.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-2">
                          {b.status !== 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                              className="text-xs text-green-600 hover:underline font-bold"
                            >
                              Potvrdi
                            </button>
                          )}
                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                              className="text-xs text-yellow-600 hover:underline font-bold"
                            >
                              Otkaži
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="text-xs text-red-600 hover:underline font-bold"
                          >
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-clay/20 p-6 rounded-2xl border border-brand-sand">
              <h3 className="font-bold text-brand-espresso mb-4">Dodaj novu uslugu</h3>

              <form onSubmit={handleAddService} className="space-y-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                    Naziv
                  </label>
                  <input
                    type="text"
                    required
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                  />
                </div>

                <div>
  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
    Trajanje (min)
  </label>
  <input
    type="number"
    min="5"
    max="480"
    step="5"
    required
    value={newService.durationMin}
    onChange={(e) => setNewService({ ...newService, durationMin: e.target.value })}
    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
  />
</div>

                <div>
                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                    Cijena (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                    Kategorija
                  </label>
                  <select
                    value={newService.categoryId}
                    onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm bg-white"
                  >
                    <option value="">Odaberi</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                    Opis
                  </label>
                  <textarea
                    rows="3"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                    Redoslijed
                  </label>
                  <input
                    type="number"
                    value={newService.order}
                    onChange={(e) => setNewService({ ...newService, order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-espresso text-white rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-brand-gold transition-colors mt-2"
                >
                  Spremi uslugu
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h3 className="font-bold text-brand-espresso">Trenutne usluge po kategorijama</h3>

              {services.map((cat) => (
                <div key={cat.id} className="border border-brand-sand p-4 rounded-2xl bg-white">
                  <h4 className="font-bold text-brand-gold text-sm uppercase tracking-wider mb-3">
                    {cat.name}
                  </h4>

                  <div className="divide-y divide-brand-clay">
                    {cat.services?.map((item) => {
                      const isEditing = editingServiceId === item.id;

                      return (
                        <div key={item.id} className="py-3">
                          {isEditing ? (
                            <div className="space-y-3 bg-brand-clay/20 p-4 rounded-2xl border border-brand-sand">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                                    Naziv
                                  </label>
                                  <input
                                    type="text"
                                    value={editService.name}
                                    onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                                    Kategorija
                                  </label>
                                  <select
                                    value={editService.categoryId}
                                    onChange={(e) => setEditService({ ...editService, categoryId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm bg-white"
                                  >
                                    {categories.map((category) => (
                                      <option key={category.id} value={category.id}>
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
    Trajanje (min)
  </label>
  <input
    type="number"
    min="5"
    max="480"
    step="5"
    value={editService.durationMin}
    onChange={(e) => setEditService({ ...editService, durationMin: e.target.value })}
    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
  />
</div>

                                <div>
                                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                                    Cijena (€)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editService.price}
                                    onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                                    Redoslijed
                                  </label>
                                  <input
                                    type="number"
                                    value={editService.order}
                                    onChange={(e) => setEditService({ ...editService, order: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs uppercase font-bold text-brand-espresso/80 mb-1">
                                  Opis
                                </label>
                                <textarea
                                  rows="3"
                                  value={editService.description}
                                  onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-brand-sand text-sm"
                                />
                              </div>

                              <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(item.id)}
                                  className="px-4 py-2 bg-brand-espresso text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-gold"
                                >
                                  Spremi
                                </button>

                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 border border-brand-sand rounded-xl text-xs font-bold uppercase text-brand-espresso hover:bg-brand-clay/30"
                                >
                                  Odustani
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center gap-4 text-sm">
                              <div>
                                <span className="font-bold text-brand-espresso">{item.name}</span>
                                <span className="text-xs text-brand-espresso/60 ml-2">
                                  ({item.durationMin || 30} min)
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-brand-espresso">{item.price} €</span>

                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(item, cat.id)}
                                  className="text-xs text-brand-gold hover:underline font-bold"
                                >
                                  Uredi
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteService(item.id)}
                                  className="text-xs text-red-600 hover:underline font-bold"
                                >
                                  Obriši
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {(!cat.services || cat.services.length === 0) && (
                      <div className="py-3 text-sm text-brand-espresso/60">
                        Nema usluga u ovoj kategoriji.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}