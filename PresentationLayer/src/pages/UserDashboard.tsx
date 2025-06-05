
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Search, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuthStore();

  const quickActions = [
    {
      title: 'Мои телесни мерки',
      description: 'Въведете или редактирайте вашите мерки',
      icon: User,
      link: '/measurements',
      color: 'bg-blue-500'
    },
    {
      title: 'AI Препоръка за размер',
      description: 'Получете интелигентна препоръка',
      icon: TrendingUp,
      link: '/recommendation',
      color: 'bg-green-500'
    },
    {
      title: 'Прегледай дрехи',
      description: 'Търсете сред обявите на търговци',
      icon: ShoppingBag,
      link: '/clothing',
      color: 'bg-purple-500'
    },
    {
      title: 'Търсене',
      description: 'Търсете конкретна дреха',
      icon: Search,
      link: '/clothing',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Добре дошли, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Готови ли сте да намерите перфектния размер за вашата следваща дреха?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} to={action.link}>
              <Card className="glass-card hover:shadow-lg transition-all duration-300 animate-fade-in">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-beige-600" />
              Статус на профила
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Мерки:</span>
                <span className={user?.bodyMeasurements ? 'text-green-600' : 'text-orange-600'}>
                  {user?.bodyMeasurements ? 'Попълнени' : 'Непопълнени'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI препоръки:</span>
                <span className="text-blue-600">5 използвани</span>
              </div>
            </div>
            {!user?.bodyMeasurements && (
              <Link to="/measurements">
                <Button size="sm" className="w-full mt-4 bg-beige-600 hover:bg-beige-700">
                  Попълни мерки
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-beige-600" />
              Последни дейности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>AI препоръка за риза</span>
                <span className="text-gray-500">днес</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Актуализация на мерки</span>
                <span className="text-gray-500">вчера</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Нова регистрация</span>
                <span className="text-gray-500">преди 3 дни</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-beige-600" />
              Статистики
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Точност на препоръки:</span>
                <span className="text-green-600 font-semibold">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Спестени връщания:</span>
                <span className="text-blue-600 font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Любими размери:</span>
                <span className="text-purple-600 font-semibold">M, L</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
