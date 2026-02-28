import { useState, useEffect } from 'react';
import { Rental, Client, InventoryItem, ItemStatus } from '../types';

interface RentalsProps {
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
  clients: Client[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const emptyRental: Omit<Rental, 'id' | 'createdAt'> = {
  clientId: '',
  itemId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  status: 'activo',
  totalPrice: 0,
  deposit: 0,
  notes: '',
};

export function Rentals({ rentals, setRentals, clients, inventory, setInventory }: RentalsProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyRental);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const availableItems = inventory.filter(item => item.status === 'disponible');

  // Check for overdue rentals
  useEffect(() => {
    const today = new Date();
    setRentals(prev => prev.map(rental => {
      if (rental.status === 'activo' && new Date(rental.endDate) < today) {
        return { ...rental, status: 'vencido' };
      }
      return rental;
    }));
  }, [setRentals]);

  const filteredRentals = rentals.filter(rental => {
    return filterStatus === 'all' || rental.status === filterStatus;
  });

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente no encontrado';
  };

  const getItemName = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.name : 'Item no encontrado';
  };

  const getItemRentalPrice = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.rentalPrice : 0;
  };

  const calculateTotalPrice = (itemId: string, startDate: string, endDate: string) => {
    if (!itemId || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerDay = getItemRentalPrice(itemId);
    return days > 0 ? days * pricePerDay : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRental: Rental = {
      ...formData,
      id: Date.now().toString(),
      totalPrice: calculateTotalPrice(formData.itemId, formData.startDate, formData.endDate),
      createdAt: new Date().toISOString(),
    };
    
    setRentals(prev => [...prev, newRental]);
    
    // Update item status to rented
    setInventory(prev => prev.map(item =>
      item.id === formData.itemId
        ? { ...item, status: 'alquilado' as ItemStatus, updatedAt: new Date().toISOString() }
        : item
    ));
    
    handleCloseModal();
  };

  const handleReturn = (rental: Rental) => {
    // Update rental status
    setRentals(prev => prev.map(r =>
      r.id === rental.id
        ? { ...r, status: 'devuelto', returnDate: new Date().toISOString() }
        : r
    ));
    
    // Update item status to available
    setInventory(prev => prev.map(item =>
      item.id === rental.itemId
        ? { ...item, status: 'disponible' as ItemStatus, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(emptyRental);
  };

  const handleAddNew = () => {
    setFormData({
      ...emptyRental,
      startDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      activo: 'bg-blue-900/50 text-blue-400',
      devuelto: 'bg-green-900/50 text-green-400',
      vencido: 'bg-red-900/50 text-red-400',
    };
    const labels: Record<string, string> = {
      activo: 'Activo',
      devuelto: 'Devuelto',
      vencido: 'Vencido',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alquileres</h1>
          <p className="text-gray-400">Gestiona los alquileres de trajes y accesorios</p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={availableItems.length === 0}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Alquiler
        </button>
      </div>

      {availableItems.length === 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4">
          <p className="text-yellow-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            No hay items disponibles para alquilar
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">Filtrar por estado:</span>
          <div className="flex space-x-2">
            {['all', 'activo', 'vencido', 'devuelto'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.map(rental => {
          const client = clients.find(c => c.id === rental.clientId);
          
          return (
            <div key={rental.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-purple-500/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    rental.status === 'activo' ? 'bg-blue-600' :
                    rental.status === 'vencido' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{getItemName(rental.itemId)}</h3>
                    <p className="text-gray-400 text-sm">
                      Cliente: {getClientName(rental.clientId)}
                      {client && ` • ${client.phone}`}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(rental.status)}
                      <span className="text-gray-400 text-sm">
                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-xl font-bold text-white">${rental.totalPrice}</p>
                    {rental.deposit > 0 && (
                      <p className="text-gray-400 text-xs">Depósito: ${rental.deposit}</p>
                    )}
                  </div>
                  
                  {rental.status === 'activo' || rental.status === 'vencido' ? (
                    <button
                      onClick={() => handleReturn(rental)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Registrar Devolución
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-slate-700 text-gray-400 rounded-lg">
                      Devuelto: {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : '-'}
                    </span>
                  )}
                </div>
              </div>

              {rental.notes && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-gray-400 text-sm">
                    <span className="font-medium">Notas:</span> {rental.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filteredRentals.length === 0 && (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400">No hay alquileres registrados</p>
          </div>
        )}
      </div>

      {/* Add Rental Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Nuevo Alquiler</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Cliente</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Item a Alquilar</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => {
                    const newItemId = e.target.value;
                    const newTotal = calculateTotalPrice(newItemId, formData.startDate, formData.endDate);
                    setFormData({...formData, itemId: newItemId, totalPrice: newTotal});
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Seleccionar item...</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.size} - ${item.rentalPrice}/día
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const newTotal = calculateTotalPrice(formData.itemId, newStart, formData.endDate);
                      setFormData({...formData, startDate: newStart, totalPrice: newTotal});
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Fecha Devolución</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      const newTotal = calculateTotalPrice(formData.itemId, formData.startDate, newEnd);
                      setFormData({...formData, endDate: newEnd, totalPrice: newTotal});
                    }}
                    min={formData.startDate}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Depósito ($)</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({...formData, deposit: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {formData.itemId && formData.startDate && formData.endDate && (
                <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <span className="font-medium">Total estimado:</span>{' '}
                    <span className="text-xl font-bold text-white">
                      ${calculateTotalPrice(formData.itemId, formData.startDate, formData.endDate)}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Notas adicionales sobre el alquiler..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Crear Alquiler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
