import { getData } from '@/lib/api';
import { handleErrorResponse, handleSuccessResponse } from '@/lib/next';

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get('keyword');
    const page = Number(searchParams.get('page'));
    const size = Number(searchParams.get('size'));

    const requestParams = {
      page,
      size,
      keyword,
    };

    // 외부 API 호출
    const response = await getData(`/project/search`, requestParams);

    if (!response.status) {
      return handleErrorResponse(response);
    }
    return handleSuccessResponse(response);
  } catch (error) {
    return handleErrorResponse({
      error: error,
    });
  }
}
