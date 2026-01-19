import { motion } from "framer-motion";
import { Building2, Users, Construction, Key } from "lucide-react";

const audiences = [
  {
    icon: Users,
    title: "Real Estate Agents",
    description: "Convert more website leads without being tied to your phone 24/7.",
  },
  {
    icon: Building2,
    title: "Brokerages",
    description: "Scale your lead response across multiple agents effortlessly.",
  },
  {
    icon: Construction,
    title: "Property Developers",
    description: "Qualify interested buyers for new developments automatically.",
  },
  {
    icon: Key,
    title: "Rental Agencies",
    description: "Screen prospective tenants and schedule viewings instantly.",
  },
];

const WhoItsFor = () => {
  return (
    <section className="py-24 lg:py-32 bg-hero-gradient">
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
            Who It's For
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Built for Real Estate Professionals
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Whether you're an individual agent or managing a large team, our AI scales with your needs.
          </p>
        </motion.div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-primary-foreground/5 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 p-8 text-center transition-all duration-300 hover:bg-primary-foreground/10">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors">
                  <audience.icon className="w-8 h-8 text-accent" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                  {audience.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
