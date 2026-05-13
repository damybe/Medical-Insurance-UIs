"use client";

import React, { useState } from "react";
import { Select, Checkbox, Collapse } from "antd";
import { DownOutlined, CheckOutlined } from "@ant-design/icons";

// Deductible options with premium multipliers
const deductibleOptions = [
  { value: "0", label: "$0", multiplier: 1.3 },
  { value: "250", label: "$250", multiplier: 1.15 },
  { value: "500", label: "$500", multiplier: 1.0 },
  { value: "1000", label: "$1,000", multiplier: 0.85 },
  { value: "2500", label: "$2,500", multiplier: 0.7 },
];

interface Plan {
  id: string;
  name: string;
  tagline: string;
  region: string;
  regionOptions: { value: string; label: string }[];
  baseIpOnlyPrice: number | null;
  baseIpOpPrice: number;
  defaultDeductible: string;
  annualMax: string;
  network: string;
  extraCovers: { id: string; label: string; included: boolean }[];
  hasExtraCovers: boolean;
}

interface VerticalPlanCardsProps {
  selectedPlans: string[];
  onPlanToggle: (planId: string, checked: boolean) => void;
  selectedRegions: Record<string, string>;
  onRegionChange: (planId: string, region: string) => void;
  extraCoversState: Record<string, string[]>;
  onExtraCoverToggle: (planId: string, coverId: string, checked: boolean) => void;
  selectedDeductibles: Record<string, string>;
  onDeductibleChange: (planId: string, deductible: string) => void;
}

const plans: Plan[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Starter protection for basics",
    region: "network-only",
    regionOptions: [
      { value: "network-only", label: "Network Only" },
      { value: "sea", label: "SEA Coverage" },
    ],
    baseIpOnlyPrice: 450,
    baseIpOpPrice: 620,
    defaultDeductible: "500",
    annualMax: "$50,000",
    network: "Basic Network",
    extraCovers: [
      { id: "maternity", label: "Maternity Benefit", included: false },
      { id: "wellness", label: "Wellness & Checkup", included: false },
    ],
    hasExtraCovers: true,
  },
  {
    id: "advance",
    name: "Advance",
    tagline: "Higher limits for active lifestyles",
    region: "sea",
    regionOptions: [
      { value: "sea", label: "SEA Coverage" },
      { value: "asia-pacific", label: "Asia Pacific" },
      { value: "worldwide", label: "Worldwide" },
    ],
    baseIpOnlyPrice: 850,
    baseIpOpPrice: 1100,
    defaultDeductible: "250",
    annualMax: "$150,000",
    network: "Global Network",
    extraCovers: [
      { id: "maternity", label: "Maternity Benefit", included: true },
      { id: "dental", label: "Dental & Optical", included: false },
    ],
    hasExtraCovers: true,
  },
  {
    id: "premier",
    name: "Premier",
    tagline: "Complete health solution",
    region: "worldwide",
    regionOptions: [
      { value: "asia-pacific", label: "Asia Pacific" },
      { value: "worldwide", label: "Worldwide" },
    ],
    baseIpOnlyPrice: null,
    baseIpOpPrice: 1850,
    defaultDeductible: "0",
    annualMax: "$500,000",
    network: "VIP World Network",
    extraCovers: [
      { id: "maternity", label: "Full Maternity", included: true },
      { id: "dental-vision", label: "Dental, Vision, Wellness", included: true },
    ],
    hasExtraCovers: true,
  },
  {
    id: "bronze",
    name: "Bronze",
    tagline: "Budget-friendly essential care",
    region: "local",
    regionOptions: [
      { value: "local", label: "Local Network" },
      { value: "regional", label: "Regional" },
    ],
    baseIpOnlyPrice: 320,
    baseIpOpPrice: 480,
    defaultDeductible: "1000",
    annualMax: "$25,000",
    network: "Restricted Network",
    extraCovers: [],
    hasExtraCovers: false,
  },
];

// Detailed plan information for expandable section
const planDetails = {
  classic: {
    coverage: [
      { label: "Eligible Providers", value: "Network" },
      { label: "Emergency Coverage", value: "24/7" },
      { label: "Lifetime Maximum", value: "$500,000" },
      { label: "Waiting Period", value: "30 days" },
    ],
    inpatient: [
      { label: "Accommodations", value: "Semi-Private" },
      { label: "ICU Coverage", value: "Included" },
      { label: "Extended Care", value: "30 days" },
    ],
  },
  advance: {
    coverage: [
      { label: "Eligible Providers", value: "All Providers" },
      { label: "Emergency Coverage", value: "24/7" },
      { label: "Lifetime Maximum", value: "$1,500,000" },
      { label: "Waiting Period", value: "15 days" },
    ],
    inpatient: [
      { label: "Accommodations", value: "Private" },
      { label: "ICU Coverage", value: "Included" },
      { label: "Extended Care", value: "90 days" },
    ],
  },
  premier: {
    coverage: [
      { label: "Eligible Providers", value: "All Providers" },
      { label: "Emergency Coverage", value: "24/7" },
      { label: "Lifetime Maximum", value: "$5,000,000" },
      { label: "Waiting Period", value: "None" },
    ],
    inpatient: [
      { label: "Accommodations", value: "Deluxe" },
      { label: "ICU Coverage", value: "Included" },
      { label: "Extended Care", value: "Unlimited" },
    ],
  },
  bronze: {
    coverage: [
      { label: "Eligible Providers", value: "Network Only" },
      { label: "Emergency Coverage", value: "24/7" },
      { label: "Lifetime Maximum", value: "$250,000" },
      { label: "Waiting Period", value: "30 days" },
    ],
    inpatient: [
      { label: "Accommodations", value: "Ward" },
      { label: "ICU Coverage", value: "Limited" },
      { label: "Extended Care", value: "14 days" },
    ],
  },
};

