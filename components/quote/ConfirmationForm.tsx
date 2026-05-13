"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Upload,
  Collapse,
  Modal,
  Button,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { Dependent } from "./AddDependentModal";
import { PlanData } from "./SelectPlanForm";

const { TextArea } = Input;
const { Panel } = Collapse;

interface PolicyholderData {
  title: string;
  familyName: string;
  givenName: string;
  dateOfBirth: Dayjs | null;
  gender: string;
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
}

interface ConfirmationFormProps {
  policyholderData: PolicyholderData | null;
  dependents: Dependent[];
  planData: PlanData | null;
  onBack: () => void;
  onSubmit: () => void;
}

const countryOptions = [
  { value: "Cambodia", label: "Cambodia" },
  { value: "Thailand", label: "Thailand" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Singapore", label: "Singapore" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Philippines", label: "Philippines" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Australia", label: "Australia" },
  { value: "China", label: "China" },
  { value: "Japan", label: "Japan" },
  { value: "South Korea", label: "South Korea" },
  { value: "India", label: "India" },
];

// Cambodia Address Data - Hierarchical structure
const cambodiaAddressData: Record<string, Record<string, Record<string, string[]>>> = {
  "Phnom Penh": {
    "Chamkarmon": {
      "Tonle Bassac": ["Phum 1", "Phum 2", "Phum 3"],
      "Boeung Keng Kang I": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Boeung Keng Kang II": ["Phum 1", "Phum 2"],
      "Boeung Keng Kang III": ["Phum 1", "Phum 2", "Phum 3"],
      "Olympic": ["Phum 1", "Phum 2", "Phum 3"],
      "Toul Svay Prey I": ["Phum 1", "Phum 2", "Phum 3"],
      "Toul Svay Prey II": ["Phum 1", "Phum 2"],
    },
    "Daun Penh": {
      "Phsar Thmei I": ["Phum 1", "Phum 2", "Phum 3"],
      "Phsar Thmei II": ["Phum 1", "Phum 2"],
      "Phsar Thmei III": ["Phum 1", "Phum 2", "Phum 3"],
      "Wat Phnom": ["Phum 1", "Phum 2"],
      "Srah Chak": ["Phum 1", "Phum 2", "Phum 3"],
      "Phsar Kandal I": ["Phum 1", "Phum 2"],
      "Phsar Kandal II": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "7 Makara": {
      "Veal Vong": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Mittapheap": ["Phum 1", "Phum 2", "Phum 3"],
      "Monourom": ["Phum 1", "Phum 2"],
      "Ou Ruessei I": ["Phum 1", "Phum 2", "Phum 3"],
      "Ou Ruessei II": ["Phum 1", "Phum 2"],
      "Ou Ruessei III": ["Phum 1", "Phum 2", "Phum 3"],
      "Ou Ruessei IV": ["Phum 1", "Phum 2"],
    },
    "Toul Kork": {
      "Boeung Kak I": ["Phum 1", "Phum 2", "Phum 3"],
      "Boeung Kak II": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Phsar Depou I": ["Phum 1", "Phum 2"],
      "Phsar Depou II": ["Phum 1", "Phum 2", "Phum 3"],
      "Phsar Depou III": ["Phum 1", "Phum 2"],
      "Toul Sangke": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "Mean Chey": {
      "Chak Angre Krom": ["Phum 1", "Phum 2", "Phum 3"],
      "Chak Angre Leu": ["Phum 1", "Phum 2"],
      "Stueng Meanchey": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Boeung Tompun": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "Sen Sok": {
      "Khmuonh": ["Phum 1", "Phum 2", "Phum 3"],
      "Phnom Penh Thmey": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Teuk Thla": ["Phum 1", "Phum 2", "Phum 3"],
      "Krang Thnong": ["Phum 1", "Phum 2"],
    },
    "Russey Keo": {
      "Tuol Sangke": ["Phum 1", "Phum 2", "Phum 3"],
      "Kilomet Lekh Prammuoy": ["Phum 1", "Phum 2"],
      "Russey Keo": ["Phum 1", "Phum 2", "Phum 3"],
      "Svay Pak": ["Phum 1", "Phum 2"],
    },
  },
  "Siem Reap": {
    "Siem Reap": {
      "Svay Dangkum": ["Phum Wat Bo", "Phum Taphul", "Phum Sala Kamraeuk"],
      "Sala Kamraeuk": ["Phum 1", "Phum 2", "Phum 3"],
      "Sla Kram": ["Phum 1", "Phum 2"],
      "Kouk Chak": ["Phum 1", "Phum 2", "Phum 3"],
      "Chreav": ["Phum 1", "Phum 2"],
    },
    "Angkor Chum": {
      "Char Chhuk": ["Phum 1", "Phum 2"],
      "Doun Peng": ["Phum 1", "Phum 2", "Phum 3"],
      "Kouk Doung": ["Phum 1", "Phum 2"],
    },
    "Puok": {
      "Lvea": ["Phum 1", "Phum 2", "Phum 3"],
      "Puok": ["Phum 1", "Phum 2"],
      "Prey Chruk": ["Phum 1", "Phum 2", "Phum 3"],
    },
  },
  "Battambang": {
    "Battambang": {
      "Svay Por": ["Phum 1", "Phum 2", "Phum 3"],
      "Preaek Preah Sdach": ["Phum 1", "Phum 2"],
      "Kampong Krabei": ["Phum 1", "Phum 2", "Phum 3"],
      "Ou Mal": ["Phum 1", "Phum 2"],
      "Rotanak": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
    },
    "Sangkae": {
      "Anlong Vil": ["Phum 1", "Phum 2"],
      "Norea": ["Phum 1", "Phum 2", "Phum 3"],
      "Reang Kesei": ["Phum 1", "Phum 2"],
    },
    "Banan": {
      "Bay Damram": ["Phum 1", "Phum 2"],
      "Chheu Teal": ["Phum 1", "Phum 2", "Phum 3"],
      "Kantueu Muoy": ["Phum 1", "Phum 2"],
    },
  },
  "Kandal": {
    "Ta Khmau": {
      "Ta Khmau": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
      "Preaek Russei": ["Phum 1", "Phum 2"],
      "Kampong Samnanh": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "Kien Svay": {
      "Koki": ["Phum 1", "Phum 2", "Phum 3"],
      "Preaek Aeng": ["Phum 1", "Phum 2"],
      "Preaek Kdam": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "Ang Snuol": {
      "Chheu Teal": ["Phum 1", "Phum 2"],
      "Preaek Thmei": ["Phum 1", "Phum 2", "Phum 3"],
      "Roka Khpos": ["Phum 1", "Phum 2"],
    },
  },
  "Kampong Cham": {
    "Kampong Cham": {
      "Veal Vong": ["Phum 1", "Phum 2", "Phum 3"],
      "Boeng Kok": ["Phum 1", "Phum 2"],
      "Kampong Cham": ["Phum 1", "Phum 2", "Phum 3", "Phum 4"],
    },
    "Prey Chhor": {
      "Chrey Vien": ["Phum 1", "Phum 2"],
      "Kor": ["Phum 1", "Phum 2", "Phum 3"],
      "Prey Khla": ["Phum 1", "Phum 2"],
    },
    "Chamkar Leu": {
      "Chamkar Andoung": ["Phum 1", "Phum 2", "Phum 3"],
      "Lvea Leu": ["Phum 1", "Phum 2"],
      "Soutip": ["Phum 1", "Phum 2", "Phum 3"],
    },
  },
  "Sihanoukville": {
    "Mittakpheap": {
      "Sangkat 1": ["Village 1", "Village 2", "Village 3"],
      "Sangkat 2": ["Village 1", "Village 2"],
      "Sangkat 3": ["Village 1", "Village 2", "Village 3"],
      "Sangkat 4": ["Village 1", "Village 2"],
    },
    "Prey Nob": {
      "Prey Nob": ["Phum 1", "Phum 2", "Phum 3"],
      "Ou Oknha Heng": ["Phum 1", "Phum 2"],
      "Ream": ["Phum 1", "Phum 2", "Phum 3"],
    },
    "Stung Hav": {
      "Stung Hav": ["Phum 1", "Phum 2"],
      "Ou Treh": ["Phum 1", "Phum 2", "Phum 3"],
    },
  },
};

const cityOptions = Object.keys(cambodiaAddressData).map(city => ({
  value: city,
  label: city,
}));

const nationalityOptions = [
  { value: "Cambodian", label: "Cambodian" },
  { value: "Thai", label: "Thai" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Malaysian", label: "Malaysian" },
  { value: "Singaporean", label: "Singaporean" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Filipino", label: "Filipino" },
  { value: "American", label: "American" },
  { value: "British", label: "British" },
  { value: "Australian", label: "Australian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Indian", label: "Indian" },
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

const occupationOptions = [
  { value: "Employed", label: "Employed" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Business Owner", label: "Business Owner" },
  { value: "Government Employee", label: "Government Employee" },
  { value: "Student", label: "Student" },
  { value: "Retired", label: "Retired" },
  { value: "Homemaker", label: "Homemaker" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Other", label: "Other" },
];

const relationshipOptions = [
  { value: "Spouse", label: "Spouse" },
  { value: "Parent", label: "Parent" },
  { value: "Sibling", label: "Sibling" },
  { value: "Child", label: "Child" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

const medicalQuestions = [
  {
    id: "hospital_admission",
    question: "Been admitted to a hospital / other medical facility or had surgery",
  },
  {
    id: "disability_costs",
    question: "Been disabled and / or incurred medical costs exceeding USD$6,500",
  },
  {
    id: "checkup_abnormality",
    question: "Been told that there was any abnormity during checkup",
  },
  {
    id: "respiratory",
    question: "Had any health problems related to: Chronic cough, expectoration, hemoptysis, asthma, difficulty breathing, bronchiectasis, pneumothorax, emphysema, tuberculosis, pleurisy, chronic bronchitis, or other diseases of the respiratory system?",
  },
  {
    id: "urinary",
    question: "Had any health problems related to: Back pain, frequent urination, urgency of urination, pain in urination, difficulty urinating, blood or protein in the urine, abnormal amount of urine, nocturia, swelling in the face, kidney and urinary tract stone, nephritis, nephropathy, renal cyst, hydronephrosis, or other urinary system problems?",
  },
  {
    id: "digestive",
    question: "Had any health problems related to: Belch, nausea, vomiting, abdominal distention, abdominal pain, constipation, diarrhea, hematemesis, melena, hematochezia, jaundice, difficulty swallowing, ulcer, colitis, stomach problems, hernia, rectal problems, HBV Carrier, liver disorders, gall bladder disorder, pancreas problems or other digestive system problems?",
  },
  {
    id: "pregnant",
    question: "Are you currently pregnant? (Not applicable for members below 18 years old)",
  },
  {
    id: "smoking",
    question: "Smoke more than 15 cigarettes per day or use tobacco in any form?",
  },
  {
    id: "weight_change",
    question: "Within the past 5 years, gained or lost more than 12kg (25lbs) in 12 months?",
  },
  {
    id: "other_condition",
    question: "Any other medical condition that has not been disclosed above?",
  },
];

const optionalBenefitLabels: Record<string, string> = {
  maternity: "Maternity Coverage",
  dental: "Dental Coverage",
  vision: "Vision Coverage",
  wellness: "Wellness Program",
  outpatient: "Outpatient Coverage",
  "mental-health": "Mental Health Coverage",
};

export default function ConfirmationForm({
  policyholderData,
  dependents,
  planData,
  onBack,
  onSubmit,
}: ConfirmationFormProps) {
  const [form] = Form.useForm();
  const [sameAsResidential, setSameAsResidential] = useState(true);
  const [hasExistingInsurance, setHasExistingInsurance] = useState<boolean | null>(null);
  const [immediateCommencement, setImmediateCommencement] = useState<boolean | null>(null);
  const [occupationRisk, setOccupationRisk] = useState<boolean | null>(null);
  const [hazardousActivities, setHazardousActivities] = useState<boolean | null>(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [policyWordingAccepted, setPolicyWordingAccepted] = useState(false);
  const [paExclusionsModalOpen, setPaExclusionsModalOpen] = useState(false);
  const [medicalDetailsModalOpen, setMedicalDetailsModalOpen] = useState(false);
  const [currentMedicalQuestion, setCurrentMedicalQuestion] = useState<string | null>(null);
  const [medicalAnswers, setMedicalAnswers] = useState<Record<string, { answer: boolean | null; details: string }>>({});
  const [dependentMedicalAnswers, setDependentMedicalAnswers] = useState<Record<string, Record<string, { answer: boolean | null; details: string }>>>({});
  const [editingDependentIndex, setEditingDependentIndex] = useState<number | null>(null);
  const [dependentModalOpen, setDependentModalOpen] = useState(false);
  const [dependentForm] = Form.useForm();

  // Residential address cascading state
  const [residentialCity, setResidentialCity] = useState<string | null>(null);
  const [residentialDistrict, setResidentialDistrict] = useState<string | null>(null);
  const [residentialCommune, setResidentialCommune] = useState<string | null>(null);

  // Correspondence address cascading state
  const [correspondenceCity, setCorrespondenceCity] = useState<string | null>(null);
  const [correspondenceDistrict, setCorrespondenceDistrict] = useState<string | null>(null);
  const [correspondenceCommune, setCorrespondenceCommune] = useState<string | null>(null);

  // Get district options based on selected city
  const getDistrictOptions = (city: string | null) => {
    if (!city || !cambodiaAddressData[city]) return [];
    return Object.keys(cambodiaAddressData[city]).map(district => ({
      value: district,
      label: district,
    }));
  };

  // Get commune options based on selected city and district
  const getCommuneOptions = (city: string | null, district: string | null) => {
    if (!city || !district || !cambodiaAddressData[city]?.[district]) return [];
    return Object.keys(cambodiaAddressData[city][district]).map(commune => ({
      value: commune,
      label: commune,
    }));
  };

  // Get village options based on selected city, district, and commune
  const getVillageOptions = (city: string | null, district: string | null, commune: string | null) => {
    if (!city || !district || !commune || !cambodiaAddressData[city]?.[district]?.[commune]) return [];
    return cambodiaAddressData[city][district][commune].map(village => ({
      value: village,
      label: village,
    }));
  };

  // Handle city change - reset dependent fields
  const handleCityChange = (value: string, prefix: "residential" | "correspondence") => {
    if (prefix === "residential") {
      setResidentialCity(value);
      setResidentialDistrict(null);
      setResidentialCommune(null);
      form.setFieldsValue({
        residentialDistrict: undefined,
        residentialCommune: undefined,
        residentialVillage: undefined,
      });
    } else {
      setCorrespondenceCity(value);
      setCorrespondenceDistrict(null);
      setCorrespondenceCommune(null);
      form.setFieldsValue({
        correspondenceDistrict: undefined,
        correspondenceCommune: undefined,
        correspondenceVillage: undefined,
      });
    }
    handleAddressFieldChange(prefix);
  };

  // Handle district change - reset dependent fields
  const handleDistrictChange = (value: string, prefix: "residential" | "correspondence") => {
    if (prefix === "residential") {
      setResidentialDistrict(value);
      setResidentialCommune(null);
      form.setFieldsValue({
        residentialCommune: undefined,
        residentialVillage: undefined,
      });
    } else {
      setCorrespondenceDistrict(value);
      setCorrespondenceCommune(null);
      form.setFieldsValue({
        correspondenceCommune: undefined,
        correspondenceVillage: undefined,
      });
    }
    handleAddressFieldChange(prefix);
  };

  // Handle commune change - reset village
  const handleCommuneChange = (value: string, prefix: "residential" | "correspondence") => {
    if (prefix === "residential") {
      setResidentialCommune(value);
      form.setFieldsValue({ residentialVillage: undefined });
    } else {
      setCorrespondenceCommune(value);
      form.setFieldsValue({ correspondenceVillage: undefined });
    }
    handleAddressFieldChange(prefix);
  };

  // Auto-generate full address
  const generateFullAddress = (prefix: string) => {
    const values = form.getFieldsValue();
    const streetNo = values[`${prefix}StreetNo`];
    const  = values[`${prefix}StreetNo`];
    const parts = [
      values[`${prefix}HouseNo`],
      streetNo ? `ST. ${streetNo}` : null,
      values[`${prefix}Village`],
      values[`${prefix}Commune`],
      values[`${prefix}District`],
      values[`${prefix}City`],
      values[`${prefix}Country`],
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleAddressFieldChange = (prefix: string) => {
    const fullAddress = generateFullAddress(prefix);
    form.setFieldValue(`${prefix}FullAddress`, fullAddress);
  };

  const handleMedicalAnswer = (questionId: string, answer: boolean, personId: string = "policyholder") => {
    if (personId === "policyholder") {
      setMedicalAnswers(prev => ({
        ...prev,
        [questionId]: { answer, details: prev[questionId]?.details || "" }
      }));
      if (answer) {
        setCurrentMedicalQuestion(questionId);
        setMedicalDetailsModalOpen(true);
      }
    } else {
      setDependentMedicalAnswers(prev => ({
        ...prev,
        [personId]: {
          ...prev[personId],
          [questionId]: { answer, details: prev[personId]?.[questionId]?.details || "" }
        }
      }));
      if (answer) {
        setCurrentMedicalQuestion(`${personId}:${questionId}`);
        setMedicalDetailsModalOpen(true);
      }
    }
  };

  const handleMedicalDetailsSubmit = (details: string) => {
    if (currentMedicalQuestion) {
      if (currentMedicalQuestion.includes(":")) {
        const [personId, questionId] = currentMedicalQuestion.split(":");
        setDependentMedicalAnswers(prev => ({
          ...prev,
          [personId]: {
            ...prev[personId],
            [questionId]: { ...prev[personId]?.[questionId], details }
          }
        }));
      } else {
        setMedicalAnswers(prev => ({
          ...prev,
          [currentMedicalQuestion]: { ...prev[currentMedicalQuestion], details }
        }));
      }
    }
    setMedicalDetailsModalOpen(false);
    setCurrentMedicalQuestion(null);
  };

  const handleEditDependent = (index: number) => {
    const dep = dependents[index];
    dependentForm.setFieldsValue({
      // Pre-fill from DependentsForm data
      relationship: dep.relationship,
      title: dep.title,
      familyName: dep.familyName,
      givenName: dep.givenName,
      dateOfBirth: dep.dateOfBirth,
      gender: dep.gender,
      // Additional fields
      height: "",
      weight: "",
      cardType: "NID",
      cardNo: "",
      cityOfResidence: "",
      occupation: "",
      phoneNumber: "",
    });
    setEditingDependentIndex(index);
    setDependentModalOpen(true);
  };

  const handleSubmitForm = async () => {
    try {
      await form.validateFields();
      if (!declarationAccepted || !policyWordingAccepted) {
        Modal.warning({
          title: "Declaration Required",
          content: "Please accept the declaration and policy wording to proceed.",
        });
        return;
      }
      onSubmit();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const SectionHeader = ({ icon: Icon, titleKh, titleEn, description }: { icon: React.ComponentType<{ className?: string }>; titleKh: string; titleEn: string; description: string }) => (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon className="text-[#c8102e] text-xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titleKh}</p>
        <h2 className="text-xl font-semibold text-gray-900">{titleEn}</h2>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );

  const FormLabel = ({ khmer, english, required = false }: { khmer: string; english: string; required?: boolean }) => (
    <span>
      <span className="block text-xs text-gray-500">{khmer}</span>
      <span className="text-gray-700">{english}</span>
      {required && <span className="text-[#c8102e] ml-1">*</span>}
    </span>
  );

  return (
    <div className="w-full px-6 py-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">បំពេញព័ត៌មានលម្អិត</p>
          <h1 className="text-3xl font-bold text-[#0a3d62] mb-3">Complete Your Application</h1>
          <p className="text-gray-600">
            Please provide additional details to finalize your insurance application. Previously entered information is pre-filled for your convenience.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: policyholderData?.title,
            familyName: policyholderData?.familyName,
            givenName: policyholderData?.givenName,
            dateOfBirth: policyholderData?.dateOfBirth,
            gender: policyholderData?.gender,
            countryCode: policyholderData?.countryCode || "+855",
            phoneNumber: policyholderData?.phoneNumber,
            email: policyholderData?.email,
            residentialCountry: "Cambodia",
          }}
        >
          {/* Section 1: Policyholder Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={UserOutlined}
              titleKh="ព័ត៌មានអំពីម្ចាស់បណ្ណា"
              titleEn="Details of Policy Holder"
              description="Review and complete your personal information"
            />

            {/* Pre-filled details from PolicyholderForm */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Form.Item
                name="title"
                label={<FormLabel khmer="គោត្ត" english="Title" />}
              >
                <Select
                  size="large"
                  placeholder="Select title"
                  options={[
                    { value: "Mr.", label: "Mr." },
                    { value: "Mrs.", label: "Mrs." },
                    { value: "Ms.", label: "Ms." },
                    { value: "Dr.", label: "Dr." },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="familyName"
                label={<FormLabel khmer="នាមត្រកូល" english="Family Name" required />}
                rules={[{ required: true, message: "Please enter family name" }]}
              >
                <Input size="large" placeholder="Enter family name" />
              </Form.Item>

              <Form.Item
                name="givenName"
                label={<FormLabel khmer="នាមខ្លួន" english="Given Name" required />}
                rules={[{ required: true, message: "Please enter given name" }]}
              >
                <Input size="large" placeholder="Enter given name" />
              </Form.Item>

              <Form.Item
                name="gender"
                label={<FormLabel khmer="ភេទ" english="Gender" required />}
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  size="large"
                  placeholder="Select gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                    { value: "Prefer not to say", label: "Prefer not to say" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Form.Item
                name="dateOfBirth"
                label={<FormLabel khmer="ថ្ងៃខែឆ្នាំកំណើត" english="Date of Birth" required />}
                rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker
                  size="large"
                  format="DD/MMM/YYYY"
                  className="w-full"
                  placeholder="dd/MMM/yyyy"
                />
              </Form.Item>

              <div>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">លេខទូរស័ព្ទ</span>
                  <span className="text-gray-700">Contact Number</span>
                  <span className="text-[#c8102e] ml-1">*</span>
                </div>
                <div className="flex gap-2">
                  <Form.Item name="countryCode" className="mb-0" style={{ width: '120px' }}>
                    <Select
                      size="large"
                      options={[
                        { value: "+855", label: "+855" },
                        { value: "+1", label: "+1" },
                        { value: "+44", label: "+44" },
                        { value: "+61", label: "+61" },
                        { value: "+65", label: "+65" },
                        { value: "+66", label: "+66" },
                        { value: "+84", label: "+84" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    className="mb-0 flex-1"
                    rules={[{ required: true, message: "Please enter phone number" }]}
                  >
                    <Input size="large" placeholder="Enter phone number" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                name="email"
                label={<FormLabel khmer="អ៊ីមែល" english="Email" required />}
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input size="large" placeholder="Enter email address" />
              </Form.Item>
            </div>

            {/* Additional details */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Additional Information</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Form.Item
                  name="height"
                  label={<FormLabel khmer="កម្ពស់" english="Height (cm)" required />}
                  rules={[{ required: true, message: "Please enter height" }]}
                >
                  <Input size="large" placeholder="e.g., 170" suffix="cm" />
                </Form.Item>

                <Form.Item
                  name="weight"
                  label={<FormLabel khmer="ទម្ងន់" english="Weight (kg)" required />}
                  rules={[{ required: true, message: "Please enter weight" }]}
                >
                  <Input size="large" placeholder="e.g., 65" suffix="kg" />
                </Form.Item>

                <Form.Item
                  name="maritalStatus"
                  label={<FormLabel khmer="ស្ថានភាពអាពាហ៍ពិពាហ៍" english="Marital Status" required />}
                  rules={[{ required: true, message: "Please select marital status" }]}
                >
                  <Select size="large" placeholder="Select" options={maritalStatusOptions} />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Form.Item
                name="nationality"
                label={<FormLabel khmer="សញ្ជាតិ" english="Nationality" required />}
                rules={[{ required: true, message: "Please select nationality" }]}
              >
                <Select size="large" placeholder="Select" options={nationalityOptions} showSearch />
              </Form.Item>

              <Form.Item
                name="cardType"
                label={<FormLabel khmer="ប្រភេទអត្តសញ្ញាណប័ណ្ណ" english="Card Type" required />}
                rules={[{ required: true, message: "Please select card type" }]}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={[
                    { value: "NID", label: "National ID" },
                    { value: "Passport", label: "Passport" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="cardNo"
                label={<FormLabel khmer="លេខអត្តសញ្ញាណប័ណ្ណ" english="NID / Passport No" required />}
                rules={[{ required: true, message: "Please enter ID number" }]}
              >
                <Input size="large" placeholder="Enter ID number" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Form.Item
                name="cardImage"
                label={<FormLabel khmer="រូបភាពអត្តសញ្ញាណប័ណ្ណ" english="NID / Passport Image" />}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div className="flex flex-col items-center">
                    <UploadOutlined className="text-2xl text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="fax"
                label={<FormLabel khmer="ទូរសារ" english="Fax" />}
              >
                <Input size="large" placeholder="Enter fax number" />
              </Form.Item>

              <Form.Item
                name="occupation"
                label={<FormLabel khmer="មុខរបរ" english="Occupation" required />}
                rules={[{ required: true, message: "Please select occupation" }]}
              >
                <Select size="large" placeholder="Select" options={occupationOptions} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="employer"
                label={<FormLabel khmer="និយោជក" english="Employer" />}
              >
                <Input size="large" placeholder="Enter employer name" />
              </Form.Item>
            </div>
          </div>

          {/* Section 2: Residential Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={HomeOutlined}
              titleKh="អាសយដ្ឋានលំនៅដ្ឋាន"
              titleEn="Residential Address"
              description="Your primary residence address"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Form.Item
                name="residentialPostalCode"
                label={<FormLabel khmer="លេខកូដប្រៃសណីយ៍" english="Postal Code" />}
              >
                <Input size="large" placeholder="Enter postal code" />
              </Form.Item>

              <Form.Item
                name="residentialHouseNo"
                label={<FormLabel khmer="លេខផ្ទះ" english="House No." required />}
                rules={[{ required: true, message: "Please enter house number" }]}
              >
                <Input size="large" placeholder="Enter house no." onChange={() => handleAddressFieldChange("residential")} />
              </Form.Item>

              <Form.Item
                name="residentialStreetNo"
                label={<FormLabel khmer="លេខផ្លូវ" english="Street No." required />}
                rules={[{ required: true, message: "Please enter street number" }]}
              >
                <Input size="large" placeholder="Enter street no." onChange={() => handleAddressFieldChange("residential")} />
              </Form.Item>

              <Form.Item
                name="residentialCity"
                label={<FormLabel khmer="ក្រុង/ខេត្ត" english="City/Province" required />}
                rules={[{ required: true, message: "Please select city" }]}
              >
                <Select 
                  size="large" 
                  placeholder="Select city/province" 
                  options={cityOptions}
                  showSearch
                  onChange={(value) => handleCityChange(value, "residential")}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Form.Item
                name="residentialDistrict"
                label={<FormLabel khmer="ស្រុក/ខណ្ឌ" english="District" />}
              >
                <Select 
                  size="large" 
                  placeholder="Select district" 
                  options={getDistrictOptions(residentialCity)}
                  showSearch
                  disabled={!residentialCity}
                  onChange={(value) => handleDistrictChange(value, "residential")}
                />
              </Form.Item>

              <Form.Item
                name="residentialCommune"
                label={<FormLabel khmer="ឃុំ/សង្កាត់" english="Commune" />}
              >
                <Select 
                  size="large" 
                  placeholder="Select commune" 
                  options={getCommuneOptions(residentialCity, residentialDistrict)}
                  showSearch
                  disabled={!residentialDistrict}
                  onChange={(value) => handleCommuneChange(value, "residential")}
                />
              </Form.Item>

              <Form.Item
                name="residentialVillage"
                label={<FormLabel khmer="ភូមិ" english="Village" />}
              >
                <Select 
                  size="large" 
                  placeholder="Select village" 
                  options={getVillageOptions(residentialCity, residentialDistrict, residentialCommune)}
                  showSearch
                  disabled={!residentialCommune}
                  onChange={() => handleAddressFieldChange("residential")}
                />
              </Form.Item>

              <Form.Item
                name="residentialCountry"
                label={<FormLabel khmer="ប្រទេស" english="Country" required />}
                rules={[{ required: true, message: "Please select country" }]}
              >
                <Select size="large" placeholder="Select" options={countryOptions} showSearch onChange={() => handleAddressFieldChange("residential")} />
              </Form.Item>
            </div>

            <Form.Item
              name="residentialFullAddress"
              label={<FormLabel khmer="អាសយដ្ឋានពេញ" english="Full Address (Auto-generated)" />}
            >
              <Input size="large" disabled className="bg-gray-50" />
            </Form.Item>
          </div>

          {/* Section 3: Correspondence Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={HomeOutlined}
              titleKh="អាសយដ្ឋានសម្រាប់ទំនាក់ទំនង"
              titleEn="Address for Correspondence"
              description="If different from residential address"
            />

            <div className="mb-6">
              <Checkbox
                checked={sameAsResidential}
                onChange={(e) => setSameAsResidential(e.target.checked)}
              >
                Same as residential address
              </Checkbox>
            </div>

            {!sameAsResidential && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Form.Item
                    name="correspondencePostalCode"
                    label={<FormLabel khmer="លេខកូដប្រៃសណីយ៍" english="Postal Code" />}
                  >
                    <Input size="large" placeholder="Enter postal code" />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceHouseNo"
                    label={<FormLabel khmer="លេខផ្ទះ" english="House No." required />}
                    rules={[{ required: !sameAsResidential, message: "Please enter house number" }]}
                  >
                    <Input size="large" placeholder="Enter house no." onChange={() => handleAddressFieldChange("correspondence")} />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceStreetNo"
                    label={<FormLabel khmer="លេខផ្លូវ" english="Street No." required />}
                    rules={[{ required: !sameAsResidential, message: "Please enter street number" }]}
                  >
                    <Input size="large" placeholder="Enter street no." onChange={() => handleAddressFieldChange("correspondence")} />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceCity"
                    label={<FormLabel khmer="ក្រុង/ខេត្ត" english="City/Province" required />}
                    rules={[{ required: !sameAsResidential, message: "Please select city" }]}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select city/province" 
                      options={cityOptions}
                      showSearch
                      onChange={(value) => handleCityChange(value, "correspondence")}
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Form.Item
                    name="correspondenceDistrict"
                    label={<FormLabel khmer="ស្រុក/ខណ្ឌ" english="District" />}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select district" 
                      options={getDistrictOptions(correspondenceCity)}
                      showSearch
                      disabled={!correspondenceCity}
                      onChange={(value) => handleDistrictChange(value, "correspondence")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceCommune"
                    label={<FormLabel khmer="ឃុំ/សង្កាត់" english="Commune" />}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select commune" 
                      options={getCommuneOptions(correspondenceCity, correspondenceDistrict)}
                      showSearch
                      disabled={!correspondenceDistrict}
                      onChange={(value) => handleCommuneChange(value, "correspondence")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceVillage"
                    label={<FormLabel khmer="ភូមិ" english="Village" />}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select village" 
                      options={getVillageOptions(correspondenceCity, correspondenceDistrict, correspondenceCommune)}
                      showSearch
                      disabled={!correspondenceCommune}
                      onChange={() => handleAddressFieldChange("correspondence")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="correspondenceCountry"
                    label={<FormLabel khmer="ប្រទេស" english="Country" required />}
                    rules={[{ required: !sameAsResidential, message: "Please select country" }]}
                  >
                    <Select size="large" placeholder="Select" options={countryOptions} showSearch onChange={() => handleAddressFieldChange("correspondence")} />
                  </Form.Item>
                </div>

                <Form.Item
                  name="correspondenceFullAddress"
                  label={<FormLabel khmer="អាសយដ្ឋានពេញ" english="Full Address (Auto-generated)" />}
                >
                  <Input size="large" disabled className="bg-gray-50" />
                </Form.Item>
              </>
            )}
          </div>

          {/* Section 4: Emergency Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={PhoneOutlined}
              titleKh="ទំនាក់ទំនងបន្ទាន់"
              titleEn="Emergency Contact Details"
              description="Person to contact in case of emergency"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Form.Item
                name="emergencyName"
                label={<FormLabel khmer="ឈ្មោះ" english="Name" required />}
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input size="large" placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="emergencyRelationship"
                label={<FormLabel khmer="ទំនាក់ទំនង" english="Relationship" required />}
                rules={[{ required: true, message: "Please select relationship" }]}
              >
                <Select size="large" placeholder="Select" options={relationshipOptions} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="emergencyPhone"
                label={<FormLabel khmer="លេខទូរស័ព្ទ" english="Phone Number" required />}
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input size="large" placeholder="Enter phone number" prefix={<PhoneOutlined className="text-gray-400" />} />
              </Form.Item>

              <Form.Item
                name="emergencyEmail"
                label={<FormLabel khmer="អ៊ីមែល" english="Email" />}
              >
                <Input size="large" placeholder="Enter email address" />
              </Form.Item>
            </div>
          </div>

          {/* Section 5: Dependents */}
          {dependents.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
              <SectionHeader
                icon={TeamOutlined}
                titleKh="សមាជិកគ្រួសារ"
                titleEn="Dependants"
                description="Review and add additional details for each dependent"
              />

              <div className="space-y-4">
                {dependents.map((dep, index) => (
                  <div key={dep.id} className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#c8102e] text-white flex items-center justify-center font-semibold text-lg">
                          {dep.familyName.charAt(0)}{dep.givenName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            {dep.title} {dep.familyName} {dep.givenName}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium text-[#c8102e]">{dep.relationship}</span>
                            </span>
                            <span>|</span>
                            <span>{dep.gender}</span>
                            <span>|</span>
                            <span>DOB: {dep.dateOfBirth?.format("DD/MMM/YYYY") || "N/A"}</span>
                            <span>|</span>
                            <span>Age: {dep.ageAtNextBirthday} years</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditDependent(index)}
                        className="bg-[#0a3d62] hover:bg-[#083352] border-0"
                      >
                        Add Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Existing Insurance */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={SafetyCertificateOutlined}
              titleKh="ការធានារ៉ាប់រងដែលមានស្រាប់"
              titleEn="Existing Insurance"
              description="Information about your current insurance coverage"
            />

            <div className="mb-6">
              <p className="text-gray-700 mb-3">Are you presently insured with another insurance company?</p>
              <Radio.Group
                value={hasExistingInsurance}
                onChange={(e) => setHasExistingInsurance(e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </div>

            {hasExistingInsurance && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                <Form.Item
                  name="existingInsuranceCompany"
                  label={<FormLabel khmer="ឈ្មោះក្រុមហ៊ុន" english="Name of Company" required />}
                  rules={[{ required: hasExistingInsurance, message: "Please enter company name" }]}
                >
                  <Input size="large" placeholder="Enter company name" />
                </Form.Item>

                <Form.Item
                  name="existingInsurancePlan"
                  label={<FormLabel khmer="ផែនការ" english="Plan" required />}
                  rules={[{ required: hasExistingInsurance, message: "Please enter plan name" }]}
                >
                  <Input size="large" placeholder="Enter plan name" />
                </Form.Item>

                <Form.Item
                  name="existingInsuranceExpiry"
                  label={<FormLabel khmer="កាលបរិច្ឆេទផុតកំណត់" english="Expiration Date" required />}
                  rules={[{ required: hasExistingInsurance, message: "Please select expiration date" }]}
                >
                  <DatePicker size="large" className="w-full" format="DD/MMM/YYYY" />
                </Form.Item>
              </div>
            )}
          </div>

          {/* Section 7: Policy Commencement */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={FileTextOutlined}
              titleKh="កាលបរិច្ឆេទចាប់ផ្តើមគោលនយោបាយ"
              titleEn="Policy Commencement"
              description="When would you like your policy to start?"
            />

            <div className="mb-6">
              <p className="text-gray-700 mb-3">Would you like your policy to commence immediately upon acceptance?</p>
              <Radio.Group
                value={immediateCommencement}
                onChange={(e) => setImmediateCommencement(e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </div>

            {immediateCommencement === false && (
              <div className="border-t border-gray-100 pt-6">
                <Form.Item
                  name="commencementDate"
                  label={<FormLabel khmer="កាលបរិច្ឆេទចាប់ផ្តើម" english="Commencement Date" required />}
                  rules={[{ required: !immediateCommencement, message: "Please select commencement date" }]}
                >
                  <DatePicker size="large" className="w-full md:w-1/3" format="DD/MMM/YYYY" />
                </Form.Item>
              </div>
            )}
          </div>

          {/* Section 8: Selected Plan Display */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={SafetyCertificateOutlined}
              titleKh="ផែនការដែលបានជ្រើសរើស"
              titleEn="Selected Plan"
              description="Your chosen insurance plan"
            />

            <div className="bg-[#0a3d62]/5 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-semibold text-gray-900">
                    {planData?.selectedPlans?.join(", ") || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-semibold text-gray-900">
                    {planData?.planType === "ip-only" ? "IP Only" : planData?.planType === "ip-op" ? "IP & OP" : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Geographical Coverage</p>
                  <p className="font-semibold text-gray-900">
                    {planData?.geoCoverage || "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            {planData?.optionalBenefits && planData.optionalBenefits.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Optional Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {planData.optionalBenefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="bg-[#c8102e]/10 text-[#c8102e] px-3 py-1 rounded-full text-sm"
                    >
                      {optionalBenefitLabels[benefit] || benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 9: Occupation Questionnaire */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={QuestionCircleOutlined}
              titleKh="កម្រងសំណួរអំពីមុខរបរ"
              titleEn="Occupation Questionnaire"
              description="Questions about your work environment"
            />

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Does your occupation involve any of the following: Working in high-risk environment (e.g. mine, oil rigs, construction sites)? Operating or being exposed to heavy industrial equipment? Handling toxic chemicals or biological hazards?
                </p>
                <Radio.Group
                  value={occupationRisk}
                  onChange={(e) => setOccupationRisk(e.target.value)}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>

                {occupationRisk === false && (
                  <div className="mt-4">
                    <Form.Item
                      name="occupationDetails"
                      label={<FormLabel khmer="ព័ត៌មានលម្អិត" english="Please provide full details on the type and frequency of out-of-office activities required by your job" />}
                    >
                      <TextArea rows={3} placeholder="Enter details..." />
                    </Form.Item>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Do you engage in any high-risk or hazardous recreational activities or hobbies? (e.g., Skydiving, Paragliding, Scuba diving, Rock climbing, Motor racing, etc.)
                </p>
                <Radio.Group
                  value={hazardousActivities}
                  onChange={(e) => setHazardousActivities(e.target.value)}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>

                {hazardousActivities === true && (
                  <div className="mt-4">
                    <Form.Item
                      name="hazardousActivitiesDetails"
                      label={<FormLabel khmer="ព័ត៌មានលម្អិត" english="Please provide full details on the type and frequency of such activities" />}
                    >
                      <TextArea rows={3} placeholder="Enter details..." />
                    </Form.Item>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer" onClick={() => setPaExclusionsModalOpen(true)}>
                <ExclamationCircleOutlined />
                <span>View PA Policy Wording for Exclusions</span>
              </div>
            </div>
          </div>

          {/* Section 10: Medical Questionnaire - Policyholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={QuestionCircleOutlined}
              titleKh="កម្រងសំណួរវេជ្ជសាស្រ្ត"
              titleEn="Medical Questionnaire - Policy Holder"
              description="Health-related questions for the policyholder"
            />

            <div className="space-y-4">
              {medicalQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 mb-3 text-sm">{q.question}</p>
                  <div className="flex items-center gap-4">
                    <Radio.Group
                      value={medicalAnswers[q.id]?.answer}
                      onChange={(e) => handleMedicalAnswer(q.id, e.target.value)}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                    {medicalAnswers[q.id]?.answer === true && medicalAnswers[q.id]?.details && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <CheckCircleOutlined /> Details provided
                        </span>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setCurrentMedicalQuestion(q.id);
                            setMedicalDetailsModalOpen(true);
                          }}
                          className="text-[#0a3d62] p-0"
                        >
                          View/Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: Medical Questionnaire - Dependents */}
          {dependents.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
              <SectionHeader
                icon={QuestionCircleOutlined}
                titleKh="កម្រងសំណួរវេជ្ជសាស្រ្ត - សមាជិកគ្រួសារ"
                titleEn="Medical Questionnaire - Dependants"
                description="Health-related questions for each dependent"
              />

              <Collapse accordion>
                {dependents.map((dep) => (
                  <Panel
                    header={
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{dep.title} {dep.familyName} {dep.givenName}</span>
                        <span className="text-gray-500">({dep.relationship})</span>
                      </div>
                    }
                    key={dep.id}
                  >
                    <div className="space-y-4">
                      {medicalQuestions.map((q) => (
                        <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 mb-3 text-sm">{q.question}</p>
                          <div className="flex items-center gap-4">
                            <Radio.Group
                              value={dependentMedicalAnswers[dep.id]?.[q.id]?.answer}
                              onChange={(e) => handleMedicalAnswer(q.id, e.target.value, dep.id)}
                            >
                              <Radio value={true}>Yes</Radio>
                              <Radio value={false}>No</Radio>
                            </Radio.Group>
                            {dependentMedicalAnswers[dep.id]?.[q.id]?.answer === true &&
                              dependentMedicalAnswers[dep.id]?.[q.id]?.details && (
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600 text-sm flex items-center gap-1">
                                    <CheckCircleOutlined /> Details provided
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                      setCurrentMedicalQuestion(`${dep.id}:${q.id}`);
                                      setMedicalDetailsModalOpen(true);
                                    }}
                                    className="text-[#0a3d62] p-0"
                                  >
                                    View/Edit
                                  </Button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>
          )}

          {/* Section 12: Declaration */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <SectionHeader
              icon={FileTextOutlined}
              titleKh="សេចក្តីប្រកាស"
              titleEn="Declaration"
              description="Please read and accept the declaration"
            />

            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <p>
                1. I declare that I have answered all the questions truthfully and to the best of knowledge. If this form has been completed on my behalf, I agree to the truthfulness of the responses given. I understand that any incorrect or incomplete answer or the concealment of any facts relevant to this insurance may invalidate this policy. I also understand that the insurer shall be entitled to retain all premiums paid during the policy year by virtue of breach of this declaration.
              </p>
              <p>
                2. I am also aware that I have to notify the insurer of any fact material to this insurance, which arises between the date of this declaration and the inception of this policy.
              </p>
              <p>
                3. I understand and accept that for all Insured, no benefit will be payable to any pre-existing condition which is not approved by the Insurer.
              </p>
            </div>

            <div className="space-y-3">
              <Checkbox
                checked={policyWordingAccepted}
                onChange={(e) => setPolicyWordingAccepted(e.target.checked)}
              >
                <span className="text-gray-700">I understand and accept all items stated in the policy wording</span>
              </Checkbox>

              <Checkbox
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
              >
                <span className="text-gray-700 font-semibold">I accept the Declaration</span>
              </Checkbox>
            </div>
          </div>
        </Form>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>&#8592;</span>
            Back
          </button>
          <div className="text-sm text-gray-500">Step 5 of 5</div>
          <button
            onClick={handleSubmitForm}
            disabled={!declarationAccepted || !policyWordingAccepted}
            className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              declarationAccepted && policyWordingAccepted
                ? "bg-[#c8102e] hover:bg-[#a00d25] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Application
            <span>&#8594;</span>
          </button>
        </div>
      </div>

      {/* PA Exclusions Modal */}
      <Modal
        title="PA Policy Wording - Exclusions"
        open={paExclusionsModalOpen}
        onCancel={() => setPaExclusionsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setPaExclusionsModalOpen(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        <div className="text-sm text-gray-600 space-y-4 max-h-96 overflow-y-auto">
          <p className="font-semibold">Cover for hazardous sports / activities or occupations may be subjected to a premium loading or decline for coverage.</p>
          <p>The following activities and occupations are generally excluded from standard PA coverage:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Professional sports or racing</li>
            <li>Aviation activities (except as a fare-paying passenger)</li>
            <li>Underwater activities beyond 30 meters depth</li>
            <li>Mountain climbing requiring ropes or guides</li>
            <li>Extreme sports including but not limited to bungee jumping, base jumping</li>
            <li>Working at heights above 10 meters</li>
            <li>Mining and underground work</li>
            <li>Offshore oil and gas platform work</li>
            <li>Handling explosives or hazardous materials</li>
          </ul>
          <p className="italic">Note: Additional premium may apply if coverage is requested for excluded activities.</p>
        </div>
      </Modal>

      {/* Medical Details Modal */}
      <Modal
        title="Medical Details"
        open={medicalDetailsModalOpen}
        onCancel={() => {
          setMedicalDetailsModalOpen(false);
          setCurrentMedicalQuestion(null);
        }}
        footer={null}
        centered
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Please provide full details about your condition or treatment:
          </p>
          <TextArea
            rows={4}
            placeholder="Enter details here..."
            id="medicalDetailsInput"
            key={currentMedicalQuestion}
            defaultValue={
              currentMedicalQuestion
                ? currentMedicalQuestion.includes(":")
                  ? dependentMedicalAnswers[currentMedicalQuestion.split(":")[0]]?.[currentMedicalQuestion.split(":")[1]]?.details || ""
                  : medicalAnswers[currentMedicalQuestion]?.details || ""
                : ""
            }
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => {
              setMedicalDetailsModalOpen(false);
              setCurrentMedicalQuestion(null);
            }}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="bg-[#c8102e]"
              onClick={() => {
                const input = document.getElementById("medicalDetailsInput") as HTMLTextAreaElement;
                handleMedicalDetailsSubmit(input?.value || "");
              }}
            >
              Save Details
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dependent Details Modal */}
      <Modal
        title={null}
        open={dependentModalOpen}
        onCancel={() => setDependentModalOpen(false)}
        footer={null}
        width={700}
      >
        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <TeamOutlined className="text-[#c8102e] text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">បន្ថែមព័ត៌មានលម្អិត</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingDependentIndex !== null 
                ? `Details for ${dependents[editingDependentIndex]?.title} ${dependents[editingDependentIndex]?.familyName} ${dependents[editingDependentIndex]?.givenName}` 
                : "Add Dependent Details"}
            </h2>
          </div>
        </div>

        <Form form={dependentForm} layout="vertical">
          {/* Editable details from DependentsForm */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Basic Information (Editable)</p>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="relationship"
                label={<FormLabel khmer="ទំនាក់ទំនង" english="Relationship" required />}
                rules={[{ required: true, message: "Please select relationship" }]}
              >
                <Select
                  size="large"
                  placeholder="Select relationship"
                  options={[
                    { value: "Spouse", label: "Spouse" },
                    { value: "Child", label: "Child" },
                    { value: "Parent", label: "Parent" },
                    { value: "Sibling", label: "Sibling" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="title"
                label={<FormLabel khmer="គោរព" english="Title" />}
              >
                <Select
                  size="large"
                  placeholder="Select title"
                  options={[
                    { value: "Mr.", label: "Mr." },
                    { value: "Mrs.", label: "Mrs." },
                    { value: "Ms.", label: "Ms." },
                    { value: "Dr.", label: "Dr." },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="familyName"
                label={<FormLabel khmer="នាមត្រកូល" english="Family Name" required />}
                rules={[{ required: true, message: "Please enter family name" }]}
              >
                <Input size="large" placeholder="Enter family name" />
              </Form.Item>

              <Form.Item
                name="givenName"
                label={<FormLabel khmer="នាមខ្លួន" english="Given Name" required />}
                rules={[{ required: true, message: "Please enter given name" }]}
              >
                <Input size="large" placeholder="Enter given name" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="dateOfBirth"
                label={<FormLabel khmer="ថ្ងៃខែឆ្នាំកំណើត" english="Date of Birth" required />}
                rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker
                  size="large"
                  format="DD/MMM/YYYY"
                  className="w-full"
                  placeholder="Select date"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label={<FormLabel khmer="ភេទ" english="Gender" required />}
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  size="large"
                  placeholder="Select gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          {/* Additional Details Section */}
          <p className="text-sm font-medium text-gray-700 mb-4">Additional Information Required</p>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="height"
              label={<FormLabel khmer="កម្ពស់" english="Height (cm)" required />}
              rules={[{ required: true, message: "Please enter height" }]}
            >
              <Input size="large" placeholder="e.g., 170" suffix="cm" />
            </Form.Item>

            <Form.Item
              name="weight"
              label={<FormLabel khmer="ទម្ងន់" english="Weight (kg)" required />}
              rules={[{ required: true, message: "Please enter weight" }]}
            >
              <Input size="large" placeholder="e.g., 65" suffix="kg" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="cardType"
              label={<FormLabel khmer="ប្រភេទអត្តសញ្ញាណប័ណ្ណ" english="Card Type" required />}
              rules={[{ required: true, message: "Please select card type" }]}
            >
              <Select
                size="large"
                options={[
                  { value: "NID", label: "National ID" },
                  { value: "Passport", label: "Passport" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="cardNo"
              label={<FormLabel khmer="លេខអត្តសញ្ញាណប័ណ្ណ" english="NID / Passport No" required />}
              rules={[{ required: true, message: "Please enter ID number" }]}
            >
              <Input size="large" placeholder="Enter ID number" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="cityOfResidence"
              label={<FormLabel khmer="ទីក្រុងស្នាក់នៅ" english="City of Residence" required />}
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input size="large" placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              name="occupation"
              label={<FormLabel khmer="មុខរបរ" english="Occupation" />}
            >
              <Select size="large" placeholder="Select" options={occupationOptions} />
            </Form.Item>
          </div>

          <Form.Item
            name="phoneNumber"
            label={<FormLabel khmer="លេខទូរស័ព្ទ" english="Phone Number" />}
          >
            <Input size="large" placeholder="Enter phone number" prefix={<PhoneOutlined className="text-gray-400" />} />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={() => setDependentModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              className="bg-[#c8102e]"
              onClick={() => {
                dependentForm.validateFields().then(() => {
                  setDependentModalOpen(false);
                });
              }}
            >
              Save Details
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
