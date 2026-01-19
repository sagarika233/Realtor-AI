import { motion } from "framer-motion";
import { Zap, Clock, Bot, Headphones, UserX, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Never Miss a Lead",
    description: "Every website visitor gets an instant response, day or night.",
  },
  {
    icon: Clock,
    title: "Calls in 10 Seconds",
    description: "Speed to lead is everything. We call faster than any human team.",
  },
  {
    icon: Bot,
    title: "Human-Like AI Voice",
    description: "Natural conversations that prospects actually enjoy.",
  },
  {
    icon: Headphones,
    title: "Works 24/7",
    description: "Weekends, holidays, midnight—your AI never sleeps.",
  },
  {
    icon: UserX,
    title: "No Hiring Required",
    description: "Skip the recruiting, training, and management headaches.",
  },
  {
    icon: TrendingUp,
    title: "Higher Conversions",
    description: "Outperform traditional forms with real-time engagement.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/50">
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
            Key Benefits
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Realtors Love Our AI Agent
          </h2>
          <p className="text-lg text-muted-foreground">
            Designed specifically for real estate professionals who want to close more deals.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl border border-border p-8 transition-all duration-300 hover:shadow-xl hover:border-accent/30 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <benefit.icon className="w-7 h-7 text-accent" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
