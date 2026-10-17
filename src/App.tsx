import React from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { UserRole } from './types';

// Layout
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { SidebarNav } from './components/layout/SidebarNav';

// Auth & Onboarding Flow
import { SplashScreen } from './views/auth/SplashScreen';
import { RoleSelection } from './views/auth/RoleSelection';
import { IdentityVerification } from './views/auth/IdentityVerification';

// Dashboards
import { FarmerDashboard } from './views/dashboards/FarmerDashboard';
import { CooperativeDashboard } from './views/dashboards/CooperativeDashboard';
import { BuyerDashboard } from './views/dashboards/BuyerDashboard';
import { SupplierDashboard } from './views/dashboards/SupplierDashboard';
import { TransporterDashboard } from './views/dashboards/TransporterDashboard';
import { AdminPortal } from './views/dashboards/AdminPortal';

// Core Application Views
import { MarketplaceView } from './views/marketplace/MarketplaceView';
import { CreateListingView } from './views/marketplace/CreateListingView';
import { OrdersView } from './views/orders/OrdersView';
import { WalletView } from './views/wallet/WalletView';
import { CreditView } from './views/credit/CreditView';
import { AdvisoryView } from './views/advisory/AdvisoryView';
import { ProfileView } from './views/profile/ProfileView';

export const App: React.FC = () => {
  const { user, isAuthLoading, loginRole } = useAuth();
  const { activeView, setActiveView } = useApp();

  // Synchronize URL hash for direct links (e.g. #roles or #intro)
  React.useEffect(() => {
    const handleHash = () => {
      try {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#roles' || hash === '#role_selection' || hash === '#role') {
          setActiveView('role_selection');
        } else if (hash === '#splash' || hash === '#intro') {
          setActiveView('splash');
        }
      } catch (e) {}
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setActiveView]);

  // 1. Loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#012d1d] border-t-transparent animate-spin" />
          <p className="font-heading font-bold text-sm text-[#012d1d]">Loading AgroApp Platform...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Onboarding State (Direct Role Entry - No Registration forms)
  if (!user) {
    if (activeView === 'role_selection') {
      return (
        <RoleSelection
          onSelectRole={(role) => {
            loginRole(role);
            setActiveView('dashboard');
          }}
          onBack={() => setActiveView('splash')}
        />
      );
    }
    return (
      <SplashScreen
        onGetStarted={() => setActiveView('role_selection')}
        onLogin={() => {
          loginRole('farmer');
          setActiveView('dashboard');
        }}
      />
    );
  }

  // Handle verify_identity when user is authenticated (if accessed via KYC flow)
  if (activeView === 'verify_identity') {
    return <IdentityVerification onComplete={() => setActiveView('dashboard')} onSkip={() => setActiveView('dashboard')} />;
  }

  // 3. Render Dashboard based on User Role if 'dashboard' is activeView
  const renderDashboard = () => {
    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'cooperative':
        return <CooperativeDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      case 'supplier':
        return <SupplierDashboard />;
      case 'transporter':
        return <TransporterDashboard />;
      case 'institutional_admin':
      case 'gov_admin':
      case 'super_admin':
        return <AdminPortal />;
      default:
        return <FarmerDashboard />;
    }
  };

  // 4. Render Active View
  const renderActiveView = () => {
    switch (activeView) {
      case 'splash':
        return (
          <SplashScreen
            onGetStarted={() => setActiveView('role_selection')}
            onLogin={() => setActiveView('dashboard')}
          />
        );
      case 'role_selection':
        return (
          <RoleSelection
            onSelectRole={(role) => {
              loginRole(role);
              setActiveView('dashboard');
            }}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'dashboard':
        return renderDashboard();
      case 'marketplace':
        return <MarketplaceView />;
      case 'create_listing':
        return <CreateListingView />;
      case 'orders':
        return <OrdersView />;
      case 'wallet':
        return <WalletView />;
      case 'credit':
        return <CreditView />;
      case 'advisory':
        return <AdvisoryView />;
      case 'profile':
        return <ProfileView />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#1a1c1c] flex flex-col font-body selection:bg-[#c1ecd4] selection:text-[#002114]">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Body with Responsive Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <aside className="hidden md:block w-60 shrink-0">
          <SidebarNav />
        </aside>

        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default App;
