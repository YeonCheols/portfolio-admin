import { NextResponse } from 'next/server';
import { type AdminTagUpdateRequest, type AdminTagResponse } from '@/docs/api';
import { deleteData, getData, putData } from '@/lib/api';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.pathname.split('/')[3];
  try {
    const stackName = decodeURIComponent(name || '');
    const stack = await getData<AdminTagResponse>(`/tag/${stackName}`);

    if (!stack) {
      return NextResponse.json({
        status: false,
        error: 'Stack not found',
      });
    }

    return NextResponse.json({
      status: true,
      data: stack,
    });
  } catch {
    return NextResponse.json({
      status: false,
      error: 'Failed to fetch stack',
    });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.pathname.split('/')[3];
    const stackName = decodeURIComponent(name || '');
    const body: AdminTagUpdateRequest = await request.json();

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

    // 스택 업데이트
    const updatedStack: AdminTagUpdateRequest = {
      name: body.name,
      icon: body.icon,
      color: body.color || '',
      category: body.category,
    };

    const response = await putData(`/tag/${stackName}`, updatedStack);

    return NextResponse.json({
      status: true,
      data: response,
      message: 'Stack updated successfully',
    });
  } catch {
    return NextResponse.json({
      status: false,
      error: 'Failed to update stack',
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.pathname.split('/')[3];

    // 스택 삭제
    const response = await deleteData(`/tag/${name}`);

    return NextResponse.json({
      status: true,
      data: response,
      message: 'Stack deleted successfully',
    });
  } catch {
    return NextResponse.json({
      status: false,
      error: 'Failed to delete stack',
    });
  }
}
