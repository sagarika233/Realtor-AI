import { motion } from "framer-motion";
import { ClipboardList, Phone, MessageCircle, FileText, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Visitor Fills Form",
    description: "Lead submits their details through your website form",
  },
  {
    icon: Phone,
    title: "AI Calls Instantly",
    description: "Our AI agent calls the lead within 10 seconds",
  },
  {
    icon: MessageCircle,
    title: "Qualifies the Lead",
    description: "AI asks smart qualifying questions naturally",
  },
  {
    icon: FileText,
    title: "Summary Sent",
    description: "Detailed call summary delivered to your inbox",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booked",
    description: "Meeting scheduled directly on your calendar",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            From Lead to Appointment in Minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            A seamless, automated process that works 24/7 so you never miss an opportunity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-accent" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
