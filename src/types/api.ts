export type ApiSuccess<T> = { status: true; data: T };
type ApiError = { status: false; error: unknown; data: undefined };
export type ApiResult<T> = ApiSuccess<T> | ApiError;
