import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { mockClothingItems } from '@/data/mockClothing';
import { Package, Bell, TrendingUp, Eye, Star, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Filter items by current seller
  const sellerItems = mockClothingItems.filter(item => 
    item.merchantName === user?.name || item.merchantId === String(user?.id)
  );

  // Mock notifications
  const notifications = [
    { id: 1, type: 'view', message: 'New view on "Classic Business Shirt"', time: '5 min' },
    { id: 2, type: 'message', message: 'New message from customer', time: '1 hour' },
    { id: 3, type: 'rating', message: 'New rating: 5 stars', time: '2 hours' },
  ];

  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'edit', item: 'Sports T-shirt', time: 'today' },
    { id: 2, type: 'view', item: 'Women\'s Dress', time: 'yesterday' },
    { id: 3, type: 'new', item: 'Winter Jacket', time: '2 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Personalized Greeting and Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Добре дошли, {user?.name || 'Търговец'}!</h2>
          <p className="text-gray-600">Това е вашето табло за управление на обяви.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/80 rounded-lg shadow p-4">
          <div className="w-16 h-16 rounded-full bg-beige-200 flex items-center justify-center text-2xl font-bold text-beige-700">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
          <div>
            <div className="font-semibold text-lg">{user?.name || 'Търговец'}</div>
            <div className="text-gray-500 text-sm">{user?.email || 'seller@email.com'}</div>
            <div className="text-yellow-500 text-sm mt-1">Рейтинг: 4.8★</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Statistics */}
        <div className="md:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">Total Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{sellerItems.length}</div>
                <p className="text-sm text-gray-600">active listings</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">47</div>
                <p className="text-sm text-gray-600">this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Listing & Recent Views */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">Top Listing</CardTitle>
              </CardHeader>
              <CardContent>
                {sellerItems.length > 0 ? (
                  <div>
                    <div className="font-semibold text-xl mb-1">
                      {sellerItems.reduce((top, item) => item.price > top.price ? item : top, sellerItems[0]).name}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      Price: {sellerItems.reduce((top, item) => item.price > top.price ? item : top, sellerItems[0]).price}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Size: {sellerItems.reduce((top, item) => item.price > top.price ? item : top, sellerItems[0]).size}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Няма обяви</div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">Views (last 7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{Math.floor(Math.random() * 50) + 20}</div>
                <p className="text-sm text-gray-600">(sample data)</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-beige-600 hover:bg-beige-700 text-white"
                  onClick={() => navigate('/seller/listings/new')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Нова обява
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/seller/listings')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Управление на обяви
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-beige-700">Бързи статистики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <span className="text-lg font-semibold text-yellow-500">4.8★</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Listings</span>
                    <span className="text-lg font-semibold text-green-600">{sellerItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Messages</span>
                    <span className="text-lg font-semibold text-blue-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Notifications and Activity */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-beige-700 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Известия
                <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === 'view' ? 'bg-blue-100' :
                        notification.type === 'message' ? 'bg-green-100' :
                        'bg-yellow-100'
                      }`}>
                        {notification.type === 'view' ? <Eye className="w-4 h-4" /> :
                         notification.type === 'message' ? <MessageSquare className="w-4 h-4" /> :
                         <Star className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-beige-700 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Последни дейности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'edit' ? 'bg-blue-500' :
                          activity.type === 'view' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`} />
                        <span className="text-sm">{activity.item}</span>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard; 