"use client";

import React, { useState, useEffect } from "react";
import { Select, Input, DatePicker, Form } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

interface PolicyholderFormProps {
  onContinue?: (values: FormValues) => void;
}

interface FormValues {
  title: string;
  familyName: string;
  givenName: string;
  dateOfBirth: Dayjs | null;
  gender: string;
}

export default function PolicyholderForm({ onContinue }: PolicyholderFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [ageAtNextBirthday, setAgeAtNextBirthday] = useState<number | null>(null);

  useEffect(() => {
    if (dateOfBirth) {
      const today = dayjs();
      const nextBirthday = dayjs(dateOfBirth).year(today.year());
      
      if (nextBirthday.isBefore(today) || nextBirthday.isSame(today, "day")) {
        const age = today.year() - dateOfBirth.year() + 1;
        setAgeAtNextBirthday(age);
      } else {
        const age = today.year() - dateOfBirth.year();
        setAgeAtNextBirthday(age);
      }
    }
  }, [dateOfBirth]);

  const handleContinue = async () => {
    try {
      const values = await form.validateFields();
      onContinue?.(values);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">ព័ត៌មានអំពីម្ចាស់បណ្ណា</p>
        <h1 className="text-3xl font-bold text-[#0a3d62] mb-3">Tell us about you</h1>
        <p className="text-gray-600">
          Start with your details. We use this to build a personalised quote — your information stays
          encrypted and is never shared without your consent.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        {/* Card Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <UserOutlined className="text-[#c8102e] text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">ព័ត៌មានអំពីម្ចាស់បណ្ណា</p>
            <h2 className="text-xl font-semibold text-gray-900">Policyholder details</h2>
            <p className="text-gray-500 text-sm">
              The primary person on the policy — this is who claims will be made against.
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: undefined,
            familyName: "",
            givenName: "",
            dateOfBirth: null,
            gender: undefined,
          }}
        >
          {/* First Row: Title, Family Name, Given Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Form.Item
              name="title"
              label={
                <span>
                  <span className="block text-xs text-gray-500">គោត្ត</span>
                  <span className="text-gray-700">Title</span>
                </span>
              }
            >
              <Select
                size="large"
                className="w-full"
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
              label={
                <span>
                  <span className="block text-xs text-gray-500">នាមត្រកូល</span>
                  <span className="text-gray-700">Family Name</span>
                  <span className="text-[#c8102e] ml-1">*</span>
                </span>
              }
              rules={[{ required: true, message: "Please enter family name" }]}
            >
              <Input size="large" placeholder="Enter family name" />
            </Form.Item>

            <Form.Item
              name="givenName"
              label={
                <span>
                  <span className="block text-xs text-gray-500">នាមខ្លួន</span>
                  <span className="text-gray-700">Given Name</span>
                  <span className="text-[#c8102e] ml-1">*</span>
                </span>
              }
              rules={[{ required: true, message: "Please enter given name" }]}
            >
              <Input size="large" placeholder="Enter given name" />
            </Form.Item>
          </div>

          {/* Second Row: Date of Birth, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Form.Item
                name="dateOfBirth"
                label={
                  <span>
                    <span className="block text-xs text-gray-500">ថ្ងៃខែឆ្នាំកំណើត</span>
                    <span className="text-gray-700">Date of Birth</span>
                    <span className="text-[#c8102e] ml-1">*</span>
                  </span>
                }
                rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker
                  size="large"
                  format="DD/MMM/YYYY"
                  className="w-full"
                  suffixIcon={<CalendarOutlined className="text-[#c8102e]" />}
                  onChange={(date) => setDateOfBirth(date)}
                />
              </Form.Item>
              <span className="text-xs text-gray-400">dd/MMM/yyyy</span>
            </div>

            <div>
              <div className="mb-2">
                <span className="block text-xs text-gray-500">អាយុ (គិតតាមថ្ងៃខួបកំណើតបន្ទាប់)</span>
                <span className="text-gray-700">Age at next birthday</span>
              </div>
              <div className="h-[40px] bg-[#0a3d62] rounded-lg flex items-center justify-between px-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{ageAtNextBirthday ?? "-"}</span>
                  <span className="text-white/80 text-sm">years</span>
                </div>
                <span className="bg-[#c8102e] text-white text-xs px-2 py-1 rounded-full">
                  Auto
                </span>
              </div>
            </div>

            <Form.Item
              name="gender"
              label={
                <span>
                  <span className="block text-xs text-gray-500">ភេទ</span>
                  <span className="text-gray-700">Gender</span>
                  <span className="text-[#c8102e] ml-1">*</span>
                </span>
              }
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select
                size="large"
                className="w-full"
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
        </Form>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex-1"></div>
        <div className="text-sm text-gray-500">Step 1 of 4</div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-[#c8102e] hover:bg-[#a00d25] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            Continue
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
