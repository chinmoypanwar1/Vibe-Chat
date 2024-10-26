import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/apiResponse';

export function sendApiResponse(
    success: boolean,
    message: string,
    status: number,
    data?: Object,
    redirectedURL?: string
) {
    const response: ApiResponse = {
        success,
        message,
        data
    };

    if(redirectedURL) {
        return NextResponse.redirect(redirectedURL)
    }

    return NextResponse.json(response, { status });
}