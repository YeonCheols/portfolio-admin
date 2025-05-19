import { NextResponse } from 'next/server';
import { postData } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 외부 API 호출
    const data = await postData(`/project/create`, body);

    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, error });
  }
}
