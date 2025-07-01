import { NextResponse } from 'next/server';
import { getData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);

    const pageNumber = Number(searchParams.get('page'));
    const pageSize = Number(searchParams.get('size'));

    const requestParams = {
      page: pageNumber,
      size: pageSize,
    };

    // 외부 API 호출
    const response = await getData(`/profile`, requestParams);
    if (response.status) {
      return NextResponse.json({ status: 200, data: response.data });
    } else {
      return NextResponse.json({ status: 500, error: response.error, data: [] });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, error, data: [] });
  }
}
