"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setupOrganizationAndUser } from '@/actions/setup';

interface SetupFormProps {
  userId: string;
  userName?: string;
}

export function SetupForm({ userId, userName }: SetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Organization data
    orgName: '',
    logoUrl: '',
    plan: 'basic',
    // User data (auto-filled, not shown to user)
    employeeId: '000000', // Set to 000000 as requested
    userName: userName || '',
    role: 'admin' as 'admin' | 'manager' | 'employee',
    providerUserId: userId
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});
    
    // Basic validation for organization data
    const errors: Record<string, string> = {};
    if (!formData.orgName.trim()) errors.orgName = 'Organization name is required';
    if (!formData.logoUrl.trim()) errors.logoUrl = 'Logo URL is required';
    if (!formData.plan) errors.plan = 'Plan is required';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      // Organization data
      submitData.append('orgName', formData.orgName);
      submitData.append('logoUrl', formData.logoUrl);
      submitData.append('plan', formData.plan);
      // User data (auto-filled from auth)
      submitData.append('employeeId', formData.employeeId);
      submitData.append('userName', formData.userName);
      submitData.append('role', formData.role);
      submitData.append('providerUserId', formData.providerUserId);

      const result = await setupOrganizationAndUser(submitData);
      
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          setError(result.error || 'Setup failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Welcome to Zenith
          </h1>
          <p className="text-gray-400">
            Let's set up your organization
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-rose-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Organization Setup Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Organization Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-300 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                id="orgName"
                value={formData.orgName}
                onChange={(e) => handleInputChange('orgName', e.target.value)}
                className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                  fieldErrors.orgName 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="Enter your organization name"
              />
              {fieldErrors.orgName && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.orgName}</p>
              )}
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Logo URL *
              </label>
              <input
                type="url"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                  fieldErrors.logoUrl 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="https://example.com/logo.png"
              />
              {fieldErrors.logoUrl && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.logoUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-300 mb-2">
                Billing Plan *
              </label>
              <select
                id="plan"
                value={formData.plan}
                onChange={(e) => handleInputChange('plan', e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              >
                <option value="basic">Basic Plan</option>
                <option value="pro">Pro Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-800 to-red-700 hover:from-red-700 hover:to-rose-800 disabled:from-rose-800 disabled:to-red-900 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Organization...
                </div>
              ) : (
                'Create Organization'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Need help? Contact support at support@zenith.com</p>
        </div>
      </div>
    </div>
  );
}
