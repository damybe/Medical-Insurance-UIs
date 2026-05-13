"use client";

import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import {
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { PlanData } from "./SelectPlanForm";
import { Dependent } from "./AddDependentModal";
import { Dayjs } from "dayjs";

interface PolicyholderData {
  title: string;
  familyName: string;
  givenName: string;
  dateOfBirth: Dayjs | null;
  gender: string;
}

interface QuotationReviewProps {
  policyholderData: PolicyholderData | null;
  dependents: Dependent[];
  planData: PlanData | null;
  onBack: () => void;
}

// Plan definitions (same as in SelectPlanForm for reference)
const standardPlans = [
  { id: "classic-ip", name: "Classic", type: "IP Only", color: "#6b7280", basePremium: 450 },
  { id: "classic-ipop", name: "Classic", type: "IP & OP", color: "#6b7280", basePremium: 680 },
  { id: "advance-ip", name: "Advance", type: "IP Only", color: "#3b82f6", basePremium: 750 },
  { id: "advance-ipop", name: "Advance", type: "IP & OP", color: "#3b82f6", basePremium: 1100 },
  { id: "premier-ipop", name: "Premier", type: "IP & OP", color: "#8b5cf6", basePremium: 1850 },
  { id: "bronze-ip", name: "Bronze", type: "IP Only", color: "#cd7f32", basePremium: 320 },
  { id: "silver-ip", name: "Silver", type: "IP Only", color: "#9ca3af", basePremium: 520 },
  { id: "gold-ip", name: "Gold", type: "IP Only", color: "#f59e0b", basePremium: 890 },
  { id: "platinum-ip", name: "Platinum", type: "IP Only", color: "#6366f1", basePremium: 1450 },
];

const geoLabels: Record<string, string> = {
  sea: "South East Asia",
  "asia-pacific-plus": "Asia Pacific+",
  "international-plus": "International+",
  worldwide: "Worldwide",
  regional: "Regional",
  "asia-pacific": "Asia Pacific",
  "sea-ex-sg": "SEA excl. Singapore",
  "asia-europe-ex": "Asia & Europe excl. SG, HK, UK, CH",
  "worldwide-ex-usa-canada": "Worldwide excl. USA & Canada",
};

export default function QuotationReview({
  policyholderData,
  dependents,
  planData,
  onBack,
}: QuotationReviewProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const quotationNumber = `QT-${Date.now().toString().slice(-8)}`;
  const quotationDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getPolicyholderName = () => {
    if (policyholderData) {
      return `${policyholderData.title} ${policyholderData.givenName} ${policyholderData.familyName}`;
    }
    return "N/A";
  };

  const getSelectedPlansDetails = () => {
    if (!planData?.selectedPlans) return [];
    return planData.selectedPlans.map((planId) => {
      const plan = standardPlans.find((p) => p.id === planId);
      const geo = planData.geographicalCoverage?.[planId];
      return {
        ...plan,
        geoCoverage: geo ? geoLabels[geo] || geo : "N/A",
      };
    });
  };

  const calculateTotalPremium = () => {
    const selectedPlansDetails = getSelectedPlansDetails();
    const planTotal = selectedPlansDetails.reduce((sum, plan) => sum + (plan?.basePremium || 0), 0);
    const membersCount = 1 + dependents.length;
    return planTotal * membersCount;
  };

  const handleDownload = () => {
    // Create a simple text-based quotation for download
    const quotationContent = generateQuotationText();
    const blob = new Blob([quotationContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quotation-${quotationNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("Quotation downloaded successfully!");
  };

  const generateQuotationText = () => {
    const selectedPlansDetails = getSelectedPlansDetails();
    const totalPremium = calculateTotalPremium();

    let content = `
================================================================================
                         MEDICAL INSURANCE QUOTATION
================================================================================

Quotation Number: ${quotationNumber}
Date: ${quotationDate}
Valid Until: ${validUntil}

--------------------------------------------------------------------------------
                            POLICYHOLDER DETAILS
--------------------------------------------------------------------------------
Name: ${getPolicyholderName()}
Date of Birth: ${policyholderData?.dateOfBirth?.format("DD/MM/YYYY") || "N/A"}
Gender: ${policyholderData?.gender || "N/A"}

--------------------------------------------------------------------------------
                              DEPENDENTS (${dependents.length})
--------------------------------------------------------------------------------
`;

    if (dependents.length > 0) {
      dependents.forEach((dep, index) => {
        content += `${index + 1}. ${dep.title} ${dep.givenName} ${dep.familyName} - ${dep.relationship}\n`;
      });
    } else {
      content += "No dependents added.\n";
    }

    content += `
--------------------------------------------------------------------------------
                              SELECTED PLANS
--------------------------------------------------------------------------------
`;

    selectedPlansDetails.forEach((plan) => {
      content += `
Plan: ${plan?.name} (${plan?.type})
Geographical Coverage: ${plan?.geoCoverage}
Annual Premium: $${plan?.basePremium?.toLocaleString()}/person
`;
    });

    content += `
--------------------------------------------------------------------------------
                              PREMIUM SUMMARY
--------------------------------------------------------------------------------
Number of Insured Members: ${1 + dependents.length}
Total Annual Premium: $${totalPremium.toLocaleString()}

--------------------------------------------------------------------------------
                              TERMS & CONDITIONS
--------------------------------------------------------------------------------
- This quotation is valid for 30 days from the date of issue.
- Premiums are subject to change based on underwriting assessment.
- Coverage is subject to policy terms and conditions.
- Waiting periods may apply for certain conditions.

================================================================================
         Thank you for choosing our Medical Insurance services.
================================================================================
`;

    return content;
  };

  const handleSendEmail = async () => {
    if (!email || !email.includes("@")) {
      message.error("Please enter a valid email address");
      return;
    }

    setSendingEmail(true);
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSendingEmail(false);
    setEmailModalOpen(false);
    setEmail("");
    message.success(`Quotation sent successfully to ${email}!`);
  };

  const selectedPlansDetails = getSelectedPlansDetails();
  const totalPremium = calculateTotalPremium();

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Quotation Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#0a3d62] text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-1">Medical Insurance Quotation</h1>
                <p className="text-white/80 text-sm">Review your selected plans and coverage</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Quotation Number</p>
                <p className="text-xl font-bold">{quotationNumber}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Issue Date:</span>{" "}
              <span className="font-medium text-gray-800">{quotationDate}</span>
            </div>
            <div>
              <span className="text-gray-500">Valid Until:</span>{" "}
              <span className="font-medium text-[#c8102e]">{validUntil}</span>
            </div>
          </div>

          {/* Policyholder Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0a3d62]/10 flex items-center justify-center">
                <UserOutlined className="text-[#0a3d62] text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Policyholder</h2>
                <p className="text-sm text-gray-500">Primary insured member</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 ml-13">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-gray-800">{getPolicyholderName()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium text-gray-800">
                  {policyholderData?.dateOfBirth?.format("DD/MM/YYYY") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Gender</p>
                <p className="font-medium text-gray-800 capitalize">{policyholderData?.gender || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Dependents Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0a3d62]/10 flex items-center justify-center">
                <TeamOutlined className="text-[#0a3d62] text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Dependents</h2>
                <p className="text-sm text-gray-500">{dependents.length} member(s) added</p>
              </div>
            </div>
            {dependents.length > 0 ? (
              <div className="ml-13 space-y-3">
                {dependents.map((dep, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {dep.title} {dep.givenName} {dep.familyName}
                      </p>
                      <p className="text-sm text-gray-500">{dep.relationship}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {dep.dateOfBirth?.format("DD/MM/YYYY") || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ml-13 text-gray-500 text-sm">No dependents added to this quotation.</p>
            )}
          </div>

          {/* Selected Plans Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0a3d62]/10 flex items-center justify-center">
                <SafetyCertificateOutlined className="text-[#0a3d62] text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Selected Plans</h2>
                <p className="text-sm text-gray-500">{selectedPlansDetails.length} plan(s) selected</p>
              </div>
            </div>
            {selectedPlansDetails.length > 0 ? (
              <div className="ml-13 space-y-4">
                {selectedPlansDetails.map((plan, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: plan?.color || "#6b7280" }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {plan?.name} - {plan?.type}
                          </h3>
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <GlobalOutlined className="text-xs" />
                            <span>{plan?.geoCoverage}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#0a3d62]">
                          ${plan?.basePremium?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">/person/year</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ml-13 text-gray-500 text-sm">No plans selected.</p>
            )}
          </div>

          {/* Premium Summary */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#0a3d62] to-[#0a3d62]/90 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Total Annual Premium</p>
                <p className="text-xs text-white/60 mt-1">
                  For {1 + dependents.length} insured member(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${totalPremium.toLocaleString()}</p>
                <p className="text-white/60 text-sm">/year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Back to Plans</span>
          </button>

          <div className="flex gap-3">
            <Button
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="flex items-center gap-2 h-12 px-6 border-[#0a3d62] text-[#0a3d62] hover:bg-[#0a3d62]/5"
            >
              Download Quotation
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<MailOutlined />}
              onClick={() => setEmailModalOpen(true)}
              className="flex items-center gap-2 h-12 px-6 bg-[#c8102e] hover:bg-[#a00d25] border-0"
            >
              Email Quotation
            </Button>
          </div>
        </div>

        {/* Terms Notice */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This quotation is valid for 30 days. Premiums are indicative and
            subject to final underwriting assessment. Coverage details are subject to the full terms
            and conditions of the policy.
          </p>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined className="text-[#0a3d62]" />
            <span>Email Quotation</span>
          </div>
        }
        open={emailModalOpen}
        onCancel={() => setEmailModalOpen(false)}
        footer={null}
        centered
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Enter the customer&apos;s email address to send the quotation.
          </p>
          <Input
            size="large"
            placeholder="customer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<MailOutlined className="text-gray-400" />}
            className="mb-4"
          />
          <div className="flex justify-end gap-3">
            <Button onClick={() => setEmailModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={sendingEmail}
              onClick={handleSendEmail}
              className="bg-[#c8102e] hover:bg-[#a00d25] border-0"
            >
              Send Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
