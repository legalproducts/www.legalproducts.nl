// src/components/TrustBadges.tsx
import { FaStar, FaCode, FaServer, FaLaptopCode } from 'react-icons/fa';

const TrustBadges = () => {
  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Vertrouwd door servers</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Waarom zou u voor onze scripts kiezen?
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white">
                <FaCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Geoptimaliseerde code</h3>
              <p className="mt-2 text-base text-gray-500">
              Alle scripts zijn grondig geoptimaliseerd om minimale serverbelasting en soepele prestaties te garanderen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white">
                <FaServer className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Laag hulpbronnengebruik</h3>
              <p className="mt-2 text-base text-gray-500">
              Onze scripts zijn ontworpen om minimale bronnen te gebruiken en toch maximale functionaliteit te bieden.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white">
                <FaLaptopCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Voortdurende ondersteuning</h3>
              <p className="mt-2 text-base text-gray-500">
              Koop het eenmalig en ontvang updates en ondersteuning via onze toegewijde Discord-community.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white">
                <FaStar className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Hoge beoordelingen</h3>
              <p className="mt-2 text-base text-gray-500">
              Sluit u aan bij honderden tevreden klanten die onze scripts gemiddeld met een 4,8/5 hebben beoordeeld.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;