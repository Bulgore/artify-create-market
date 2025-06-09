
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface MultilingualInputProps {
  label: string;
  type?: 'input' | 'textarea';
  value: {
    fr?: string;
    en?: string;
    ty?: string;
  };
  onChange: (value: { fr?: string; en?: string; ty?: string }) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export const MultilingualInput: React.FC<MultilingualInputProps> = ({
  label,
  type = 'input',
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4
}) => {
  const { t } = useLanguage();

  const handleChange = (lang: 'fr' | 'en' | 'ty', newValue: string) => {
    onChange({
      ...value,
      [lang]: newValue
    });
  };

  const languages = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'ty' as const, name: 'Reo Tahiti', flag: '🇵🇫' },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Tabs defaultValue="fr" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          {languages.map((lang) => (
            <TabsTrigger
              key={lang.code}
              value={lang.code}
              className="flex items-center gap-1 text-xs"
            >
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {languages.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-2">
            {type === 'textarea' ? (
              <Textarea
                value={value[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={`${placeholder} (${lang.name})`}
                rows={rows}
                className="w-full"
              />
            ) : (
              <Input
                value={value[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={`${placeholder} (${lang.name})`}
                className="w-full"
              />
            )}
            {lang.code === 'fr' && required && (
              <p className="text-xs text-gray-500 mt-1">
                {t('form.french_required', 'Le français est obligatoire')}
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
