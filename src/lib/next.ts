import { NextResponse } from 'next/server';
import { type ApiSuccess, type ApiError } from '@/types/api';

export const handleSuccessResponse = <T>(response: Pick<ApiSuccess<T>, 'data'>) => {
  return NextResponse.json({
    status: true,
    data: response.data,
  });
};

export const handleErrorResponse = (response: Pick<ApiError, 'error'>) => {
  return NextResponse.json({
    status: false,
    error: response.error,
  });
};
