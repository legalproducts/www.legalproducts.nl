// src/components/Footer.tsx
import Link from 'next/link';
import { FaDiscord, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              <img src="/Legalround.png" alt="FS Logo" />
              </div>
              <span className="text-white text-xl font-bold">Legal Products</span>
            </div>
            <p className="text-gray-400 text-base">
            Hoogwaardige, geoptimaliseerde scripts voor uw FiveM-server. Verbeter de gameplay, verbeter de prestaties en creëer unieke ervaringen voor uw spelers.
            </p>
            <div className="flex space-x-6">
              <a href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-6 w-6" />
              </a>
              <a href="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://youtube.com/your-youtube" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <FaYoutube className="h-6 w-6" />
              </a>
              <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Producten
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/products?category=scripts" className="text-base text-gray-400 hover:text-white">
                      Scripts
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=maps" className="text-base text-gray-400 hover:text-white">
                      Maps
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=vehicles" className="text-base text-gray-400 hover:text-white">
                    Vehicles
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=esx" className="text-base text-gray-400 hover:text-white">
                      ESX Resources
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer" className="text-base text-gray-400 hover:text-white">
                      Discord Support
                    </a>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                    Documentatie
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                    Veelgestelde vragen
                    </Link>
                  </li>
                  <li>
                    <Link href="#contact" className="text-base text-gray-400 hover:text-white">
                    Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Community
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                      Showcase
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-400 hover:text-white">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {year} Legal Products Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;