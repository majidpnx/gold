"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, User, Phone, Calendar, Wallet, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => fetcher('/api/admin/users'),
  });
  
  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.userType === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];
  
  const getRoleText = (userType: string) => {
    switch (userType) {
      case 'user':
        return 'کاربر عادی';
      case 'technician':
        return 'تکنسین';
      case 'admin':
        return 'مدیر';
      default:
        return userType;
    }
  };
  
  const getRoleColor = (userType: string) => {
    switch (userType) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'technician':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">مدیریت کاربران</h1>
        <p className="text-gray-600">مشاهده و مدیریت تمام کاربران سیستم</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="جستجو در کاربران..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نقش کاربر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه نقش‌ها</SelectItem>
            <SelectItem value="user">کاربر عادی</SelectItem>
            <SelectItem value="technician">تکنسین</SelectItem>
            <SelectItem value="admin">مدیر</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Users List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user: any) => (
            <UserCard
              key={user._id}
              user={user}
              getRoleText={getRoleText}
              getRoleColor={getRoleColor}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">کاربری یافت نشد</h2>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' ? 'کاربری با فیلترهای انتخاب شده یافت نشد' : 'هنوز کاربری ثبت نشده است'}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Summary */}
      {filteredUsers.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{filteredUsers.length}</p>
                <p className="text-sm text-gray-600">کل کاربران</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {filteredUsers.filter((u: any) => u.userType === 'user').length}
                </p>
                <p className="text-sm text-gray-600">کاربران عادی</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {filteredUsers.filter((u: any) => u.userType === 'technician').length}
                </p>
                <p className="text-sm text-gray-600">تکنسین‌ها</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {filteredUsers.filter((u: any) => u.userType === 'admin').length}
                </p>
                <p className="text-sm text-gray-600">مدیران</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function UserCard({ user, getRoleText, getRoleColor }: { 
  user: any, 
  getRoleText: (userType: string) => string,
  getRoleColor: (userType: string) => string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">
                {user.name || 'کاربر بدون نام'}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.userType)}`}>
                {getRoleText(user.userType)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="font-medium text-yellow-700">
                  {formatToman(user.walletBalance)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {user.userType === 'admin' ? 'مدیر سیستم' : 'تغییر نقش'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
