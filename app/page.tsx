"use client";

import React, { useState } from "react";
import { ConfigProvider } from "antd";
import Header from "@/components/quote/Header";
import StepIndicator from "@/components/quote/StepIndicator";
import PolicyholderForm from "@/components/quote/PolicyholderForm";
import DependentsForm from "@/components/quote/DependentsForm";
import SelectPlanForm, { PlanData } from "@/components/quote/SelectPlanForm";
import QuotationList from "@/components/quote/QuotationList";
import Sidebar from "@/components/quote/Sidebar";
import { Dependent } from "@/components/quote/AddDependentModal";
import { Dayjs } from "dayjs";

interface PolicyholderData {
  title: string;
  familyName: string;
  givenName: string;
  dateOfBirth: Dayjs | null;
  gender: string;
}

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [policyholderData, setPolicyholderData] = useState<PolicyholderData | null>(null);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("create-quotation");

  const handlePolicyholderContinue = (values: PolicyholderData) => {
    setPolicyholderData(values);
    setCurrentStep(2);
  };

  const handleDependentsContinue = (deps: Dependent[]) => {
    setDependents(deps);
    setCurrentStep(3);
  };

  const handlePlanContinue = (plan: PlanData) => {
    setPlanData(plan);
    setCurrentStep(4);
  };

  const getPolicyholderName = () => {
    if (policyholderData) {
      return `${policyholderData.title} ${policyholderData.givenName} ${policyholderData.familyName}`;
    }
    return "";
  };

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "create-quotation") {
      // Reset to step 1 when creating a new quotation
      setCurrentStep(1);
      setPolicyholderData(null);
      setDependents([]);
      setPlanData(null);
    }
  };

  const handleCreateNewFromList = () => {
    setActiveMenu("create-quotation");
    setCurrentStep(1);
    setPolicyholderData(null);
    setDependents([]);
    setPlanData(null);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c8102e",
          borderRadius: 8,
          fontFamily: "inherit",
        },
        components: {
          Select: {
            controlHeight: 44,
          },
          Input: {
            controlHeight: 44,
          },
          DatePicker: {
            controlHeight: 44,
          },
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu={activeMenu}
          onMenuChange={handleMenuChange}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          
          {activeMenu === "create-quotation" ? (
            <>
              <StepIndicator
                currentStep={currentStep}
                policyholderName={getPolicyholderName()}
                dependentsCount={dependents.length}
              />

              {currentStep === 1 && (
                <PolicyholderForm onContinue={handlePolicyholderContinue} />
              )}

              {currentStep === 2 && (
                <DependentsForm
                  policyholderName={getPolicyholderName()}
                  onContinue={handleDependentsContinue}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <SelectPlanForm
                  onContinue={handlePlanContinue}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <h1 className="text-3xl font-bold text-[#0a3d62]">Review & Quote</h1>
                  <p className="text-gray-600 mt-2">Step 4 - Coming soon</p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="mt-4 border border-gray-300 px-6 py-2 rounded-lg"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </>
          ) : (
            <QuotationList onCreateNew={handleCreateNewFromList} />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
