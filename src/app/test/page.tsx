'use client';

import { useState } from 'react';
import { createOrgAction } from '@/actions';
interface TestResult {
  success: boolean;
  message: string;
  data?: any;
}

export default function TestDBPage() {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    plan: 'basic' as 'basic' | 'pro'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('logoUrl', formData.logoUrl || 'default-web-app-manifest-512x512.png'); // Provide default logo URL
      formDataObj.append('plan', formData.plan);

      const org = await createOrgAction(formDataObj);
      
      if (org.success) {
        setResult({
          success: true,
          message: 'Organization created successfully!',
          data: org.data
        });
      } else {
        setResult({
          success: false,
          message: org.error || 'Failed to create organization',
          data: org.fieldErrors ? { fieldErrors: org.fieldErrors } : undefined
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Organization Test</h1>
      

      {/* Test Form Section */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Organization Creation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="web-app-manifest-512x512.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium mb-1">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value as 'basic' | 'pro'})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating Organization...' : 'Create Organization'}
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <div className={`mt-6 p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-rose-800'}`}>
            <h3 className="font-semibold mb-2">Result:</h3>
            <p>{result.message}</p>
            {result.data && (
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}