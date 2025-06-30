"use client"
import { StaffManagement } from "@/components/settings/staff-management";

export default function StaffSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">スタッフ管理</h1>
      <StaffManagement />
    </div>
  );
}
