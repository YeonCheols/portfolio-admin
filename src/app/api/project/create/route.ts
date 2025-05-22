import { NextResponse } from 'next/server';
import { postData } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 외부 API 호출
    const data = await postData(`/project`, body);

    return NextResponse.json({ status: 200, data });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
