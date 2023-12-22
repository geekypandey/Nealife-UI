import { ErrorInterceptor } from './error.interceptor';
import { RequestInterceptor } from './request.interceptor';

export const INTERCEPTORS = [RequestInterceptor, ErrorInterceptor];
