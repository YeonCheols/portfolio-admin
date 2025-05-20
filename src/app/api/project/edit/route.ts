import { NextResponse } from 'next/server';
import { patchData } from '@/lib/api';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // 외부 API 호출
    const data = await patchData(`/project/${body.slug}`, body);

    if (data.error) {
      return NextResponse.json({
        status: 500,
        error: data.error,
      });
    }

    return NextResponse.json({ status: 200, data });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
