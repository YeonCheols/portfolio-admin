import { NextResponse } from 'next/server';
import { deleteData } from '@/lib/api';

export async function DELETE(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // 외부 API 호출
    const data = await deleteData(`/profile/${slug}`);

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
