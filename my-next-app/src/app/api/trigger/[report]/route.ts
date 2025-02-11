import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { report: string } }
) {
  try {
    const body = await request.json();
    
    const response = await fetch(
      `http://localhost:8080/api/v1/dags/${params.report}/dagRuns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('airflow:airflow').toString('base64')
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to trigger DAG:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to trigger DAG' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 