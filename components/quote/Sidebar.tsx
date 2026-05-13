"use client";

import React from "react";
import {
  FileTextOutlined,
  UnorderedListOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const menuItems = [
  {
    key: "create-quotation",
    icon: <FileTextOutlined />,
    label: "Create Quotation",
  },
  {
    key: "quotation-list",
    icon: <UnorderedListOutlined />,
    label: "Quotation List",
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  activeMenu,
  onMenuChange,
}: SidebarProps) {
  return (
    <aside
      className={`bg-[#0a3d62] text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-4 border-b border-white/10">
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="text-xl" />
          ) : (
            <MenuFoldOutlined className="text-xl" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onMenuChange(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              activeMenu === item.key
                ? "bg-white/20 text-white border-l-4 border-[#c8102e]"
                : "text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
            }`}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapsed indicator */}
      {collapsed && (
        <div className="p-4 text-center text-white/50 text-xs">
          Menu
        </div>
      )}
    </aside>
  );
}
