
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  File, 
  Package, 
  ShoppingCart, 
  Link2,
  Zap,
  Users, 
  Settings, 
  Image, 
  FileText, 
  Globe,
  BarChart3,
  BookOpen,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onSignOut 
}) => {
  const primaryMenuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "gabarits", label: "Gabarits", icon: File, badge: "Core" },
    { id: "produits", label: "Produits Personnalisés", icon: Package },
    { id: "commandes", label: "Commandes", icon: ShoppingCart },
    { id: "mapping", label: "Mapping Imprimeurs", icon: Link2, badge: "V2" },
    { id: "automatisation", label: "Automatisation", icon: Zap, badge: "V2" },
  ];

  const managementItems = [
    { id: "utilisateurs", label: "Utilisateurs", icon: Users },
    { id: "parametres", label: "Paramètres", icon: Settings },
    { id: "media", label: "Médias", icon: Image },
    { id: "contenu", label: "Contenu", icon: FileText },
    { id: "pages", label: "Pages", icon: Globe },
  ];

  const analyticsItems = [
    { id: "statistiques", label: "Statistiques", icon: BarChart3 },
    { id: "documentation", label: "Documentation", icon: BookOpen },
  ];

  const renderMenuItem = (item: any) => (
    <Button
      key={item.id}
      variant={activeTab === item.id ? "secondary" : "ghost"}
      className={`w-full justify-start gap-3 text-left ${
        activeTab === item.id ? "bg-orange-100 text-orange-900" : "text-gray-700"
      }`}
      onClick={() => onTabChange(item.id)}
    >
      <item.icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="text-xs">
          {item.badge}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Podsleek</h1>
        <p className="text-sm text-gray-500 mt-1">Version 2.0</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Section principale */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Gestion Principale
          </h3>
          <div className="space-y-1">
            {primaryMenuItems.map(renderMenuItem)}
          </div>
        </div>

        <Separator />

        {/* Section administration */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Administration
          </h3>
          <div className="space-y-1">
            {managementItems.map(renderMenuItem)}
          </div>
        </div>

        <Separator />

        {/* Section analytics */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Analytics & Docs
          </h3>
          <div className="space-y-1">
            {analyticsItems.map(renderMenuItem)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
