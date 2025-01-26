import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Version 1 of the API is deprecated and will be removed in the future. Please use version 2 of the API.',
      docs: 'https://canvasmc.io/docs',
    },
    { status: 426 }, // HTTP 426 Upgrade Required
  );
}

export { GET as POST, GET as PUT, GET as DELETE, GET as PATCH }; // Handle all HTTP methods with same response
