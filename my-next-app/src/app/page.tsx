'use client';

import { useState } from 'react';

export default function Home() {
  const [expandedItem, setExpandedItem] = useState<string | null>('DPOS_BRAND_SALES_REPORT');

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
        <div className="text-xl font-bold text-gray-800">Logo</div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Airflow DAG Trigger</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Status: unhealthy</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              Check Health
            </button>
          </div>
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
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
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
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-600">Parameters (JSON format):</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono">
                      {"{'key': 'value'}"}
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
