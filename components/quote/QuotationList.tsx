"use client";

import React, { useState } from "react";
import { Table, Tag, Button, Input, Space, Empty } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Quotation {
  id: string;
  quotationNumber: string;
  policyholderName: string;
  dependentsCount: number;
  plans: string[];
  totalPremium: number;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Sample data - in a real app, this would come from a database or API
const sampleQuotations: Quotation[] = [
  {
    id: "1",
    quotationNumber: "QT-2024-001",
    policyholderName: "Mr. John Smith",
    dependentsCount: 2,
    plans: ["Classic IP & OP", "Advance IP Only"],
    totalPremium: 1850,
    status: "approved",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
  {
    id: "2",
    quotationNumber: "QT-2024-002",
    policyholderName: "Mrs. Sarah Johnson",
    dependentsCount: 3,
    plans: ["Premier IP & OP"],
    totalPremium: 2400,
    status: "pending",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    quotationNumber: "QT-2024-003",
    policyholderName: "Dr. Michael Chen",
    dependentsCount: 1,
    plans: ["Gold IP Only", "Silver IP Only"],
    totalPremium: 1410,
    status: "draft",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-21",
  },
  {
    id: "4",
    quotationNumber: "QT-2024-004",
    policyholderName: "Ms. Emily Davis",
    dependentsCount: 0,
    plans: ["Platinum IP Only"],
    totalPremium: 1450,
    status: "rejected",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-23",
  },
];

const statusColors: Record<string, string> = {
  draft: "default",
  pending: "processing",
  approved: "success",
  rejected: "error",
};

interface QuotationListProps {
  onCreateNew: () => void;
}

export default function QuotationList({ onCreateNew }: QuotationListProps) {
  const [quotations] = useState<Quotation[]>(sampleQuotations);
  const [searchText, setSearchText] = useState("");

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quotationNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      q.policyholderName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Quotation> = [
    {
      title: "Quotation No.",
      dataIndex: "quotationNumber",
      key: "quotationNumber",
      render: (text: string) => (
        <span className="font-medium text-[#0a3d62]">{text}</span>
      ),
    },
    {
      title: "Policyholder",
      dataIndex: "policyholderName",
      key: "policyholderName",
      render: (text: string, record: Quotation) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {record.dependentsCount} dependent{record.dependentsCount !== 1 ? "s" : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Plans",
      dataIndex: "plans",
      key: "plans",
      render: (plans: string[]) => (
        <div className="flex flex-wrap gap-1">
          {plans.map((plan, index) => (
            <Tag key={index} color="blue">
              {plan}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Premium",
      dataIndex: "totalPremium",
      key: "totalPremium",
      render: (premium: number) => (
        <span className="font-semibold text-[#0a3d62]">
          ${premium.toLocaleString()}/yr
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-600">{date}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Quotation) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="View"
            className="text-gray-500 hover:text-[#0a3d62]"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Edit"
            className="text-gray-500 hover:text-[#0a3d62]"
            disabled={record.status === "approved"}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            title="Delete"
            className="text-gray-500 hover:text-[#c8102e]"
            disabled={record.status === "approved"}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm mb-1">បញ្ជីសម្រង់តម្លៃ</p>
        <h1 className="text-3xl font-bold text-[#0a3d62]">Quotation List</h1>
        <p className="text-gray-600 mt-2">
          View and manage all your insurance quotations in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileTextOutlined className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a3d62]">{quotations.length}</p>
              <p className="text-sm text-gray-500">Total Quotations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <CalendarOutlined className="text-yellow-600 text-lg" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a3d62]">
                {quotations.filter((q) => q.status === "pending").length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserOutlined className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a3d62]">
                {quotations.filter((q) => q.status === "approved").length}
              </p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <EditOutlined className="text-gray-600 text-lg" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a3d62]">
                {quotations.filter((q) => q.status === "draft").length}
              </p>
              <p className="text-sm text-gray-500">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Input
            placeholder="Search by quotation number or policyholder name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-80"
            allowClear
          />
          <Button
            type="primary"
            onClick={onCreateNew}
            className="bg-[#c8102e] hover:bg-[#a00d25]"
          >
            + New Quotation
          </Button>
        </div>

        {/* Table */}
        {filteredQuotations.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredQuotations}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} quotations`,
            }}
            className="quotation-table"
          />
        ) : (
          <div className="py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No quotations found</p>
                  <Button
                    type="primary"
                    onClick={onCreateNew}
                    className="bg-[#c8102e] hover:bg-[#a00d25]"
                  >
                    Create Your First Quotation
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
