import { NextResponse } from 'next/server';
import axios from 'axios';

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
    const { data } = await axios.get(`${process.env.API_URL}/project`, {
      params: requestParams,
    });

    return NextResponse.json({ status: true, data });
  } catch {
    return NextResponse.json({ status: false, data: [] });
  }
}
