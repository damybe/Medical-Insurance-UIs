"use client";

import React, { useState } from "react";
import { Select, Switch, Checkbox, Collapse } from "antd";
import { SafetyCertificateOutlined, CheckOutlined, DownOutlined, TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import VerticalPlanCards from "./VerticalPlanCards";

interface SelectPlanFormProps {
  onContinue: (planData: PlanData) => void;
  onBack: () => void;
}

export interface PlanData {
  planType: "standard" | "customized";
  selectedPlans?: string[];
  geographicalCoverage?: Record<string, string>;
  customizedCovers?: string[];
  optionalBenefits?: string[];
}

// Deductible options with premium multipliers
const deductibleOptions = [
  { value: "0", label: "$0", multiplier: 1.3 },
  { value: "250", label: "$250", multiplier: 1.15 },
  { value: "500", label: "$500", multiplier: 1.0 },
  { value: "1000", label: "$1,000", multiplier: 0.85 },
  { value: "2500", label: "$2,500", multiplier: 0.7 },
];

// Plan definitions with geographical options and premium values
const standardPlans = [
  { 
    id: "classic-ip", 
    name: "", 
    type: "IP Only", 
    color: "#6b7280",
    group: "classic",
    basePremium: 450,
    defaultDeductible: "500",
    geoOptions: [
      { value: "sea", label: "SEA" },
      { value: "asia-pacific-plus", label: "Asia Pacific+" },
    ]
  },
  { 
    id: "classic-ipop", 
    name: "", 
    type: "IP & OP", 
    color: "#6b7280",
    group: "classic",
    basePremium: 680,
    defaultDeductible: "500",
    geoOptions: [
      { value: "sea", label: "SEA" },
      { value: "asia-pacific-plus", label: "Asia Pacific+" },
      { value: "international-plus", label: "International+" },
      { value: "worldwide", label: "Worldwide" },
    ]
  },
  { 
    id: "advance-ip", 
    name: "", 
    type: "IP Only", 
    color: "#3b82f6",
    group: "advance",
    basePremium: 750,
    defaultDeductible: "250",
    geoOptions: [
      { value: "regional", label: "Regional" },
    ]
  },
  { 
    id: "advance-ipop", 
    name: "", 
    type: "IP & OP", 
    color: "#3b82f6",
    group: "advance",
    basePremium: 1100,
    defaultDeductible: "250",
    geoOptions: [
      { value: "regional", label: "Regional" },
      { value: "asia-pacific-plus", label: "Asia Pacific+" },
      { value: "international-plus", label: "International+" },
      { value: "worldwide", label: "Worldwide" },
    ]
  },
  { 
    id: "premier-ipop", 
    name: "", 
    type: "IP & OP", 
    color: "#8b5cf6",
    group: "premier",
    basePremium: 1850,
    defaultDeductible: "0",
    geoOptions: [
      { value: "regional", label: "Regional" },
      { value: "asia-pacific", label: "Asia Pacific" },
      { value: "asia-pacific-plus", label: "Asia Pacific+" },
      { value: "international-plus", label: "International+" },
      { value: "worldwide", label: "Worldwide" },
    ]
  },
  { 
    id: "bronze-ip", 
    name: "Bronze", 
    type: "IP Only", 
    color: "#cd7f32",
    group: "metal",
    basePremium: 320,
    defaultDeductible: "1000",
    geoOptions: [
      { value: "sea-ex-sg", label: "South East Asia excluding Singapore" },
    ]
  },
  { 
    id: "silver-ip", 
    name: "Silver", 
    type: "IP Only", 
    color: "#9ca3af",
    group: "metal",
    basePremium: 520,
    defaultDeductible: "500",
    geoOptions: [
      { value: "asia-europe-ex", label: "Asia & Europe excluding Singapore, Hong Kong, UK, Switzerland" },
    ]
  },
  { 
    id: "gold-ip", 
    name: "Gold", 
    type: "IP Only", 
    color: "#f59e0b",
    group: "metal",
    basePremium: 890,
    defaultDeductible: "500",
    geoOptions: [
      { value: "worldwide-ex-usa-canada", label: "Worldwide excluding USA and Canada" },
    ]
  },
  { 
    id: "platinum-ip", 
    name: "Platinum", 
    type: "IP Only", 
    color: "#6366f1",
    group: "metal",
    basePremium: 1450,
    defaultDeductible: "250",
    geoOptions: [
      { value: "worldwide", label: "Worldwide" },
    ]
  },
];

// Coverage data for comparison
const coverageData = [
  { label: "Eligible Providers", values: ["Network", "Network", "All", "All", "All", "Network", "Network", "All", "All"] },
  { label: "Emergency Coverage", values: ["24/7", "24/7", "24/7", "24/7", "24/7", "24/7", "24/7", "24/7", "24/7"] },
  { label: "Annual Maximum", values: ["$50,000", "$75,000", "$100,000", "$150,000", "$500,000", "$25,000", "$50,000", "$100,000", "$250,000"] },
  { label: "Lifetime Maximum", values: ["$500K", "$750K", "$1M", "$1.5M", "$5M", "$250K", "$500K", "$1M", "$2.5M"] },
  { label: "Inpatient Maximum", values: ["$50,000", "$75,000", "$100,000", "$150,000", "$500,000", "$25,000", "$50,000", "$100,000", "$250,000"] },
  { label: "Outpatient Maximum", values: ["-", "$5,000", "-", "$10,000", "$15,000", "-", "-", "-", "-"] },
  { label: "Waiting Period", values: ["30 days", "30 days", "15 days", "15 days", "None", "30 days", "30 days", "15 days", "None"] },
];

const deductibleData = [
  { label: "Individual Annual Deductibles", values: ["$500", "$500", "$250", "$250", "$0", "$1,000", "$750", "$500", "$250"] },
  { label: "Family Annual Deductible", values: ["$1,500", "$1,500", "$750", "$750", "$0", "$3,000", "$2,250", "$1,500", "$750"] },
  { label: "Policy Co-payment", values: ["20%", "20%", "10%", "10%", "0%", "30%", "25%", "20%", "10%"] },
];

const inpatientData = [
  { label: "Intensive Care Unit and Theatre Costs", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "Operating and Emergency Room", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "Accommodations", values: ["Semi-Private", "Semi-Private", "Private", "Private", "Deluxe", "Ward", "Semi-Private", "Private", "Deluxe"] },
  { label: "Companion Bed", values: ["✓", "✓", "✓", "✓", "✓", "-", "✓", "✓", "✓"] },
  { label: "Doctor's, Surgeon's, Anesthesiologist's Fees", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "Nursing Fees and Ancillary Fees", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "Therapy and Treatment", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "X-rays, Diagnostic Tests and Procedures", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "MRI, PET, CT Scans and Oncology Tests", values: ["✓", "✓", "✓", "✓", "✓", "Limited", "✓", "✓", "✓"] },
  { label: "Drugs and Dressings", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
  { label: "Reconstructive Surgery Following Accident", values: ["✓", "✓", "✓", "✓", "✓", "-", "✓", "✓", "✓"] },
  { label: "Durable Medical Equipment", values: ["$1,000", "$1,500", "$2,500", "$3,500", "$5,000", "$500", "$1,000", "$2,000", "$3,500"] },
  { label: "Extended Care", values: ["30 days", "45 days", "60 days", "90 days", "Unlimited", "14 days", "30 days", "60 days", "90 days"] },
];

const customizedCovers = [
  { id: "inpatient", label: "Inpatient Coverage", labelKh: "ការគ្របដណ្តប់អ្នកជំងឺក្នុង", description: "Hospital stays, surgeries, and intensive care" },
  { id: "outpatient", label: "Outpatient Coverage", labelKh: "ការគ្របដណ្តប់អ្នកជំងឺក្រៅ", description: "Doctor visits, consultations, and diagnostics" },
  { id: "emergency", label: "Emergency Coverage", labelKh: "ការគ្របដណ្តប់សង្គ្រោះបន្ទាន់", description: "24/7 emergency medical services" },
  { id: "dental", label: "Dental Coverage", labelKh: "ការគ្របដណ្តប់ធ្មេញ", description: "Dental treatments and procedures" },
  { id: "maternity", label: "Maternity Coverage", labelKh: "ការគ្របដណ���តប់មាតុភាព", description: "Pregnancy, childbirth, and postnatal care" },
];

export default function SelectPlanForm({ onContinue, onBack }: SelectPlanFormProps) {
  const [planType, setPlanType] = useState<"standard" | "customized">("standard");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<Record<string, string>>({});
  const [selectedDeductibles, setSelectedDeductibles] = useState<Record<string, string>>(() => {
    // Initialize with default deductibles for each plan
    const defaults: Record<string, string> = {};
    standardPlans.forEach(plan => {
      defaults[plan.id] = plan.defaultDeductible;
    });
    return defaults;
  });
  const [selectedCovers, setSelectedCovers] = useState<string[]>([]);
  const [optionalBenefits, setOptionalBenefits] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["coverage", "deductible", "inpatient", "optional"]);
  // State for vertical card view
  const [cardSelectedPlans, setCardSelectedPlans] = useState<string[]>([]);
  const [cardSelectedRegions, setCardSelectedRegions] = useState<Record<string, string>>({});
  const [cardExtraCovers, setCardExtraCovers] = useState<Record<string, string[]>>({});
  const [cardDeductibles, setCardDeductibles] = useState<Record<string, string>>({});

  // Calculate premium based on deductible selection
  const calculatePremium = (planId: string) => {
    const plan = standardPlans.find(p => p.id === planId);
    if (!plan) return 0;
    const deductible = selectedDeductibles[planId] || plan.defaultDeductible;
    const option = deductibleOptions.find(d => d.value === deductible);
    const multiplier = option?.multiplier || 1.0;
    return Math.round(plan.basePremium * multiplier);
  };

  const handlePlanToggle = (planId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlans((prev) => [...prev, planId]);
      // Set default geo coverage for the plan
      const plan = standardPlans.find(p => p.id === planId);
      if (plan && plan.geoOptions.length > 0) {
        setGeographicalCoverage((prev) => ({ ...prev, [planId]: plan.geoOptions[0].value }));
      }
    } else {
      setSelectedPlans((prev) => prev.filter((id) => id !== planId));
      setGeographicalCoverage((prev) => {
        const newCoverage = { ...prev };
        delete newCoverage[planId];
        return newCoverage;
      });
    }
  };

  const handleCoverToggle = (coverId: string, checked: boolean) => {
    if (checked) {
      setSelectedCovers((prev) => [...prev, coverId]);
    } else {
      setSelectedCovers((prev) => prev.filter((id) => id !== coverId));
    }
  };

  const handleOptionalToggle = (benefit: string, checked: boolean) => {
    if (checked) {
      setOptionalBenefits((prev) => [...prev, benefit]);
    } else {
      setOptionalBenefits((prev) => prev.filter((b) => b !== benefit));
    }
  };

  const handleDeductibleChange = (planId: string, deductible: string) => {
    setSelectedDeductibles((prev) => ({ ...prev, [planId]: deductible }));
  };

  const handleCardDeductibleChange = (planId: string, deductible: string) => {
    setCardDeductibles((prev) => ({ ...prev, [planId]: deductible }));
  };

  // Handlers for vertical card view
  const handleCardPlanToggle = (planId: string, checked: boolean) => {
    if (checked) {
      setCardSelectedPlans((prev) => [...prev, planId]);
    } else {
      setCardSelectedPlans((prev) => prev.filter((id) => id !== planId));
    }
  };

  const handleCardRegionChange = (planId: string, region: string) => {
    setCardSelectedRegions((prev) => ({ ...prev, [planId]: region }));
  };

  const handleCardExtraCoverToggle = (planId: string, coverId: string, checked: boolean) => {
    setCardExtraCovers((prev) => {
      const current = prev[planId] || [];
      if (checked) {
        return { ...prev, [planId]: [...current, coverId] };
      } else {
        return { ...prev, [planId]: current.filter((id) => id !== coverId) };
      }
    });
  };

  const handleContinue = () => {
    onContinue({
      planType,
      selectedPlans: planType === "standard" ? selectedPlans : undefined,
      geographicalCoverage: planType === "standard" ? geographicalCoverage : undefined,
      customizedCovers: planType === "customized" ? selectedCovers : undefined,
      optionalBenefits,
    });
  };

  const renderCollapsibleHeader = (title: string, subtitle?: string) => (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-800">{title}</span>
      {subtitle && <span className="font-normal text-gray-500 text-xs">{subtitle}</span>}
    </div>
  );

  const renderTableRows = (data: { label: string; values: string[] }[]) => (
    <>
      {data.map((row, idx) => (
        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
          <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">{row.label}</td>
          {row.values.map((value, i) => (
            <td
              key={i}
              className={`p-3 text-center w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(standardPlans[i].id) ? "bg-red-50" : ""}`}
            >
              {value === "✓" ? (
                <CheckOutlined className="text-green-500" />
              ) : value === "-" ? (
                <span className="text-gray-300">—</span>
              ) : (
                value
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  const renderComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm table-fixed">
        <colgroup>
          <col className="w-[200px] min-w-[200px]" />
          {standardPlans.map((plan) => (
            <col key={plan.id} className="w-[130px] min-w-[130px]" />
          ))}
        </colgroup>
        <thead>
          {/* Merged Group Headers */}
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 bg-gray-50 font-semibold text-gray-700 sticky left-0" rowSpan={2}>
              Coverage Details
            </th>
            <th className="p-3 bg-gray-100 text-center font-bold text-gray-700" colSpan={2}>
              Classic
            </th>
            <th className="p-3 bg-blue-50 text-center font-bold text-blue-700" colSpan={2}>
              Advance
            </th>
            <th className="p-3 bg-purple-50 text-center font-bold text-purple-700" colSpan={1}>
              Premier
            </th>
            <th className="p-3 bg-amber-50 text-center font-bold text-amber-700" colSpan={4}>
              New Plans
            </th>
          </tr>
          {/* Sub Headers */}
          <tr className="border-b border-gray-200">
            {standardPlans.map((plan) => (
              <th key={plan.id} className="p-3 bg-gray-50">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-semibold" style={{ color: plan.color }}>
                    {plan.name}
                  </span>
                  <span className="text-xs text-gray-500">{plan.type}</span>
                </div>
              </th>
            ))}
          </tr>
          {/* Premium Row - Top */}
          <tr className="border-b border-gray-200 bg-[#0a3d62]">
            <td className="p-3 font-semibold text-white sticky left-0 bg-[#0a3d62]">
              Annual Premium
            </td>
            {standardPlans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                <div className="text-white">
                  <span className="text-lg font-bold">${calculatePremium(plan.id).toLocaleString()}</span>
                  <span className="text-xs text-white/70 block">/year</span>
                </div>
              </td>
            ))}
          </tr>
          {/* Add to Quotation Row */}
          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="p-3 font-medium text-gray-600 sticky left-0 bg-gray-50">
              Add to Quotation
            </td>
            {standardPlans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                <Checkbox
                  checked={selectedPlans.includes(plan.id)}
                  onChange={(e) => handlePlanToggle(plan.id, e.target.checked)}
                />
              </td>
            ))}
          </tr>
          {/* Geographical Coverage Row */}
          <tr className="border-b border-gray-200">
            <td className="p-3 bg-gray-50 font-medium text-gray-600 sticky left-0">
              Geographical Coverage
            </td>
            {standardPlans.map((plan) => (
              <td key={plan.id} className="p-2">
                <Select
                  size="small"
                  value={geographicalCoverage[plan.id] || undefined}
                  onChange={(value) =>
                    setGeographicalCoverage((prev) => ({ ...prev, [plan.id]: value }))
                  }
                  options={plan.geoOptions}
                  className="w-full"
                  popupMatchSelectWidth={false}
                  placeholder="Select"
                  disabled={!selectedPlans.includes(plan.id)}
                />
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Collapsible Sections */}
          <tr>
            <td colSpan={10} className="p-0">
              <Collapse
                activeKey={expandedSections}
                onChange={(keys) => setExpandedSections(keys as string[])}
                expandIcon={({ isActive }) => (
                  <DownOutlined className={`transition-transform ${isActive ? "rotate-180" : ""}`} />
                )}
                className="border-0 bg-transparent"
                items={[
                  {
                    key: "coverage",
                    label: renderCollapsibleHeader("Main Coverage"),
                    children: (
                      <table className="w-full border-collapse text-sm table-fixed">
                        <colgroup>
                          <col className="w-[200px] min-w-[200px]" />
                          {standardPlans.map((plan) => (
                            <col key={plan.id} className="w-[130px] min-w-[130px]" />
                          ))}
                        </colgroup>
                        <tbody>{renderTableRows(coverageData)}</tbody>
                      </table>
                    ),
                  },
                  {
                    key: "deductible",
                    label: renderCollapsibleHeader("Deductible and Co-payment"),
                    children: (
                      <table className="w-full border-collapse text-sm table-fixed">
                        <colgroup>
                          <col className="w-[200px] min-w-[200px]" />
                          {standardPlans.map((plan) => (
                            <col key={plan.id} className="w-[130px] min-w-[130px]" />
                          ))}
                        </colgroup>
                        <tbody>
                          {/* Individual Annual Deductible - Dropdown */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">
                              Individual Annual Deductible
                            </td>
                            {standardPlans.map((plan) => (
                              <td
                                key={plan.id}
                                className={`p-2 w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(plan.id) ? "bg-red-50" : ""}`}
                              >
                                <Select
                                  size="small"
                                  value={selectedDeductibles[plan.id] || plan.defaultDeductible}
                                  onChange={(value) => handleDeductibleChange(plan.id, value)}
                                  options={deductibleOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                                  className="w-full"
                                  popupMatchSelectWidth={false}
                                />
                              </td>
                            ))}
                          </tr>
                          {/* Family Annual Deductible - calculated based on individual */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">
                              Family Annual Deductible
                            </td>
                            {standardPlans.map((plan) => {
                              const individualDeductible = parseInt(selectedDeductibles[plan.id] || plan.defaultDeductible);
                              const familyDeductible = individualDeductible * 3;
                              return (
                                <td
                                  key={plan.id}
                                  className={`p-3 text-center w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(plan.id) ? "bg-red-50" : ""}`}
                                >
                                  ${familyDeductible.toLocaleString()}
                                </td>
                              );
                            })}
                          </tr>
                          {/* Policy Co-payment - static values */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">
                              Policy Co-payment
                            </td>
                            {["20%", "20%", "10%", "10%", "0%", "30%", "25%", "20%", "10%"].map((value, i) => (
                              <td
                                key={i}
                                className={`p-3 text-center w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(standardPlans[i].id) ? "bg-red-50" : ""}`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    ),
                  },
                  {
                    key: "inpatient",
                    label: renderCollapsibleHeader("Inpatient and Day-care Treatment", "(Pre-authorization required)"),
                    children: (
                      <table className="w-full border-collapse text-sm table-fixed">
                        <colgroup>
                          <col className="w-[200px] min-w-[200px]" />
                          {standardPlans.map((plan) => (
                            <col key={plan.id} className="w-[130px] min-w-[130px]" />
                          ))}
                        </colgroup>
                        <tbody>{renderTableRows(inpatientData)}</tbody>
                      </table>
                    ),
                  },
                  {
                    key: "optional",
                    label: renderCollapsibleHeader("Optional Benefits"),
                    children: (
                      <table className="w-full border-collapse text-sm table-fixed">
                        <colgroup>
                          <col className="w-[200px] min-w-[200px]" />
                          {standardPlans.map((plan) => (
                            <col key={plan.id} className="w-[130px] min-w-[130px]" />
                          ))}
                        </colgroup>
                        <tbody>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">
                              <div className="flex items-center gap-3">
                                <Switch
                                  size="small"
                                  checked={optionalBenefits.includes("maternity")}
                                  onChange={(checked) => handleOptionalToggle("maternity", checked)}
                                />
                                <span>Maternity Benefits</span>
                              </div>
                            </td>
                            {standardPlans.map((plan, i) => (
                              <td
                                key={i}
                                className={`p-3 text-center text-gray-500 w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(plan.id) ? "bg-red-50" : ""}`}
                              >
                                {optionalBenefits.includes("maternity") ? "Included" : "Optional"}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700 sticky left-0 bg-white w-[200px] min-w-[200px] max-w-[200px]">
                              <div className="flex items-center gap-3">
                                <Switch
                                  size="small"
                                  checked={optionalBenefits.includes("dental")}
                                  onChange={(checked) => handleOptionalToggle("dental", checked)}
                                />
                                <span>Dental Benefits</span>
                              </div>
                            </td>
                            {standardPlans.map((plan, i) => (
                              <td
                                key={i}
                                className={`p-3 text-center text-gray-500 w-[130px] min-w-[130px] max-w-[130px] ${selectedPlans.includes(plan.id) ? "bg-red-50" : ""}`}
                              >
                                {optionalBenefits.includes("dental") ? "Included" : "Optional"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    ),
                  },
                ]}
              />
            </td>
          </tr>
          {/* Premium Row - Bottom */}
          <tr className="bg-[#0a3d62]">
            <td className="p-3 font-semibold text-white sticky left-0 bg-[#0a3d62]">
              Annual Premium
            </td>
            {standardPlans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                <div className="text-white">
                  <span className="text-lg font-bold">${calculatePremium(plan.id).toLocaleString()}</span>
                  <span className="text-xs text-white/70 block">/year</span>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderCustomizedOptions = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">
        Select the coverage options you need. You can customize your plan by toggling the covers below.
      </p>

      {customizedCovers.map((cover) => (
        <div
          key={cover.id}
          className={`p-5 rounded-xl border-2 transition-all ${
            selectedCovers.includes(cover.id)
              ? "border-[#c8102e] bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedCovers.includes(cover.id) ? "bg-[#c8102e]" : "bg-gray-100"
                }`}
              >
                <SafetyCertificateOutlined
                  className={`text-xl ${selectedCovers.includes(cover.id) ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">{cover.labelKh}</p>
                <h3 className="font-semibold text-gray-900">{cover.label}</h3>
                <p className="text-sm text-gray-500">{cover.description}</p>
              </div>
            </div>
            <Switch
              checked={selectedCovers.includes(cover.id)}
              onChange={(checked) => handleCoverToggle(cover.id, checked)}
            />
          </div>
        </div>
      ))}

      {/* Optional Benefits for Customized */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Benefits</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">Maternity Benefits</h4>
              <p className="text-sm text-gray-500">Pregnancy, childbirth, and postnatal care coverage</p>
            </div>
            <Switch
              checked={optionalBenefits.includes("maternity")}
              onChange={(checked) => handleOptionalToggle("maternity", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">Dental Benefits</h4>
              <p className="text-sm text-gray-500">Dental treatments, cleanings, and procedures</p>
            </div>
            <Switch
              checked={optionalBenefits.includes("dental")}
              onChange={(checked) => handleOptionalToggle("dental", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">ជ្រើសរើសផែនការរបស់អ្នក</p>
        <h1 className="text-3xl font-bold text-[#0a3d62] mb-3">Choose a plan</h1>
        <p className="text-gray-600">
          Select a standard plan or customize your coverage based on your needs.
        </p>
      </div>

      {/* Plan Type Selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <SafetyCertificateOutlined className="text-[#c8102e] text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ប្រភេទផែនការ</p>
              <h2 className="text-xl font-semibold text-gray-900">Select Plan Type</h2>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setPlanType("standard")}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                planType === "standard"
                  ? "border-[#c8102e] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    planType === "standard" ? "border-[#c8102e]" : "border-gray-300"
                  }`}
                >
                  {planType === "standard" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c8102e]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Standard Plans</h3>
                  <p className="text-sm text-gray-500">Compare and choose from our pre-configured plans</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPlanType("customized")}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                planType === "customized"
                  ? "border-[#c8102e] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    planType === "customized" ? "border-[#c8102e]" : "border-gray-300"
                  }`}
                >
                  {planType === "customized" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c8102e]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Customized Plan</h3>
                  <p className="text-sm text-gray-500">Build your own plan with specific coverage options</p>
                </div>
              </div>
            </button>
          </div>

          {/* View Toggle for Standard Plans */}
          {planType === "standard" && (
            <div className="flex items-center justify-end gap-2 mb-6">
              <span className="text-sm text-gray-500">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TableOutlined />
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "cards"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <AppstoreOutlined />
                  Cards
                </button>
              </div>
            </div>
          )}

          {/* Plan Content */}
          {planType === "standard" ? (
            viewMode === "table" ? (
              renderComparisonTable()
            ) : (
              <VerticalPlanCards
                selectedPlans={cardSelectedPlans}
                onPlanToggle={handleCardPlanToggle}
                selectedRegions={cardSelectedRegions}
                onRegionChange={handleCardRegionChange}
                extraCoversState={cardExtraCovers}
                onExtraCoverToggle={handleCardExtraCoverToggle}
                selectedDeductibles={cardDeductibles}
                onDeductibleChange={handleCardDeductibleChange}
              />
            )
          ) : (
            renderCustomizedOptions()
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <span>←</span>
          Back
        </button>
        <div className="text-sm text-gray-500">Step 3 of 4</div>
        <button
          onClick={handleContinue}
          className="bg-[#c8102e] hover:bg-[#a00d25] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          Continue
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
