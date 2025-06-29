import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, MessageSquare, TrendingUp, Trash2, Eye, Star, MessageCircle, ShoppingBag } from 'lucide-react';

interface DashboardData {
  counts: {
    users: number;
    clothes: number;
    comments: number;
    recommendations: number;
  };
  recent: {
    users: any[];
    clothes: any[];
    comments: any[];
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  recommendation_count: number;
  comment_count: number;
  clothing_count: number;
}

interface Clothing {
  id: number;
  name: string;
  type: string;
  size: string;
  price: number;
  seller_name: string;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  user_name: string;
  clothing_name: string;
  created_at: string;
}

interface Recommendation {
  id: number;
  clothingType: string;
  recommendedSize: string;
  date: string;
  user_id: number;
}

const API_URL = 'http://localhost:5001/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, usersRes, clothesRes, commentsRes, recommendationsRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard`, { credentials: 'include' }),
        fetch(`${API_URL}/admin/users`, { credentials: 'include' }),
        fetch(`${API_URL}/admin/clothes`, { credentials: 'include' }),
        fetch(`${API_URL}/admin/comments`, { credentials: 'include' }),
        fetch(`${API_URL}/admin/recommendations`, { credentials: 'include' })
      ]);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboardData(dashboardData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (clothesRes.ok) {
        const clothesData = await clothesRes.json();
        setClothes(clothesData);
      }

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }

      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json();
        setRecommendations(recommendationsData);
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на данните",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този потребител?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Потребителят е изтрит",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на потребителя",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClothing = async (clothingId: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази дреха?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/clothes/${clothingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Дрехата е изтрита",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to delete clothing');
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на дрехата",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този коментар?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Коментарът е изтрит",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на коментара",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      seller: 'secondary',
      user: 'default'
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || 'default'}>
        {role === 'admin' ? 'Администратор' : role === 'seller' ? 'Търговец' : 'Потребител'}
      </Badge>
    );
  };

  const getClothingTypeLabel = (type: string) => {
    const labels = {
      shirt: 'Риза',
      pants: 'Панталон',
      dress: 'Рокля',
      jacket: 'Яке',
      skirt: 'Пола',
      sweater: 'Пуловер'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const isActiveUser = (user: User) => {
    const totalActivity = user.recommendation_count + user.comment_count + user.clothing_count;
    return totalActivity >= 3; // Consider active if they have 3+ total activities
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-beige-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Зареждане на админ панела...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Админ Панел</h1>
        <p className="text-gray-600">Управление на потребители, дрехи и коментари</p>
      </div>

      {/* Dashboard Stats */}
      {/* Removed summary cards as requested */}

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Потребители</TabsTrigger>
          <TabsTrigger value="clothes">Дрехи</TabsTrigger>
          <TabsTrigger value="comments">Коментари</TabsTrigger>
          <TabsTrigger value="recommendations">Препоръки</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общо Потребители</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-gray-600">
                  {users.filter(u => u.role === 'admin').length} админи, {users.filter(u => u.role === 'seller').length} търговци, {users.filter(u => u.role === 'user').length} потребители
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общо Препоръки</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.recommendation_count, 0)}
                </div>
                <p className="text-xs text-gray-600">
                  Средно {Math.round(users.reduce((sum, user) => sum + user.recommendation_count, 0) / users.length)} на потребител
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общо Коментари</CardTitle>
                <MessageCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.comment_count, 0)}
                </div>
                <p className="text-xs text-gray-600">
                  Средно {Math.round(users.reduce((sum, user) => sum + user.comment_count, 0) / users.length)} на потребител
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общо Дрехи</CardTitle>
                <ShoppingBag className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.clothing_count, 0)}
                </div>
                <p className="text-xs text-gray-600">
                  От {users.filter(u => u.clothing_count > 0).length} търговци
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Всички Потребители</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Сортиране по:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="username">Потребителско име</SelectItem>
                      <SelectItem value="role">Роля</SelectItem>
                      <SelectItem value="recommendation_count">Препоръки</SelectItem>
                      <SelectItem value="comment_count">Коментари</SelectItem>
                      <SelectItem value="clothing_count">Дрехи</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Възходящо</SelectItem>
                      <SelectItem value="desc">Низходящо</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Потребителско име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Роля</TableHead>
                    <TableHead>Препоръки</TableHead>
                    <TableHead>Коментари</TableHead>
                    <TableHead>Дрехи</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedUsers().map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{user.username}</span>
                          {isActiveUser(user) && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Активен
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {user.recommendation_count}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>AI препоръки за размер</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {user.comment_count}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Коментари и рейтинги</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                {user.clothing_count}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Дрехи за продажба</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {user.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clothes" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Всички Дрехи</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Име</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Търговец</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clothes.map((clothing) => (
                    <TableRow key={clothing.id}>
                      <TableCell>{clothing.id}</TableCell>
                      <TableCell>{clothing.name}</TableCell>
                      <TableCell>{getClothingTypeLabel(clothing.type)}</TableCell>
                      <TableCell>{clothing.size}</TableCell>
                      <TableCell>{clothing.price}лв</TableCell>
                      <TableCell>{clothing.seller_name}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClothing(clothing.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Всички Коментари</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Съдържание</TableHead>
                    <TableHead>Потребител</TableHead>
                    <TableHead>Дреха</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400">Няма коментари.</TableCell>
                    </TableRow>
                  )}
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                      <TableCell>{comment.user_name}</TableCell>
                      <TableCell>{comment.clothing_name}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Всички Препоръки</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Тип дреха</TableHead>
                    <TableHead>Препоръчан размер</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Потребител ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((recommendation) => (
                    <TableRow key={recommendation.id}>
                      <TableCell>{recommendation.id}</TableCell>
                      <TableCell>{getClothingTypeLabel(recommendation.clothingType)}</TableCell>
                      <TableCell>{recommendation.recommendedSize}</TableCell>
                      <TableCell>{new Date(recommendation.date).toLocaleDateString('bg-BG')}</TableCell>
                      <TableCell>{recommendation.user_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 