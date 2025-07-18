import { type AdminTagSearchResponse, type AdminTagCreateRequest, type AdminTagResponse } from '@/docs/api';
import { getData, postData } from '@/lib/api';
import { handleErrorResponse, handleSuccessResponse } from '@/lib/next';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');
  const size = searchParams.get('size');
  const keyword = searchParams.get('keyword');

  // 스택 검색 조회
  if (page && size) {
    try {
      const response = await getData<AdminTagSearchResponse>(
        `/tag/search?page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ''}`,
      );

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

  // 스택 전체 조회
  try {
    const response = await getData<AdminTagResponse[]>('/tag');
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

export async function POST(request: Request) {
  try {
    const body: AdminTagCreateRequest = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.icon || !body.category) {
      return handleErrorResponse({
        error: 'Missing required fields: name, icon, category',
      });
    }
    // 새 스택 추가
    const newStack: AdminTagCreateRequest = {
      name: body.name,
      icon: body.icon,
      color: body.color,
      category: body.category,
    };

    const response = await postData('/tag', newStack);

    if (!response.status) {
      return handleErrorResponse(response);
    }
    return handleSuccessResponse(response);
  } catch {
    return handleErrorResponse({
      error: 'Failed to create stack',
    });
  }
}
