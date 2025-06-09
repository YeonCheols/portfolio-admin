import { NextResponse } from 'next/server';
import { postData } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 외부 API 호출
    const data = await postData(`/profile`, body);

    return NextResponse.json({ ...data });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
