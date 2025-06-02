
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThemeSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

const ThemeManagement = () => {
  const { toast } = useToast();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    siteName: "Podsleek",
    logo: "",
    primaryColor: "#33C3F0",
    secondaryColor: "#0FA0CE",
    accentColor: "#FF6B35",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    fontFamily: "Inter"
  });

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = () => {
    const saved = localStorage.getItem('theme_settings');
    if (saved) {
      setThemeSettings(JSON.parse(saved));
    }
  };

  const saveThemeSettings = () => {
    localStorage.setItem('theme_settings', JSON.stringify(themeSettings));
    toast({
      title: "Thème mis à jour",
      description: "Les paramètres du thème ont été sauvegardés."
    });
  };

  const handleColorChange = (colorType: keyof ThemeSettings, value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const resetToDefault = () => {
    const defaultTheme: ThemeSettings = {
      siteName: "Podsleek",
      logo: "",
      primaryColor: "#33C3F0",
      secondaryColor: "#0FA0CE",
      accentColor: "#FF6B35",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "Inter"
    };
    setThemeSettings(defaultTheme);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Identité du Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={themeSettings.siteName}
                onChange={(e) => setThemeSettings(prev => ({ 
                  ...prev, 
                  siteName: e.target.value 
                }))}
                placeholder="Nom de votre site"
              />
            </div>
            
            <div>
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo"
                  value={themeSettings.logo}
                  onChange={(e) => setThemeSettings(prev => ({ 
                    ...prev, 
                    logo: e.target.value 
                  }))}
                  placeholder="URL du logo ou chemin vers le fichier"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {themeSettings.logo && (
                <div className="mt-2">
                  <img 
                    src={themeSettings.logo} 
                    alt="Aperçu du logo" 
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Palette de Couleurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Couleur Principale</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={themeSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  value={themeSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#33C3F0"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">Couleur Secondaire</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={themeSettings.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  value={themeSettings.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  placeholder="#0FA0CE"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accentColor">Couleur d'Accent</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={themeSettings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  value={themeSettings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  placeholder="#FF6B35"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundColor">Arrière-plan</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={themeSettings.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1 rounded"
                />
                <Input
                  value={themeSettings.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typographie</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="fontFamily">Police de caractère</Label>
            <select 
              id="fontFamily"
              value={themeSettings.fontFamily}
              onChange={(e) => setThemeSettings(prev => ({ 
                ...prev, 
                fontFamily: e.target.value 
              }))}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu en Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              fontFamily: themeSettings.fontFamily
            }}
          >
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: themeSettings.primaryColor }}
            >
              {themeSettings.siteName}
            </h2>
            <p className="mb-4">
              Voici un aperçu de votre thème avec les couleurs sélectionnées.
            </p>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: themeSettings.primaryColor }}
              >
                Bouton Principal
              </button>
              <button 
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: themeSettings.secondaryColor }}
              >
                Bouton Secondaire
              </button>
              <button 
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: themeSettings.accentColor }}
              >
                Accent
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetToDefault}
        >
          Réinitialiser
        </Button>
        <Button
          onClick={saveThemeSettings}
          className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
        >
          Enregistrer le Thème
        </Button>
      </div>
    </div>
  );
};

export default ThemeManagement;
