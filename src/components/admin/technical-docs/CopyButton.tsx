
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CopyButtonProps {
  text: string;
  label: string;
}

const CopyButton = ({ text, label }: CopyButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => copyToClipboard(text, label)}
      className="ml-2"
    >
      <Copy className="h-4 w-4" />
      {copied === label ? "Copié !" : "Copier"}
    </Button>
  );
};

export default CopyButton;
