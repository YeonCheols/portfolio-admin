import { NextResponse } from 'next/server';
import axios from 'axios';

type Data = {
  status: boolean;
  data?: any;
  error?: any;
};

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

    return NextResponse.json({ status: true, data } as Data);
  } catch (error: any) {
    // 에러 객체 직렬화 (axios error 객체는 순환 참조가 있을 수 있음)
    const errorData = {
      message: error?.message,
      ...(error?.response && { response: error.response.data }),
    };
    return NextResponse.json({ status: false, error: errorData } as Data);
  }
}
