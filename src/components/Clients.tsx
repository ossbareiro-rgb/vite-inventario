import { useState } from 'react';
import { Client, ClientMeasurements } from '../types';

interface ClientsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const emptyMeasurements: ClientMeasurements = {
  chest: 0,
  waist: 0,
  hips: 0,
  shoulders: 0,
  armLength: 0,
  inseam: 0,
  neck: 0,
  shoeSize: 0,
};

const emptyClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  measurements: emptyMeasurements,
  notes: '',
};

export function Clients({ clients, setClients }: ClientsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyClient);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.phone.includes(searchTerm);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...formData, updatedAt: new Date().toISOString() }
          : client
      ));
    } else {
      const newClient: Client = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClients(prev => [...prev, newClient]);
    }
    
    handleCloseModal();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      address: client.address,
      measurements: { ...client.measurements },
      notes: client.notes,
    });
    setShowModal(true);
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData(emptyClient);
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setFormData(emptyClient);
    setShowModal(true);
  };

  const updateMeasurement = (key: keyof ClientMeasurements, value: number) => {
    setFormData({
      ...formData,
      measurements: {
        ...formData.measurements,
        [key]: value,
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-gray-400">Gestiona los clientes y sus medidas</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Agregar Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr className="text-left text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Teléfono</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Registrado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-gray-400 text-sm">{client.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{client.phone}</td>
                  <td className="px-6 py-4 text-gray-300">{client.email}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-400">No se encontraron clientes</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">
                {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Apellido</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-sm mb-1">Dirección</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Medidas (cm)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Pecho</label>
                    <input
                      type="number"
                      value={formData.measurements.chest || ''}
                      onChange={(e) => updateMeasurement('chest', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Cintura</label>
                    <input
                      type="number"
                      value={formData.measurements.waist || ''}
                      onChange={(e) => updateMeasurement('waist', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Cadera</label>
                    <input
                      type="number"
                      value={formData.measurements.hips || ''}
                      onChange={(e) => updateMeasurement('hips', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Hombros</label>
                    <input
                      type="number"
                      value={formData.measurements.shoulders || ''}
                      onChange={(e) => updateMeasurement('shoulders', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Largo Brazo</label>
                    <input
                      type="number"
                      value={formData.measurements.armLength || ''}
                      onChange={(e) => updateMeasurement('armLength', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Entrepierna</label>
                    <input
                      type="number"
                      value={formData.measurements.inseam || ''}
                      onChange={(e) => updateMeasurement('inseam', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Cuello</label>
                    <input
                      type="number"
                      value={formData.measurements.neck || ''}
                      onChange={(e) => updateMeasurement('neck', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Talla Zapato</label>
                    <input
                      type="number"
                      value={formData.measurements.shoeSize || ''}
                      onChange={(e) => updateMeasurement('shoeSize', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
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
                  {editingClient ? 'Guardar Cambios' : 'Agregar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Detalles del Cliente</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedClient.firstName.charAt(0)}{selectedClient.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </h3>
                  <p className="text-gray-400">{selectedClient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Teléfono</p>
                  <p className="text-white">{selectedClient.phone}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Dirección</p>
                  <p className="text-white">{selectedClient.address || 'No especificada'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-3">Medidas</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Pecho', value: selectedClient.measurements.chest },
                    { label: 'Cintura', value: selectedClient.measurements.waist },
                    { label: 'Cadera', value: selectedClient.measurements.hips },
                    { label: 'Hombros', value: selectedClient.measurements.shoulders },
                    { label: 'Brazo', value: selectedClient.measurements.armLength },
                    { label: 'Entrepierna', value: selectedClient.measurements.inseam },
                    { label: 'Cuello', value: selectedClient.measurements.neck },
                    { label: 'Zapato', value: selectedClient.measurements.shoeSize },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <p className="text-gray-400 text-xs">{item.label}</p>
                      <p className="text-white font-semibold">{item.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedClient.notes && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Notas</p>
                  <p className="text-white">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
