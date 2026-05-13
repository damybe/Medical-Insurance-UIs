"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, DatePicker } from "antd";
import { TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

export interface Dependent {
  id: string;
  relationship: string;
  title: string;
  familyName: string;
  givenName: string;
  dateOfBirth: Dayjs;
  gender: string;
  ageAtNextBirthday: number;
}

interface AddDependentModalProps {
  open: boolean;
  onCancel: () => void;
  onAdd: (dependent: Dependent) => void;
  editingDependent?: Dependent | null;
}

export default function AddDependentModal({
  open,
  onCancel,
  onAdd,
  editingDependent,
}: AddDependentModalProps) {
  const [form] = Form.useForm();
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [ageAtNextBirthday, setAgeAtNextBirthday] = useState<number | null>(null);

  useEffect(() => {
    if (editingDependent) {
      form.setFieldsValue({
        relationship: editingDependent.relationship,
        title: editingDependent.title,
        familyName: editingDependent.familyName,
        givenName: editingDependent.givenName,
        dateOfBirth: editingDependent.dateOfBirth,
        gender: editingDependent.gender,
      });
      setDateOfBirth(editingDependent.dateOfBirth);
    } else {
      form.resetFields();
      setDateOfBirth(null);
      setAgeAtNextBirthday(null);
    }
  }, [editingDependent, open, form]);

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
    } else {
      setAgeAtNextBirthday(null);
    }
  }, [dateOfBirth]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const dependent: Dependent = {
        id: editingDependent?.id || Date.now().toString(),
        relationship: values.relationship,
        title: values.title,
        familyName: values.familyName,
        givenName: values.givenName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        ageAtNextBirthday: ageAtNextBirthday || 0,
      };
      onAdd(dependent);
      form.resetFields();
      setDateOfBirth(null);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      closeIcon={
        <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
      }
    >
      {/* Modal Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <TeamOutlined className="text-[#c8102e] text-xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500">បន្ថែមសមាជិកគ្រួសារ</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {editingDependent ? "Edit dependent" : "Add a dependent"}
          </h2>
        </div>
      </div>

      <Form form={form} layout="vertical">
        {/* Relationship and Title Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Form.Item
            name="relationship"
            label={
              <span>
                <span className="block text-xs text-gray-500">ទំនាក់ទំនងជាមួយម្ចាស់បណ្ណា</span>
                <span className="text-gray-700">Relationship</span>
                <span className="text-[#c8102e] ml-1">*</span>
              </span>
            }
            rules={[{ required: true, message: "Please select relationship" }]}
          >
            <Select
              size="large"
              placeholder="Select relationship"
              options={[
                { value: "Spouse", label: "Spouse" },
                { value: "Child", label: "Child" },
                { value: "Parent", label: "Parent" },
              ]}
            />
          </Form.Item>

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
              placeholder="Enter title"
              options={[
                { value: "Mr.", label: "Mr." },
                { value: "Mrs.", label: "Mrs." },
                { value: "Ms.", label: "Ms." },
                { value: "Dr.", label: "Dr." },
              ]}
            />
          </Form.Item>
        </div>

        {/* Family Name and Given Name Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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
            <Input size="large" placeholder="Enter Family Name" />
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
            <Input size="large" placeholder="Enter Given Name" />
          </Form.Item>
        </div>

        {/* Date of Birth and Age Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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
                placeholder="dd/MMM/yyyy"
                className="w-full"
                suffixIcon={<CalendarOutlined className="text-[#c8102e]" />}
                onChange={(date) => setDateOfBirth(date)}
              />
            </Form.Item>
            <span className="text-xs text-gray-400">dd/MMM/yyyy</span>
          </div>

          <div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">អាយុ (គិតតាមថ្ងៃខួបកំណើ��បន្ទាប់)</span>
              <span className="text-gray-700">Age at next birthday</span>
            </div>
            <div className="h-[44px] bg-gray-100 rounded-lg flex items-center px-4">
              <span className="text-gray-500">
                {ageAtNextBirthday !== null ? `${ageAtNextBirthday} years` : "Auto-calculated"}
              </span>
            </div>
          </div>
        </div>

        {/* Gender Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
              placeholder="Enter Gender"
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

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#c8102e] text-white rounded-lg hover:bg-[#a00d25] transition-colors"
        >
          {editingDependent ? "Update dependent" : "Add dependent"}
        </button>
      </div>
    </Modal>
  );
}
