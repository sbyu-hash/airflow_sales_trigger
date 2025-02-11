import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8080/health', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('airlfow:airlfow').toString('base64')
      },
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to check health' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 