import { NextRequest, NextResponse } from 'next/server';

const AIRFLOW_API_BASE_URL = 'http://localhost:8080/api/v1';
const AIRFLOW_AUTH = btoa('airflow:airflow');

export async function POST(
  request: NextRequest,
  { params }: { params: { report: string } }
) {
  try {
    const body = await request.json();
    
    const airflowResponse = await fetch(
      `${AIRFLOW_API_BASE_URL}/dags/${params.report}/dagRuns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${AIRFLOW_AUTH}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await airflowResponse.json();

    if (!airflowResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to trigger DAG', details: data },
        { status: airflowResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error triggering DAG:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 