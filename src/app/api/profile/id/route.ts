import { NextResponse } from 'next/server';
import { getData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        status: false,
        data: [],
        message: 'id 파라미터를 넘겨주세요',
      });
    }

    // 외부 API 호출
    const response = await getData(`/profile/${id}`);
    if (response.status) {
      return NextResponse.json({ status: true, data: response.data });
    } else {
      return NextResponse.json({ status: false, data: [], error: response.error });
    }
  } catch (error) {
    return NextResponse.json({ status: false, data: [], error });
  }
}
