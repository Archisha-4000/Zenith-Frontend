"use client";

interface OrganizationNotFoundProps {
  userEmail: string;
}

export function OrganizationNotFound({ userEmail }: OrganizationNotFoundProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Organization Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              Your organization is not signed up with Zenith yet.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Please ask your organization administrator to sign up for Zenith to access your employee dashboard.
            </p>
            
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Signed in as:</p>
              <p className="text-sm text-gray-300">{userEmail}</p>
            </div>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
