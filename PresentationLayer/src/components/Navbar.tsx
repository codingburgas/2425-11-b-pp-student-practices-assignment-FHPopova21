
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { User, Home, ShoppingBag, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Начало', path: '/', icon: Home },
      ];
    }

    switch (user?.role) {
      case 'user':
        return [
          { name: 'Начало', path: '/dashboard', icon: Home },
          { name: 'Мои мерки', path: '/measurements', icon: User },
          { name: 'AI Препоръка', path: '/recommendation', icon: ShoppingBag },
          { name: 'Дрехи', path: '/clothing', icon: ShoppingBag },
        ];
      case 'merchant':
        return [
          { name: 'Начало', path: '/merchant', icon: Home },
          { name: 'Мои обяви', path: '/merchant/listings', icon: ShoppingBag },
          { name: 'Всички обяви', path: '/clothing', icon: ShoppingBag },
        ];
      case 'admin':
        return [
          { name: 'Админ панел', path: '/admin', icon: Settings },
          { name: 'Потребители', path: '/admin/users', icon: User },
          { name: 'Обяви', path: '/admin/listings', icon: ShoppingBag },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-beige-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-beige-400 to-beige-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <span className="text-xl font-bold gradient-text">SmartFit</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-beige-100 text-beige-800'
                      : 'text-gray-600 hover:text-beige-700 hover:bg-beige-50'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-sm">
                  <User size={20} className="text-beige-600" />
                  <span className="hidden md:block">{user?.name}</span>
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-beige-300 text-beige-700 hover:bg-beige-50"
                >
                  Изход
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/signin">
                  <Button variant="outline" size="sm" className="border-beige-300 text-beige-700 hover:bg-beige-50">
                    Вход
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-beige-600 hover:bg-beige-700 text-white">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
