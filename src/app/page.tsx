import React from "react"

import Image from "next/image"

import {
  Activity,
  Apple,
  Award,
  Baby,
  Brain,
  Building,
  // Phone,
  Clock,
  Heart,
  Hospital,
  MapPin,
  Microscope,
  School,
  Shield,
  Syringe,
  Thermometer,
  Users,
} from "lucide-react"

import { LoginButton } from "@/components/auth/login-button"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/toggle-theme"

// Navbar Component
const Navbar = () => (
  <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="relative h-10 w-10">
            <Image
              src="/logo.png"
              alt="DHA Logo"
              fill
              sizes="40px"
              priority
              className="object-contain"
            />
          </div>
          <span className="ml-2 text-xl font-semibold">DHA Rawalpindi</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#facilities"
            className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
          >
            Facilities
          </a>
          <a
            href="#services"
            className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
          >
            Services
          </a>
          <a
            href="#programs"
            className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
          >
            Programs
          </a>
          <ThemeToggle />
          <LoginButton asChild>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </div>
  </nav>
)

// Hero Section Component
const HeroSection = () => (
  <div className="relative bg-gradient-to-r from-green-700 to-green-900 pt-20">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Quality Healthcare for All Citizens
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-100">
          Providing comprehensive primary and secondary healthcare services
          across District Rawalpindi through 137 facilities
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            variant="ghost"
            size="lg"
            className="border-white bg-green-600 text-white dark:border-green-900 dark:text-gray-100 hover:bg-white/10"
          >
            Find Nearest Facility
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white bg-green-600 text-white dark:border-gray-700 dark:text-gray-100 hover:bg-white/10"
          >
            Emergency Contacts
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building} number="137" label="Healthcare Facilities" />
        <StatCard icon={Users} number="475+" label="Qualified Doctors" />
        <StatCard icon={Activity} number="600+" label="Hospital Beds" />
        <StatCard icon={Award} number="100%" label="EMR Compliance" />
      </div>
    </div>
  </div>
)

// Stat Card Component
const StatCard = ({
  icon: Icon,
  number,
  label,
}: {
  icon: React.ElementType
  number: string
  label: string
}) => (
  <div className="rounded-lg bg-white/10 dark:bg-slate-900/10 p-6 text-center backdrop-blur-lg">
    <Icon className="mx-auto h-8 w-8 text-white" />
    <div className="mt-4 text-3xl font-bold text-white">{number}</div>
    <div className="mt-1 text-sm text-gray-100">{label}</div>
  </div>
)

// Services Section Component
const ServicesSection = () => (
  <div className="bg-white dark:bg-gray-950 py-24 hide-scrollbar" id="services">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-16 text-center text-3xl font-bold">
        Our Healthcare Services
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ServiceCard
          icon={Heart}
          title="Primary Healthcare"
          description="Comprehensive OPD services, maternal care, and basic health services at BHUs and RHCs"
        />
        <ServiceCard
          icon={Shield}
          title="Preventive Programs"
          description="Vaccination drives, disease control, and public health initiatives"
        />
        <ServiceCard
          icon={Clock}
          title="24/7 Emergency Care"
          description="Round-the-clock emergency services at Tehsil Headquarters (THQ) hospitals, Rural Health Centers (RHC) and selected Basic Health Units (BHUs)"
        />
      </div>
    </div>
  </div>
)

