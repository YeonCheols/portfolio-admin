import { NextResponse } from 'next/server';
import { putData } from '@/lib/api';

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // 외부 API 호출
    const data = await putData(`/profile/${body.id}`, body);

    if (data.error) {
      return NextResponse.json({
        status: 500,
        error: data.error,
      });
    }

    return NextResponse.json({ ...data });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
