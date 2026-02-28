import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Clients } from './components/Clients';
import { Rentals } from './components/Rentals';
import { Users } from './components/Users';
import { InventoryItem, Client, Rental } from './types';
import { initialInventory, initialClients, initialRentals } from './data/initialData';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize state from localStorage or use initial data
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const stored = localStorage.getItem('inventory');
    return stored ? JSON.parse(stored) : initialInventory;
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem('clients');
    return stored ? JSON.parse(stored) : initialClients;
  });
  
  const [rentals, setRentals] = useState<Rental[]>(() => {
    const stored = localStorage.getItem('rentals');
    return stored ? JSON.parse(stored) : initialRentals;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }, [rentals]);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard inventory={inventory} clients={clients} rentals={rentals} />;
      case 'inventory':
        return <Inventory inventory={inventory} setInventory={setInventory} />;
      case 'clients':
        return <Clients clients={clients} setClients={setClients} />;
      case 'rentals':
        return (
          <Rentals 
            rentals={rentals} 
            setRentals={setRentals} 
            clients={clients} 
            inventory={inventory}
            setInventory={setInventory}
          />
        );
      case 'users':
        return <Users />;
      default:
        return <Dashboard inventory={inventory} clients={clients} rentals={rentals} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
