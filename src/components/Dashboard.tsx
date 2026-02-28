import { InventoryItem, Client, Rental } from '../types';

interface DashboardProps {
  inventory: InventoryItem[];
  clients: Client[];
  rentals: Rental[];
}

export function Dashboard({ inventory, clients, rentals }: DashboardProps) {
  const stats = {
    total: inventory.length,
    disponible: inventory.filter(i => i.status === 'disponible').length,
    alquilado: inventory.filter(i => i.status === 'alquilado').length,
    reservado: inventory.filter(i => i.status === 'reservado').length,
    vendido: inventory.filter(i => i.status === 'vendido').length,
    noDisponible: inventory.filter(i => i.status === 'no_disponible').length,
    fueraServicio: inventory.filter(i => i.status === 'fuera_servicio').length,
  };

  const activeRentals = rentals.filter(r => r.status === 'activo');
  const overdueRentals = rentals.filter(r => r.status === 'vencido');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      disponible: 'bg-green-500',
      alquilado: 'bg-blue-500',
      reservado: 'bg-yellow-500',
      vendido: 'bg-purple-500',
      no_disponible: 'bg-gray-500',
      fuera_servicio: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      alquilado: 'Alquilado',
      reservado: 'Reservado',
      vendido: 'Vendido',
      no_disponible: 'No Disponible',
      fuera_servicio: 'Fuera de Servicio',
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      saco: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      pantalon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      camisa: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      chaleco: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
      corbata: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      zapatos: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      accesorio: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    };
    return icons[type] || icons.accesorio;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
        <p className="text-gray-400">Resumen general del inventario y operaciones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Disponibles</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.disponible}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Clientes</p>
              <p className="text-3xl font-bold text-white mt-1">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm">Alquileres Activos</p>
              <p className="text-3xl font-bold text-white mt-1">{activeRentals.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Estado del Inventario</h2>
          <div className="space-y-3">
            {Object.entries(stats).filter(([key]) => key !== 'total').map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status === 'noDisponible' ? 'no_disponible' : status === 'fueraServicio' ? 'fuera_servicio' : status)}`}></div>
                  <span className="text-gray-300">{getStatusLabel(status === 'noDisponible' ? 'no_disponible' : status === 'fueraServicio' ? 'fuera_servicio' : status)}</span>
                </div>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Items por Tipo</h2>
          <div className="space-y-3">
            {['saco', 'pantalon', 'camisa', 'chaleco', 'corbata', 'zapatos', 'accesorio'].map((type) => {
              const count = inventory.filter(i => i.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTypeIcon(type)} />
                    </svg>
                    <span className="text-gray-300 capitalize">{type}</span>
                  </div>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(overdueRentals.length > 0 || stats.fueraServicio > 0) && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Alertas</span>
          </h2>
          <div className="space-y-2">
            {overdueRentals.length > 0 && (
              <p className="text-red-300">• {overdueRentals.length} alquiler(es) vencido(s) pendiente(s) de devolución</p>
            )}
            {stats.fueraServicio > 0 && (
              <p className="text-red-300">• {stats.fueraServicio} item(s) fuera de servicio requieren atención</p>
            )}
          </div>
        </div>
      )}

      {/* Recent Items */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Últimos Items Agregados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Talla</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Precio Alquiler</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {inventory.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-t border-slate-700">
                  <td className="py-3 text-white">{item.name}</td>
                  <td className="py-3 capitalize">{item.type}</td>
                  <td className="py-3">{item.size}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'disponible' ? 'bg-green-900/50 text-green-400' :
                      item.status === 'alquilado' ? 'bg-blue-900/50 text-blue-400' :
                      item.status === 'reservado' ? 'bg-yellow-900/50 text-yellow-400' :
                      item.status === 'fuera_servicio' ? 'bg-red-900/50 text-red-400' :
                      'bg-gray-900/50 text-gray-400'
                    }`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="py-3">${item.rentalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
