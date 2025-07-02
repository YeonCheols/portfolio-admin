import { NextResponse } from 'next/server';
import { type AdminTagCreateRequest, type AdminTagResponse } from '@/docs/api';
import { getData, postData } from '@/lib/api';

export async function GET() {
  try {
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

export async function POST(request: Request) {
  try {
    const body: AdminTagCreateRequest = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.icon || !body.category) {
      return NextResponse.json({
        status: false,
        error: 'Missing required fields: name, icon, category',
      });
    }

    // 새 스택 추가
    const newStack: AdminTagCreateRequest = {
      name: body.name,
      icon: body.icon,
      color: body.color,
      category: body.category,
    };

    const response = await postData(`/tag`, newStack);

    if (!response.status) {
      return NextResponse.json({
        status: false,
        error: response.error,
      });
    }

    return NextResponse.json({
      status: true,
      data: response.data,
    });
  } catch {
    return NextResponse.json({
      status: false,
      error: 'Failed to create stack',
    });
  }
}
