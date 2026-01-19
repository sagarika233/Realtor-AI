import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-primary-foreground">
                Realtor AI
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              AI-powered lead qualification and appointment booking for real estate professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {["Features", "How It Works", "Pricing", "Demo"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Mail className="w-4 h-4" />
                hello@realtorai.com
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <MapPin className="w-4 h-4" />
                Miami, Florida
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">
            © 2024 Realtor AI Agent. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-primary-foreground/40 hover:text-primary-foreground transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
