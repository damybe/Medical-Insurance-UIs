"use client";

import React, { useState } from "react";
import { TeamOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddDependentModal, { Dependent } from "./AddDependentModal";

interface DependentsFormProps {
  policyholderName: string;
  onContinue: (dependents: Dependent[]) => void;
  onBack: () => void;
}

export default function DependentsForm({
  policyholderName,
  onContinue,
  onBack,
}: DependentsFormProps) {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);

  const handleAddDependent = (dependent: Dependent) => {
    if (editingDependent) {
      setDependents((prev) =>
        prev.map((d) => (d.id === dependent.id ? dependent : d))
      );
    } else {
      setDependents((prev) => [...prev, dependent]);
    }
    setIsModalOpen(false);
    setEditingDependent(null);
  };

  const handleEdit = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDependents((prev) => prev.filter((d) => d.id !== id));
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case "spouse":
        return { bg: "bg-[#c8102e]", text: "text-white", badge: "bg-[#c8102e]" };
      case "child":
        return { bg: "bg-emerald-500", text: "text-white", badge: "bg-emerald-500" };
      case "parent":
        return { bg: "bg-blue-500", text: "text-white", badge: "bg-blue-500" };
      default:
        return { bg: "bg-gray-500", text: "text-white", badge: "bg-gray-500" };
    }
  };

  const getInitials = (familyName: string, givenName: string) => {
    return `${familyName.charAt(0)}${givenName.charAt(0)}`.toUpperCase();
  };

  const totalPeopleCovered = dependents.length + 1; // +1 for policyholder
  const coveredNames = [
    policyholderName.split(" ").pop() || policyholderName,
    ...dependents.map((d) => d.familyName),
  ].join(" · ");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">សមាជិកគ្រួសារដែលត្រូវការបញ្ចូល</p>
        <h1 className="text-3xl font-bold text-[#0a3d62] mb-3">Who else needs cover?</h1>
        <p className="text-gray-600">
          Add your spouse, children or parents to extend coverage. You can skip this if you only need
          cover for yourself, {policyholderName.split(" ").pop()}.
        </p>
      </div>

      {/* Dependents Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <TeamOutlined className="text-[#c8102e] text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">សមាជិកគ្រួសារដែលត្រូវបញ្ចូលក្នុងផែនការរបស់អ្នក</p>
              <h2 className="text-xl font-semibold text-gray-900">Dependents to be included</h2>
              <p className="text-gray-500 text-sm">
                Up to 8 dependents. Premium adjusts automatically as you add people.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingDependent(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00d25] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusOutlined />
            Add dependent
          </button>
        </div>

        {/* Dependents List */}
        {dependents.length > 0 && (
          <div className="border-t border-gray-100">
            {dependents.map((dependent) => {
              const colors = getRelationshipColor(dependent.relationship);
              return (
                <div
                  key={dependent.id}
                  className="px-6 py-4 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-semibold text-sm`}
                    >
                      {getInitials(dependent.familyName, dependent.givenName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {dependent.title} {dependent.familyName} {dependent.givenName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {dayjs(dependent.dateOfBirth).format("DD/MMM/YYYY")} ·{" "}
                        {dependent.ageAtNextBirthday} yrs next birthday · {dependent.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`${colors.badge} text-white text-xs px-3 py-1 rounded-full uppercase font-medium`}
                    >
                      {dependent.relationship}
                    </span>
                    <button
                      onClick={() => handleEdit(dependent)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => handleDelete(dependent.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Footer */}
        {dependents.length > 0 && (
          <div className="bg-[#0a3d62] px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">{totalPeopleCovered}</span>
              <div>
                <p className="text-white font-medium">
                  {totalPeopleCovered} {totalPeopleCovered === 1 ? "person" : "people"} covered
                </p>
                <p className="text-white/70 text-sm">{coveredNames}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {dependents.length === 0 && (
          <div className="px-6 pb-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                No dependents added yet. Click &quot;Add dependent&quot; to include family members in your
                coverage.
              </p>
            </div>
          </div>
        )}
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
        <div className="text-sm text-gray-500">Step 2 of 4</div>
        <button
          onClick={() => onContinue(dependents)}
          className="bg-[#c8102e] hover:bg-[#a00d25] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          Continue
          <span>→</span>
        </button>
      </div>

      {/* Add/Edit Dependent Modal */}
      <AddDependentModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDependent(null);
        }}
        onAdd={handleAddDependent}
        editingDependent={editingDependent}
      />
    </div>
  );
}
