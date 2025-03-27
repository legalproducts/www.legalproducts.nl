'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminNewsTable from '@/components/admin/AdminNewsTable';
import AdminGebruikers from '@/components/admin/AdminGebruikers';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const user = await response.json();
          if (user.admin) {
            setIsAdmin(true);
          } else {
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title={
            activeTab === 'dashboard'
              ? 'Dashboard'
              : activeTab === 'news'
              ? 'Nieuwsberichten'
              : 'Gebruikers'
          }
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'dashboard' ? (
            <AdminDashboardStats />
          ) : activeTab === 'news' ? (
            <AdminNewsTable />
          ) : (
            <AdminGebruikers />
          )}
        </main>
      </div>
    </div>
  );
}
