import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';

const socialLinks = [
  { href: 'https://www.facebook.com/thefastbird.co', icon: FaFacebook, label: 'Facebook' },
  { href: 'https://www.tiktok.com/@thefastbird.co', icon: FaTiktok, label: 'TikTok' },
  { href: 'https://www.youtube.com/@TheFastBird-co', icon: FaYoutube, label: 'YouTube' },
  { href: 'https://x.com/TheFastBirdco', icon: FaTwitter, label: 'Twitter' },
];

const Footer: React.FC = () => {
    const { t } = useLocalization();

    const footerLinks = [
        { path: '/terms', label: 'nav.terms' },
        { path: '/privacy', label: 'nav.privacy' },
        { path: '/contact', label: 'nav.contact' },
    ];
    
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center my-6 space-x-6 rtl:space-x-reverse">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors duration-300">
                <link.icon className="h-8 w-8" />
                <span className="sr-only">{link.label}</span>
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse border-t border-b border-gray-700 py-4 w-full max-w-lg my-4">
              {footerLinks.map((link) => (
                <Link key={link.label} to={link.path} className="text-gray-300 hover:text-primary transition-colors duration-300 text-sm">
                  {t(link.label)}
                </Link>
              ))}
          </div>
          <div className="text-sm text-gray-400">
            <p>+ All rights reserved to The Fast Bird (c) 2020</p>
            <p>
              {t('footer.credit')}
              <a href="https://www.hamzahilal.art/#contact" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                HAMZA Hilal
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Dummy react-icons components to satisfy TS
const FaIcon: React.FC<{className: string}> = ({className}) => <svg className={className}></svg>;
const dFaFacebook = () => <FaIcon className="facebook"/>;
const dFaTiktok = () => <FaIcon className="tiktok"/>;
const dFaYoutube = () => <FaIcon className="youtube"/>;
const dFaTwitter = () => <FaIcon className="twitter"/>;


export default Footer;