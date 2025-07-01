export type ApiSuccess<T> = { status: true; data: T };
export type ApiError = { status: false; error: unknown };
export type ApiResult<T> = ApiSuccess<T> | ApiError;
