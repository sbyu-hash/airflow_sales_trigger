'use client';

import { useState } from 'react';

interface ReportParams {
  brand_name: string;
  start_date: string;
  end_date: string;
}

const AIRFLOW_API_BASE_URL = 'http://localhost:8080/api/v1';
const AIRFLOW_AUTH = btoa('airflow:airflow'); // base64 encode credentials

export default function Home() {
  const [expandedItem, setExpandedItem] = useState<string | null>('DPOS_BRAND_SALES_REPORT');
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [reportParams, setReportParams] = useState<Record<string, ReportParams>>({
    'DPOS_BRAND_SALES_REPORT': {
      brand_name: '퀴즈노스-배민1제외',
      start_date: '2024-03-01',
      end_date: '2024-03-10'
    }
  });

  const handleParamChange = (report: string, field: keyof ReportParams, value: string) => {
    setReportParams(prev => ({
      ...prev,
      [report]: {
        ...prev[report] || { brand_name: '', start_date: '', end_date: '' },
        [field]: value
      }
    }));
  };

  const handleTrigger = async (report: string) => {
    const params = reportParams[report];
    if (!params?.brand_name || !params?.start_date || !params?.end_date) {
      alert('Please fill in all parameters');
      return;
    }

    try {
      const response = await fetch(`/api/trigger/${report}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conf: params
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('DAG triggered successfully:', data);
        alert('Report triggered successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to trigger report:', errorData);
        alert('Failed to trigger report');
      }
    } catch (error) {
      console.error('Failed to trigger report:', error);
      alert('Failed to trigger report');
    }
  };

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/health');
      
      if (response.ok) {
        setHealthStatus('healthy');
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('unhealthy');
    } finally {
      setIsChecking(false);
    }
  };

  const reports = [
    'DPOS_BRAND_SALES_REPORT',
    'DPOS_MONTHLY_SALES_REPORT',
    'DPOS_RECEIPT_LISTS_DETAIL_REPORT',
    'MPOS_BRAND_OPTION_REPORT',
    'MPOS_MENU_OPTION_REPORT',
    'MPOS_MONTHLY_SALES_REPORT',
    'MPOS_MONTHLY_SALES_REPORT_BIG_QUERY'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="text-xl font-bold text-gray-800">
          <img 
            src="/foodtech.png" 
            alt="FoodTech Logo" 
            className="h-8"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-green-500 mb-4">POS 매출데이터 추출</h1>
        <div className="flex gap-4 mb-8">
          {healthStatus !== null && (
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <div className={`w-2 h-2 ${healthStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
              <span className="text-gray-700">Status: {healthStatus}</span>
            </div>
          )}
          <button 
            className={`${
              isChecking 
                ? 'bg-gray-400' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded-lg transition-colors`}
            onClick={checkHealth}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Check Health'}
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex justify-between items-center px-6 py-4 bg-white cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedItem(expandedItem === report ? null : report)}
              >
                <h2 className="text-lg font-medium text-gray-800">{report}</h2>
                <div className="flex items-center gap-2">
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrigger(report);
                    }}
                  >
                    Trigger
                  </button>
                  <span className={`transform transition-transform ${
                    expandedItem === report ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </div>
              </div>
              
              {expandedItem === report && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-600">Parameters:</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                          value={reportParams[report]?.brand_name || ''}
                          onChange={(e) => handleParamChange(report, 'brand_name', e.target.value)}
                          placeholder="Enter brand name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                            value={reportParams[report]?.start_date || ''}
                            onChange={(e) => handleParamChange(report, 'start_date', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                            value={reportParams[report]?.end_date || ''}
                            onChange={(e) => handleParamChange(report, 'end_date', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
