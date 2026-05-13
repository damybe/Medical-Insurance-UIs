"use client";

import React from "react";
import { CheckOutlined } from "@ant-design/icons";

interface Step {
  number: number;
  titleKh: string;
  titleEn: string;
  subtitle: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepIndicatorProps {
  currentStep: number;
  policyholderName?: string;
  dependentsCount?: number;
}

export default function StepIndicator({
  currentStep,
  policyholderName = "Mr. asdas dsadsa",
  dependentsCount = 2,
}: StepIndicatorProps) {
  const steps: Step[] = [
    {
      number: 1,
      titleKh: "ព័ត៌មានអំពីម្ចាស់បណ្ណា",
      titleEn: "Policyholder",
      subtitle: policyholderName,
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      number: 2,
      titleKh: "សមាជិកគ្រួសារ",
      titleEn: "Dependents",
      subtitle: `${dependentsCount} added`,
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
    {
      number: 3,
      titleKh: "ជ្រើសរើសផែនការ",
      titleEn: "Choose a plan",
      subtitle: "Coverage & price",
      isActive: currentStep === 3,
      isCompleted: currentStep > 3,
    },
    {
      number: 4,
      titleKh: "ពិនិត្យឡើងវិញ",
      titleEn: "Review & quote",
      subtitle: "Confirm details",
      isActive: currentStep === 4,
      isCompleted: currentStep > 4,
    },
  ];

  return (
    <div className="flex items-center justify-center py-6 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.isActive
                    ? "bg-[#c8102e] text-white"
                    : step.isCompleted
                    ? "bg-[#c8102e] text-white"
                    : "bg-gray-100 text-gray-500 border border-gray-300"
                }`}
              >
                {step.isCompleted ? <CheckOutlined /> : step.number}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">{step.titleKh}</span>
                <span
                  className={`text-sm font-semibold ${
                    step.isActive ? "text-[#c8102e]" : "text-gray-800"
                  }`}
                >
                  {step.titleEn}
                </span>
                <span className="text-xs text-gray-500">{step.subtitle}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-px bg-gray-300 mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
