
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  sectionTitle: string;
}

const AdminHeader = ({ sectionTitle }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white p-4 flex items-center justify-between border-b">
      <h1 className="text-xl font-semibold">{sectionTitle}</h1>
      <div className="flex items-center gap-2">
        <span className="text-orange-500">
          {user?.user_metadata?.full_name || "Admin User"}
        </span>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
          {(user?.user_metadata?.full_name || "A")[0]}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
