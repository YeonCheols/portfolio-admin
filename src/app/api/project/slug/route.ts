import { NextResponse } from 'next/server';
import axios from 'axios';

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
    const { data } = await axios.get(`${process.env.API_URL}/project/${slug}`);

    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, data: [], error });
  }
}
