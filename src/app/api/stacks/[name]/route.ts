import { NextResponse } from 'next/server';

// 스택 메타데이터 타입 정의
export interface StackMetadata {
  name: string;
  icon: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tool' | 'other';
}

// 스택 메타데이터 정의 (실제로는 데이터베이스에서 관리해야 함)
const STACKS_METADATA: StackMetadata[] = [
  { name: 'PHP', icon: 'SiPhp', color: 'text-blue-500', category: 'backend' },
  { name: 'JavaScript', icon: 'SiJavascript', color: 'text-yellow-400', category: 'frontend' },
  { name: 'TypeScript', icon: 'SiTypescript', color: 'text-blue-400', category: 'frontend' },
  { name: 'Next.js', icon: 'SiNextdotjs', color: '', category: 'frontend' },
  { name: 'React.js', icon: 'SiReact', color: 'text-sky-500', category: 'frontend' },
  { name: 'TailwindCSS', icon: 'SiTailwindcss', color: 'text-cyan-300', category: 'frontend' },
  { name: 'Bootstrap', icon: 'BsFillBootstrapFill', color: 'text-purple-500', category: 'frontend' },
  { name: 'GraphQL', icon: 'SiGraphql', color: 'text-pink-600', category: 'backend' },
  { name: 'Apollo', icon: 'SiApollographql', color: '', category: 'backend' },
  { name: 'WordPress', icon: 'SiWordpress', color: '', category: 'backend' },
  { name: 'Laravel', icon: 'SiLaravel', color: 'text-red-500', category: 'backend' },
  { name: 'Material UI', icon: 'SiMui', color: 'text-sky-400', category: 'frontend' },
  { name: 'Vite', icon: 'SiVite', color: 'text-purple-500', category: 'tool' },
  { name: 'Prisma', icon: 'SiPrisma', color: 'text-emerald-500', category: 'database' },
  { name: 'Firebase', icon: 'SiFirebase', color: 'text-yellow-500', category: 'backend' },
  { name: 'Artificial Intelligence', icon: 'BsRobot', color: 'text-rose-500', category: 'other' },
  { name: 'Angular', icon: 'SiAngular', color: 'text-red-500', category: 'frontend' },
  { name: 'Vue.js', icon: 'SiVuedotjs', color: 'text-green-500', category: 'frontend' },
  { name: 'Nuxt.js', icon: 'SiNuxtdotjs', color: 'text-green-400', category: 'frontend' },
  { name: 'Node.js', icon: 'SiNodedotjs', color: 'text-green-600', category: 'backend' },
  { name: 'Gatsby', icon: 'SiGatsby', color: 'text-purple-600', category: 'frontend' },
  { name: 'Redux', icon: 'SiRedux', color: 'text-purple-500', category: 'frontend' },
  { name: 'Webpack', icon: 'SiWebpack', color: 'text-blue-500', category: 'tool' },
  { name: 'Styled Components', icon: 'SiStyledcomponents', color: 'text-pink-500', category: 'frontend' },
  { name: 'PWA', icon: 'SiPwa', color: 'text-amber-600', category: 'frontend' },
  { name: 'Nginx', icon: 'SiNginx', color: 'text-green-500', category: 'devops' },
  { name: 'Jest', icon: 'SiJest', color: 'text-red-600', category: 'tool' },
  { name: 'Storybook', icon: 'SiStorybook', color: 'text-amber-500', category: 'tool' },
  { name: 'CSS', icon: 'SiCss3', color: 'text-blue-300', category: 'frontend' },
  { name: 'Socket', icon: 'SiSocketdotio', color: '', category: 'backend' },
  { name: 'Express', icon: 'SiExpress', color: '', category: 'backend' },
  { name: 'Jquery', icon: 'SiJquery', color: '', category: 'frontend' },
  { name: 'Scss', icon: 'FaSass', color: 'text-pink-500', category: 'frontend' },
];

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const stackName = decodeURIComponent(params.name);
    const stack = STACKS_METADATA.find(s => s.name === stackName);

    if (!stack) {
      return NextResponse.json(
        {
          status: false,
          error: 'Stack not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: true,
      data: stack,
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        error: 'Failed to fetch stack',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: { name: string } }) {
  try {
    const stackName = decodeURIComponent(params.name);
    const body: StackMetadata = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.icon || !body.category) {
      return NextResponse.json(
        {
          status: false,
          error: 'Missing required fields: name, icon, category',
        },
        { status: 400 },
      );
    }

    const stackIndex = STACKS_METADATA.findIndex(s => s.name === stackName);
    if (stackIndex === -1) {
      return NextResponse.json(
        {
          status: false,
          error: 'Stack not found',
        },
        { status: 404 },
      );
    }

    // 이름이 변경된 경우 중복 검사
    if (body.name !== stackName) {
      const existingStack = STACKS_METADATA.find(s => s.name === body.name);
      if (existingStack) {
        return NextResponse.json(
          {
            status: false,
            error: 'Stack with this name already exists',
          },
          { status: 409 },
        );
      }
    }

    // 스택 업데이트
    const updatedStack: StackMetadata = {
      name: body.name,
      icon: body.icon,
      color: body.color || '',
      category: body.category,
    };

    STACKS_METADATA[stackIndex] = updatedStack;

    return NextResponse.json({
      status: true,
      data: updatedStack,
      message: 'Stack updated successfully',
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        error: 'Failed to update stack',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { name: string } }) {
  try {
    const stackName = decodeURIComponent(params.name);
    const stackIndex = STACKS_METADATA.findIndex(s => s.name === stackName);

    if (stackIndex === -1) {
      return NextResponse.json(
        {
          status: false,
          error: 'Stack not found',
        },
        { status: 404 },
      );
    }

    // 스택 삭제
    const deletedStack = STACKS_METADATA.splice(stackIndex, 1)[0];

    return NextResponse.json({
      status: true,
      data: deletedStack,
      message: 'Stack deleted successfully',
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        error: 'Failed to delete stack',
      },
      { status: 500 },
    );
  }
}
