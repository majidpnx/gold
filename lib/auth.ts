import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from './fetcher';

type User = {
  _id: string;
  phone: string;
  name?: string;
  userType: 'user' | 'technician' | 'admin';
  walletBalance: number;
  createdAt: string;
};

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: () => fetcher('/api/auth/me'),
  });
}

export function useAuthGuard(role?: 'admin') {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  if (!isLoading && (!user || (role && user.userType !== role))) {
    router.replace(role ? '/admin/login' : '/auth/login');
  }
  return { user, isLoading };
}
