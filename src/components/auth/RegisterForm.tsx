
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { validateEmail, validatePassword, validateUsername } from "@/utils/secureValidation";

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string; fullName: string; role: string }) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("créateur");
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch("password");

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, role: selectedRole });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          placeholder="Votre nom complet"
          {...register("fullName", {
            required: "Le nom est requis",
            validate: (value) => {
              const validation = validateUsername(value);
              return validation.isValid || validation.message;
            }
          })}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email", {
            required: "L'email est requis",
            validate: (value) => validateEmail(value) || "Format d'email invalide"
          })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial"
            {...register("password", {
              required: "Le mot de passe est requis",
              validate: (value) => {
                const validation = validatePassword(value);
                return validation.isValid || validation.message;
              }
            })}
            className={errors.password ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message as string}</p>
        )}
        
        {/* Indicateur de force du mot de passe */}
        {password && (
          <div className="text-xs space-y-1">
            <div className="flex gap-1">
              <div className={`h-1 w-full rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`h-1 w-full rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`h-1 w-full rounded ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`h-1 w-full rounded ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`h-1 w-full rounded ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <p className="text-gray-600">
              Doit contenir: 8+ caractères, majuscule, minuscule, chiffre, caractère spécial
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Je suis un(e)</Label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="créateur">Créateur - Je veux vendre mes designs</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Note: Seul le rôle créateur est disponible dans la version 2.0
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-artify-orange hover:bg-artify-orange/90"
        disabled={isLoading}
      >
        {isLoading ? "Création du compte..." : "Créer mon compte"}
      </Button>
    </form>
  );
};

export default RegisterForm;
