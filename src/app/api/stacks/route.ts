import { NextResponse } from 'next/server';
import { type AdminTagResponse } from '@/docs/api';
import { getData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const response = await getData<AdminTagResponse[]>(`/tag`);

    // api 호출 실패 시
    if (!response.status) {
      return NextResponse.json({
        status: false,
        error: response.error,
        data: [],
      });
    }

    return NextResponse.json({
      status: true,
      data: response.data,
      total: response.data.length,
    });
  } catch {
    return NextResponse.json({
      status: false,
      error: 'Failed to fetch stacks metadata',
      data: [],
    });
  }
}

// export async function POST(request: Request) {
//   try {
//     const body: StackMetadata = await request.json();

//     // 필수 필드 검증
//     if (!body.name || !body.icon || !body.category) {
//       return NextResponse.json(
//         {
//           status: false,
//           error: 'Missing required fields: name, icon, category',
//         },
//         { status: 400 },
//       );
//     }

//     // 중복 검사
//     const existingStack = STACKS_METADATA.find(stack => stack.name === body.name);
//     if (existingStack) {
//       return NextResponse.json(
//         {
//           status: false,
//           error: 'Stack with this name already exists',
//         },
//         { status: 409 },
//       );
//     }

//     // 새 스택 추가
//     const newStack: StackMetadata = {
//       name: body.name,
//       icon: body.icon,
//       color: body.color || '',
//       category: body.category,
//     };

//     STACKS_METADATA.push(newStack);

//     return NextResponse.json(
//       {
//         status: true,
//         data: newStack,
//         message: 'Stack created successfully',
//       },
//       { status: 201 },
//     );
//   } catch {
//     return NextResponse.json(
//       {
//         status: false,
//         error: 'Failed to create stack',
//       },
//       { status: 500 },
//     );
//   }
// }
