
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Palette } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth(); // Utilisation de signOut au lieu de logout
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-orange-600">
                {t('site.title', 'Podsleek')}
              </span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                to="/products"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('nav.products', 'Produits')}
              </Link>
              <Link
                to="/artists"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('nav.artists', 'Artistes')}
              </Link>
              <Link
                to="/page/about"
                className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('nav.about', 'À propos')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('nav.profile', 'Profil')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/studio" className="flex items-center cursor-pointer">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>{t('nav.studio', 'Studio')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('nav.admin', 'Administration')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('button.logout', 'Déconnexion')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/auth">{t('button.login', 'Connexion')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">{t('button.register', 'S\'inscrire')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
