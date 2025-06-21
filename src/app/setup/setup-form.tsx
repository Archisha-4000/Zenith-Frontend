"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setupOrganizationAndUser } from "@/actions/setup";
import { Check, ExternalLink } from "lucide-react";

interface SetupFormProps {
  userId: string;
  userName?: string;
}

interface PricingCardProps {
  tier: string;
  price: string;
  bestFor: string;
  CTA: string;
  benefits: { text: string; checked: boolean }[];
  isSelected: boolean;
  onSelect: () => void;
}

function PricingCard({
  tier,
  price,
  bestFor,
  CTA,
  benefits,
  isSelected,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-red-500 bg-red-900/10 shadow-lg shadow-red-500/20"
          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Selected
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{tier}</h3>
        <div className="text-2xl font-bold text-red-400 mb-1">{price}</div>
        <p className="text-sm text-gray-400">{bestFor}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-sm">
            <Check
              className={`w-4 h-4 mr-3 ${
                benefit.checked ? "text-green-400" : "text-gray-600"
              }`}
            />
            <span
              className={benefit.checked ? "text-gray-300" : "text-gray-500"}
            >
              {benefit.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          tier === "Pro" 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : tier === "Enterprise"
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : isSelected
            ? "bg-red-500 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        {CTA}
        {(tier === "Pro" || tier === "Enterprise") && (
          <ExternalLink className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export function SetupForm({ userId, userName }: SetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Organization data
    orgName: "",
    logoUrl: "",
    plan: "free", // Default to free plan
    // User data (auto-filled, not shown to user)
    employeeId: "000000", // Set to 000000 as requested
    userName: userName || "",
    role: "admin" as "admin" | "manager" | "employee",
    providerUserId: userId,
  });

  const pricingPlans = [
    {
      tier: "Free",
      price: "$0/mo",
      bestFor: "Best for 1-5 users",
      CTA: "Get started free",
      value: "free",
      benefits: [
        { text: "One workspace", checked: true },
        { text: "Email support", checked: true },
        { text: "1 day data retention", checked: false },
        { text: "Custom roles", checked: false },
        { text: "Priority support", checked: false },
        { text: "SSO", checked: false },
      ],
    },
    {
      tier: "Pro",
      price: "$79/mo",
      bestFor: "Best for 5-50 users",
      CTA: "Book now",
      value: "pro",
      benefits: [
        { text: "Five workspaces", checked: true },
        { text: "Email support", checked: true },
        { text: "7 day data retention", checked: true },
        { text: "Custom roles", checked: true },
        { text: "Priority support", checked: false },
        { text: "SSO", checked: false },
      ],
    },
    {
      tier: "Enterprise",
      price: "Contact us",
      bestFor: "Best for 50+ users",
      CTA: "Contact us",
      value: "enterprise",
      benefits: [
        { text: "Unlimited workspaces", checked: true },
        { text: "Email support", checked: true },
        { text: "30 day data retention", checked: true },
        { text: "Custom roles", checked: true },
        { text: "Priority support", checked: true },
        { text: "SSO", checked: true },
      ],
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlanSelect = (planValue: string) => {
    // If Pro plan is selected, open Razorpay payment page in new tab
    if (planValue === "pro") {
      window.open("https://pages.razorpay.com/pl_QjvFBJY5FfWWRX/view", "_blank");
      return;
    }
    
    // If Enterprise plan is selected, open contact form or email
    if (planValue === "enterprise") {
      window.open("mailto:sales@zenith.com?subject=Enterprise Plan Inquiry", "_blank");
      return;
    }
    
    // For free plan, just select it normally
    setFormData((prev) => ({ ...prev, plan: planValue }));
    // Clear plan error if it exists
    if (fieldErrors.plan) {
      setFieldErrors((prev) => ({ ...prev, plan: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    // Basic validation for organization data
    const errors: Record<string, string> = {};
    if (!formData.orgName.trim())
      errors.orgName = "Organization name is required";
    if (!formData.logoUrl.trim()) errors.logoUrl = "Logo URL is required";
    if (!formData.plan) errors.plan = "Plan is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      // Organization data
      submitData.append("orgName", formData.orgName);
      submitData.append("logoUrl", formData.logoUrl);
      submitData.append("plan", formData.plan);
      // User data (auto-filled from auth)
      submitData.append("employeeId", formData.employeeId);
      submitData.append("userName", formData.userName);
      submitData.append("role", formData.role);
      submitData.append("providerUserId", formData.providerUserId);

      const result = await setupOrganizationAndUser(submitData);

      if (result.success) {
        // Store the IDs for potential use in the dashboard
        if (result.data) {
          // You can store these in localStorage, sessionStorage, or pass via URL params
          sessionStorage.setItem(
            "setupData",
            JSON.stringify({
              organizationId: result.data.organizationId,
              userId: result.data.userId,
              orgName: formData.orgName,
              plan: formData.plan,
            })
          );
        }
        router.push("/admin");
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          setError(result.error || "Setup failed. Please try again.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-['Poppins']">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Welcome to Zenith
          </h1>
          <p className="text-gray-400">Let's set up your organization</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-rose-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Organization Setup Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-red-500">
                Organization Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="orgName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="orgName"
                    value={formData.orgName}
                    onChange={(e) =>
                      handleInputChange("orgName", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                      fieldErrors.orgName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-700 focus:border-red-500 focus:ring-red-500"
                    }`}
                    placeholder="Enter your organization name"
                  />
                  {fieldErrors.orgName && (
                    <p className="mt-1 text-sm text-red-400">
                      {fieldErrors.orgName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="logoUrl"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Logo URL *
                  </label>
                  <input
                    type="url"
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      handleInputChange("logoUrl", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500 focus:ring-1 transition-colors ${
                      fieldErrors.logoUrl
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-700 focus:border-red-500 focus:ring-red-500"
                    }`}
                    placeholder="web-app-manifest-512x512.png"
                  />
                  {fieldErrors.logoUrl && (
                    <p className="mt-1 text-sm text-red-400">
                      {fieldErrors.logoUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-red-500">
                Choose Your Plan
              </h2>
              {fieldErrors.plan && (
                <p className="mb-4 text-sm text-red-400">{fieldErrors.plan}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.value}
                    tier={plan.tier}
                    price={plan.price}
                    bestFor={plan.bestFor}
                    CTA={plan.CTA}
                    benefits={plan.benefits}
                    isSelected={formData.plan === plan.value}
                    onSelect={() => handlePlanSelect(plan.value)}
                  />
                ))}
              </div>
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
                "Create Organization"
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
