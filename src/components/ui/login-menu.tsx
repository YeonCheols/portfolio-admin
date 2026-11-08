'use client';

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { postData } from '@/lib/api';

export function LoginWithButton({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <User />
          <span className="sr-only">Toggle User</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isLoggedIn ? (
          <DropdownMenuItem
            onClick={async () => {
              await postData(`/user/logout`, {}, true);
              router.push('/login');
              router.refresh();
            }}
          >
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push('/login')}>Login</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
