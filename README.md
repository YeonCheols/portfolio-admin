# 연철s 포트폴리오 어드민

[VisActor](https://visactor.io/)와 Next.js로 구축된 현대적인 대시보드 템플릿으로, 아름다운 UI와 풍부한 데이터 시각화 컴포넌트를 제공합니다.

[라이브 데모](https://visactor-next-template.vercel.app/)

[![Vercel로 배포하기](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=A%20modern%20dashboard%20with%20VisActor%20charts%2C%20dark%20mode%2C%20and%20data%20visualization%20for%20seamless%20analytics.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F646TLqKGSTOnp1CD1IUqoM%2Fa119adac1f5a844f9d42f807ddc075f5%2Fthumbnail.png&demo-title=VisActor%20Next.js%20Template&demo-url=https%3A%2F%2Fvisactor-next-template.vercel.app%2F&from=templates&project-name=VisActor%20Next.js%20Template&repository-name=visactor-nextjs-template&repository-url=https%3A%2F%2Fgithub.com%2Fmengxi-ream%2Fvisactor-next-template&skippable-integrations=1)

## 주요 기능

- 📊 **다양한 시각화** - VisActor 기반의 막대 차트, 게이지 차트, 서클 패킹 차트 등 제공
- 🌗 **다크 모드** - 시스템 환경설정을 지원하는 원활한 다크/라이트 모드 전환
- 📱 **반응형 디자인** - 모든 기기에서 작동하는 완전한 반응형 레이아웃
- 🎨 **아름다운 UI** - Tailwind CSS로 구축된 현대적이고 깔끔한 인터페이스
- ⚡️ **Next.js 15** - 최신 Next.js 기능과 모범 사례 기반
- 🔄 **상태 관리** - Jotai를 사용한 효율적인 상태 관리
- 📦 **컴포넌트 라이브러리** - Tailwind로 스타일링된 Shadcn 컴포넌트 포함

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [VisActor](https://visactor.io/) - 시각화 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Shadcn](https://ui.shadcn.com/) - UI 컴포넌트
- [Jotai](https://jotai.org/) - 상태 관리
- [TypeScript](https://www.typescriptlang.org/) - 타입 안정성

## 빠른 시작

위의 버튼을 클릭하여 Vercel에 이 템플릿을 배포하거나, 이 저장소를 클론하여 로컬에서 실행할 수 있습니다.

[Github 저장소](https://github.com/mengxi-ream/visactor-next-template)

1. 이 저장소를 클론합니다

```bash
git clone https://github.com/mengxi-ream/visactor-next-template
```

2. 의존성을 설치합니다

```bash
pnpm install
```

3. 개발 서버를 실행합니다

```bash
pnpm dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인합니다.

## 프로젝트 구조

```bash
src/
├── app/ # 앱 라우터 페이지
├── components/ # React 컴포넌트
│ ├── chart-blocks/ # 차트 컴포넌트
│ ├── nav/ # 네비게이션 컴포넌트
│ └── ui/ # UI 컴포넌트
├── config/ # 설정 파일
├── data/ # 샘플 데이터
├── hooks/ # 커스텀 훅
├── lib/ # 유틸리티 함수
├── style/ # 전역 스타일
└── types/ # TypeScript 타입
```

## 차트

이 템플릿은 다음과 같은 차트 예제를 포함합니다:

- 평균 티켓 생성 수 (막대 차트)
- 채널별 티켓 (게이지 차트)
- 전환율 (서클 패킹 차트)
- 고객 만족도 (선형 진행률)
- 지표 개요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
