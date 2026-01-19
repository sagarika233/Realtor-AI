import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Unlimited AI calls",
  "Custom conversation scripts",
  "CRM integration",
  "Call recordings & transcripts",
  "Priority support",
  "Dedicated account manager",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                Pricing
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Custom Plans for Every Team
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We tailor pricing based on your call volume and team size. 
                Get a personalized quote in minutes.
              </p>
              
              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-xl text-center">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                    Enterprise Ready
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    Get Your Custom Quote
                  </h3>
                  <p className="text-muted-foreground">
                    Pricing scales with your needs
                  </p>
                </div>

                <div className="border-t border-border pt-6 mb-6">
                  <div className="text-muted-foreground text-sm mb-4">
                    Includes everything you need:
                  </div>
                  <div className="space-y-2 text-left">
                    {["Volume-based pricing", "Team size flexibility", "Dedicated support"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-foreground text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-glow"
                >
                  Book a Private Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
