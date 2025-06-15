import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, User, Settings } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated) {
    switch (user?.role) {
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'seller':
        return <Navigate to="/merchant" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        break;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">SmartFit</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Интелигентна система за препоръчване на размер дреха на база ваши телесни мерки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/signup">
              <Button size="lg" className="bg-beige-600 hover:bg-beige-700 text-white px-8 py-3">
                Започнете безплатно
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="border-beige-300 text-beige-700 hover:bg-beige-50 px-8 py-3">
                Вход в профил
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Как работи SmartFit?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card text-center animate-fade-in">
              <CardHeader>
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-beige-600" />
                </div>
                <CardTitle>1. Въведете мерките си</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Въведете височина, тегло, обиколки и други телесни мерки за точна препоръка
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center animate-fade-in">
              <CardHeader>
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-beige-600" />
                </div>
                <CardTitle>2. Изберете дреха</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Прегледайте обявите на търговци и изберете дрехата, която ви харесва
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center animate-fade-in">
              <CardHeader>
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-beige-600" />
                </div>
                <CardTitle>3. Получете AI препоръка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Нашият AI алгоритъм анализира данните и препоръчва най-подходящия размер
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold gradient-text mb-2">95%</h3>
              <p className="text-gray-600">Точност на препоръките</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold gradient-text mb-2">1000+</h3>
              <p className="text-gray-600">Доволни потребители</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold gradient-text mb-2">500+</h3>
              <p className="text-gray-600">Обяви за дрехи</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-beige-100 to-beige-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Готови ли сте за перфектния размер?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Присъединете се към хилядите потребители, които вече използват SmartFit
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-beige-600 hover:bg-beige-700 text-white px-8 py-3">
              Започнете сега
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