export default function VerticalPlanCards({
  selectedPlans,
  onPlanToggle,
  selectedRegions,
  onRegionChange,
  extraCoversState,
  onExtraCoverToggle,
  selectedDeductibles,
  onDeductibleChange,
}: VerticalPlanCardsProps) {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCardExpansion = (planId: string) => {
    setExpandedCards((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  // Calculate premium based on deductible selection
  const calculatePremium = (basePrice: number | null, planId: string, plan: Plan) => {
    if (basePrice === null) return null;
    const deductible = selectedDeductibles[planId] || plan.defaultDeductible;
    const option = deductibleOptions.find(d => d.value === deductible);
    const multiplier = option?.multiplier || 1.0;
    return Math.round(basePrice * multiplier);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const isSelected = selectedPlans.includes(plan.id);
        const currentRegion = selectedRegions[plan.id] || plan.regionOptions[0]?.value;
        const currentExtraCovers = extraCoversState[plan.id] || plan.extraCovers.filter(c => c.included).map(c => c.id);
        const isExpanded = expandedCards.includes(plan.id);
        const details = planDetails[plan.id as keyof typeof planDetails];

        return (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 transition-all overflow-hidden flex flex-col ${
              isSelected ? "border-[#c8102e] shadow-lg" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Header */}
            <div className="p-5 pb-4">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.tagline}</p>
            </div>

            {/* Region Selector */}
            <div className="px-5 pb-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </label>
              <Select
                value={currentRegion}
                onChange={(value) => onRegionChange(plan.id, value)}
                options={plan.regionOptions}
                className="w-full mt-1"
                size="middle"
                suffixIcon={<DownOutlined className="text-gray-400" />}
              />
            </div>

            {/* Pricing */}
            <div className="px-5 pb-4">
              <div className="flex items-end gap-6">
                {plan.baseIpOnlyPrice !== null ? (
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Only
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-[#c8102e]">
                        ${calculatePremium(plan.baseIpOnlyPrice, plan.id, plan)?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">/year</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Only
                    </span>
                    <div className="mt-1">
                      <span className="text-lg text-gray-400">N/A</span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP & OP
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-[#c8102e]">
                      ${calculatePremium(plan.baseIpOpPrice, plan.id, plan)?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">/year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="px-5 pb-4 flex-grow">
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Annual Max</span>
                  <span className="font-semibold text-gray-900">{plan.annualMax}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Deductible</span>
                  <Select
                    size="small"
                    value={selectedDeductibles[plan.id] || plan.defaultDeductible}
                    onChange={(value) => onDeductibleChange(plan.id, value)}
                    options={deductibleOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                    className="w-[100px]"
                    popupMatchSelectWidth={false}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Network</span>
                  <span className="font-semibold text-gray-900">{plan.network}</span>
                </div>
              </div>
            </div>

            {/* Extra Covers */}
            <div className="px-5 pb-4">
              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-medium text-[#c8102e] uppercase tracking-wider">
                  Extra Covers
                </span>
                {plan.hasExtraCovers ? (
                  <div className="mt-2 space-y-2">
                    {plan.extraCovers.map((cover) => {
                      const isCoverChecked = currentExtraCovers.includes(cover.id);
                      return (
                        <label
                          key={cover.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={isCoverChecked}
                            onChange={(e) =>
                              onExtraCoverToggle(plan.id, cover.id, e.target.checked)
                            }
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {cover.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-400 italic">
                    No extra covers available
                  </p>
                )}
              </div>
            </div>

            {/* Select Button */}
            <div className="px-5 pb-4">
              <button
                onClick={() => onPlanToggle(plan.id, !isSelected)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#0a3d62] text-white hover:bg-[#082c47]"
                    : "bg-[#c8102e] text-white hover:bg-[#a00d25]"
                }`}
              >
                {isSelected ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckOutlined />
                    Selected
                  </span>
                ) : (
                  `Select ${plan.name}`
                )}
              </button>
            </div>

            {/* More Details Accordion */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => toggleCardExpansion(plan.id)}
                className="w-full px-5 py-3 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                More Details
                <DownOutlined
                  className={`text-xs transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Coverage Details
                      </h4>
                      <div className="space-y-2">
                        {details.coverage.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium text-gray-900">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Inpatient Benefits
                      </h4>
                      <div className="space-y-2">
                        {details.inpatient.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium text-gray-900">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to Quotation */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => onPlanToggle(plan.id, e.target.checked)}
                />
                <span className="text-sm text-gray-700">Add to Quotation</span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
