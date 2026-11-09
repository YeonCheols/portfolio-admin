'use client';

import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { loginErrorMessage } from '@/lib/login-error';
import { oauthLoginUrl, type OAuthProvider } from '@/lib/oauth-login';

const providers: { id: OAuthProvider; name: string; icon: React.ReactNode }[] = [
  { id: 'google', name: 'Google', icon: <FcGoogle className="size-5" aria-hidden /> },
  { id: 'github', name: 'GitHub', icon: <FaGithub className="size-5" aria-hidden /> },
];

function OAuthLoginLinks() {
  // 로그인이 끝나면 API가 이 앱으로 돌려보내도록 현재 origin을 알린다(서버 렌더링 때는 알 수 없다)
  const [appOrigin, setAppOrigin] = useState<string>();
  // 이동을 시작한 공급자. 이동 중에는 같은 버튼을 다시 누르거나 다른 공급자를 고르지 못하게 한다
  const [pending, setPending] = useState<OAuthProvider>();

  useEffect(() => {
    setAppOrigin(window.location.origin);
    // 뒤로 가기로 돌아오면 브라우저가 이전 화면을 그대로 복원하므로 이동 중 표시를 걷어낸다
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setPending(undefined);
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const links = providers.flatMap(provider => {
    const href = oauthLoginUrl(provider.id, appOrigin);
    return href ? [{ ...provider, href }] : [];
  });

  if (links.length === 0) {
    return (
      <p role="status" className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
        로그인 주소가 설정되지 않았습니다. 관리자에게 문의해주세요.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {links.map(({ id, name, icon, href }) => {
        const isPending = pending === id;
        const isBlocked = pending !== undefined && !isPending;
        return (
          <Button
            key={id}
            asChild
            variant="outline"
            size="lg"
            className={`w-full justify-center gap-3 ${isBlocked ? 'pointer-events-none opacity-50' : ''}`}
          >
            <a
              href={href}
              aria-disabled={pending !== undefined}
              aria-busy={isPending}
              onClick={event => {
                if (pending) {
                  event.preventDefault();
                  return;
                }
                setPending(id);
              }}
            >
              {isPending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
              <span>{isPending ? `${name}로 이동하는 중…` : `${name}로 로그인`}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}

function LoginForm({ error }: { error?: string }) {
  const oauthError = loginErrorMessage(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <section className="w-full max-w-sm rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">관리자 로그인</h1>
          <p className="text-sm text-muted-foreground">등록된 관리자 계정으로만 접근할 수 있습니다.</p>
        </div>

        {oauthError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{oauthError}</p>
          </div>
        )}

        <OAuthLoginLinks />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          로그인할 수 없다면 GitHub·Google 계정의 대표 이메일이 관리자로 등록되어 있는지 확인해주세요.
        </p>
      </section>
    </main>
  );
}

LoginForm.displayName = 'LoginForm';

export { LoginForm };
