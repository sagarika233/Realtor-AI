import { motion } from "framer-motion";
import { Zap, Calendar, TrendingUp, Clock } from "lucide-react";

const results = [
  {
    icon: Zap,
    metric: "10x",
    label: "Faster Response",
    description: "Leads are called in seconds, not hours",
  },
  {
    icon: Calendar,
    metric: "3x",
    label: "More Appointments",
    description: "Automated booking fills your calendar",
  },
  {
    icon: TrendingUp,
    metric: "40%",
    label: "Higher Close Rates",
    description: "Better qualified leads close faster",
  },
  {
    icon: Clock,
    metric: "80%",
    label: "Less Manual Work",
    description: "Focus on selling, not chasing leads",
  },
];

const Results = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
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
            Results
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Real Impact on Your Business
          </h2>
          <p className="text-lg text-muted-foreground">
            See the measurable improvements our clients experience.
          </p>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <result.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="font-display text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 mb-2">
                {result.metric}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {result.label}
              </h3>
              <p className="text-muted-foreground text-sm">
                {result.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