// Service Card Component
const ServiceCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <div className="flex flex-col items-center rounded-xl bg-gray-50 dark:bg-gray-900 p-8 transition-shadow hover:shadow-lg">
    <Icon className="mb-4 h-12 w-12 text-green-600 dark:text-green-400" />
    <h3 className="mb-2 text-xl font-semibold dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
)
const ProgramsSection = () => (
  <div
    className="bg-gray-50 dark:bg-gray-900 py-24 hide-scrollbar"
    id="programs"
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-center text-3xl font-bold">
        Healthcare Programs
      </h2>
      <p className="mx-auto mb-16 max-w-3xl text-center text-gray-600">
        Comprehensive preventive and healthcare programs designed to serve all
        citizens of District Rawalpindi
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ProgramCard
          icon={Syringe}
          title="Extended Program for Immunization (EPI)"
          description="Comprehensive vaccination services for children and mothers, including routine immunization and special campaigns"
          features={[
            "Routine Vaccination",
            "Polio Eradication Initiative",
            "Mobile Vaccination Teams",
            "Cold Chain Management",
          ]}
        />

        <ProgramCard
          icon={Microscope}
          title="TB Control Program"
          description="Diagnosis and treatment of Tuberculosis using the DOTS strategy"
          features={[
            "Free TB Testing",
            "DOTS Treatment",
            "Patient Follow-up",
            "Community Awareness",
          ]}
        />

        <ProgramCard
          icon={Thermometer}
          title="Epidemics Prevention & Control Program"
          description="Comprehensive dengue and other epidemics prevention, surveillance and control measures"
          features={[
            "Vector Surveillance",
            "Spray Programs",
            "Rapid Response Teams",
            "Public Awareness",
          ]}
        />

        <ProgramCard
          icon={Baby}
          title="IRMNCH Services"
          description="Integrated Reproductive, Maternal, Newborn and Child Health services"
          features={[
            "Antenatal Care",
            "Safe Delivery Services",
            "Postnatal Care",
            "Child Growth Monitoring",
          ]}
        />

        <ProgramCard
          icon={Brain}
          title="Non-Communicable Disease Program"
          description="Prevention and control of lifestyle and chronic diseases"
          features={[
            "Diabetes Screening",
            "Hypertension Management",
            "Mental Health Services",
            "Lifestyle Counseling",
          ]}
        />

        <ProgramCard
          icon={Hospital}
          title="Communicable Disease Program"
          description="Surveillance and control of infectious diseases"
          features={[
            "Disease Surveillance",
            "Outbreak Response",
            "Preventive Measures",
            "Community Education",
          ]}
        />

        <ProgramCard
          icon={School}
          title="School Health & Nutrition"
          description="Comprehensive health services for school-going children"
          features={[
            "Health Screening",
            "Nutritional Assessment",
            "Health Education",
            "Vaccination Status Check",
          ]}
        />

        <ProgramCard
          icon={Apple}
          title="Food & Nutrition Program"
          description="Ensuring food safety and improving nutritional status"
          features={[
            "Food Inspection",
            "Nutrition Education",
            "Food Handler Training",
            "Commercial Outlet Inspection",
          ]}
        />

        <ProgramCard
          icon={Shield}
          title="Capacity Building Program"
          description="Training and development through District Health Development Center"
          features={[
            "Staff Training",
            "Quality Improvement",
            "Healthcare Standards",
            "Professional Development",
          ]}
        />
      </div>
    </div>
  </div>
)

// Program Card Component
const ProgramCard = ({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
}) => (
  <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
    <div className="mb-4 flex items-center">
      <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
      <h3 className="ml-3 text-xl font-semibold dark:text-white">{title}</h3>
    </div>
    <p className="mb-4 text-gray-600 dark:text-gray-400">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></div>
          {feature}
        </li>
      ))}
    </ul>
  </div>
) // Find Facility Section Component
const FindFacilitySection = () => (
  <div className="bg-gradient-to-r from-green-700 to-green-900 py-24 text-white hide-scrollbar">
    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-bold">
        Find Your Nearest Health Facility
      </h2>
      <p className="mb-12 text-xl">
        Access quality healthcare at any of our 137 facilities across District
        Rawalpindi
      </p>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
        <LocationCard title="THQ Hospitals" count="7" />
        <LocationCard title="Basic Health Units" count="99" />
        <LocationCard title="Rural Health Centers" count="9" />
      </div>
    </div>
  </div>
)

// Location Card Component
const LocationCard = ({ title, count }: { title: string; count: string }) => (
  <div className="rounded-lg bg-white/10 dark:bg-slate-900/10 p-6 backdrop-blur">
    <MapPin className="mx-auto mb-4 h-8 w-8 text-white" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-2xl font-bold">{count}</p>
  </div>
)

// Main Landing Page Component
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="flex-grow overflow-auto hide-scrollbar">
        <HeroSection />
        <ServicesSection />
        <ProgramsSection />
        <FindFacilitySection />
      </div>
    </>
  )
}
