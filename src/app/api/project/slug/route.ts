import { NextResponse } from 'next/server';
import { getData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({
        status: false,
        data: [],
        message: 'slug 파라미터를 넘겨주세요',
      });
    }

    // 외부 API 호출
    const response = await getData(`/project/${slug}`);
    if (response.status) {
      return NextResponse.json({ status: true, data: response.data || null });
    } else {
      return NextResponse.json({ status: false, data: [], error: response.error });
    }
  } catch (error) {
    return NextResponse.json({ status: false, data: [], error });
  }
}
