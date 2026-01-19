import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import DemoSection from "@/components/DemoSection";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import WhoItsFor from "@/components/WhoItsFor";
import Results from "@/components/Results";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Features />
      <DemoSection />
      <LeadCaptureForm />
      <WhoItsFor />
      <Results />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
