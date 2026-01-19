import { motion } from "framer-motion";
import { Home, CheckCircle, Calendar, Mic, Database, Settings } from "lucide-react";

const features = [
  {
    icon: Home,
    title: "Buyer & Seller Conversations",
    description: "Tailored scripts for both buying and selling scenarios.",
  },
  {
    icon: CheckCircle,
    title: "Lead Qualification",
    description: "Automatically assess budget, timeline, and motivation.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Syncs with your calendar and books meetings directly.",
  },
  {
    icon: Mic,
    title: "Call Recordings",
    description: "Review every conversation with full audio recordings.",
  },
  {
    icon: Database,
    title: "CRM-Ready Summaries",
    description: "Detailed lead data formatted for your CRM system.",
  },
  {
    icon: Settings,
    title: "Custom Scripts",
    description: "Personalized conversation flows for your market.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              AI Agent Features
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Close More Deals
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our AI agent is built specifically for real estate, with features that 
              understand your business and help you convert more leads.
            </p>
            
            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-hero-gradient rounded-3xl p-8 lg:p-12 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-vibrant/10 rounded-full blur-2xl" />
              
              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Call Card */}
                <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <Mic className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="text-primary-foreground font-semibold">
                        AI Agent Speaking
                      </div>
                      <div className="text-primary-foreground/60 text-sm">
                        Call in progress - 2:34
                      </div>
                    </div>
                  </div>
                  
                  {/* Waveform */}
                  <div className="flex items-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-accent/60 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10">
                  <div className="text-sm text-primary-foreground/60 mb-3">
                    Live Call Summary
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80 text-sm">Lead Type</span>
                      <span className="text-primary-foreground font-medium text-sm">Buyer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80 text-sm">Budget</span>
                      <span className="text-primary-foreground font-medium text-sm">$400K - $600K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80 text-sm">Timeline</span>
                      <span className="text-primary-foreground font-medium text-sm">3 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80 text-sm">Location</span>
                      <span className="text-primary-foreground font-medium text-sm">Downtown Miami</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
