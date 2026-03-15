import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { supabase } from '../supabaseClient';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: 'Apartment',
    budget: '$300k – $500k',
    preferred_location: '',
    timeline: '1–3 months',
    intent: 'Buy',
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'YOUR_MAKE_WEBHOOK_URL_HERE';

  const budgetConfig = {
    Buy: {
      label: 'Budget Range',
      options: ['$100k – $300k', '$300k – $500k', '$500k – $800k', '$800k+']
    },
    Sell: {
      label: 'Estimated Property Value',
      options: ['$200k – $400k', '$400k – $700k', '$700k – $1M', '$1M+']
    },
    Rent: {
      label: 'Monthly Rent Budget',
      options: ['$500 – $1000', '$1000 – $1500', '$1500 – $2500', '$2500+']
    },
    default: {
      label: 'Budget',
      options: ['$100k – $300k', '$300k – $500k', '$500k – $800k', '$800k+']
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'intent') {
      const firstOption = budgetConfig[value]?.options[0] || budgetConfig.default.options[0];
      setFormData({
        ...formData,
        [name]: value,
        budget: firstOption
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate phone: must have at least 10 digits total (including country code)
  const isValidPhone = (phone) => {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, '');
    // international numbers are usually 10-15 digits
    return digits.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Normalize phone number to include + if it doesn't have it
    let finalPhone = formData.phone;
    if (finalPhone && !finalPhone.startsWith('+')) {
      finalPhone = '+' + finalPhone;
    }

    // Basic Validation
    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill out all required fields (Name, Phone, Email).');
      setStatus('error');
      return;
    }

    if (!isValidPhone(finalPhone)) {
      setErrorMessage('Please enter a valid phone number with country code.');
      setStatus('error');
      return;
    }

    try {
      // 1. Store data in Supabase - map preferred_location to location
      const { preferred_location, ...otherFormData } = formData;
      const { data, error } = await supabase
        .from('leads')
        .insert([{ 
          ...otherFormData, 
          location: preferred_location,
          phone: finalPhone 
        }]);

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Failed to submit to database. Configuration issue or RLS policy: ${error.message}`);
      }

      // 2. Trigger Make.com Webhook
      if (webhookUrl && webhookUrl !== 'YOUR_MAKE_WEBHOOK_URL_HERE') {
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              phone: finalPhone,
            }),
          });

          if (!response.ok) {
            throw new Error('Webhook submission failed');
          }
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          // We still consider it a success if Supabase worked, but maybe warn
        }
      }

      // 3. Set success state
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        property_type: 'Apartment',
        budget: '$300k – $500k',
        preferred_location: '',
        timeline: '1–3 months',
        intent: ''
      });

    } catch (err) {
      setErrorMessage(err.message || 'An error occurred. Please try again later.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center max-w-lg mx-auto border-green-500 border-2">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Request Received</h2>
        <p className="text-[#94a3b8] text-lg">Our AI agent will call you shortly.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Experience the <span className="text-gradient">Magic</span> Yourself</h2>
        <p className="text-[#94a3b8]">Fill out the form below and our AI will call you back instantly.</p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Full Name *</label>
          <input
            type="text" name="name" required
            value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Phone Number *</label>
            <PhoneInput
              country={'us'}
              preferredCountries={['us', 'in', 'gb', 'au', 'ca']}
              enableSearch={true}
              searchPlaceholder="Search country..."
              value={formData.phone}
              onChange={(value) =>
                setFormData({ ...formData, phone: value })
              }
              inputClass="phone-input-field"
              buttonClass="phone-flag-btn"
              dropdownClass="phone-dropdown"
              searchClass="phone-search"
              containerClass="phone-container"
              inputProps={{
                name: 'phone',
                required: true,
              }}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#e2e8f0] mb-1">What are you looking to do? *</label>
            <div className="relative">
              <select
                id="intent" name="intent" required
                value={formData.intent} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">Select an option</option>
                <option value="Buy">Buy a Home</option>
                <option value="Sell">Sell a Property</option>
                <option value="Rent">Rent a Home</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Email Address *</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Property Type</label>
            <div className="relative">
              <select
                name="property_type"
                value={formData.property_type} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Land">Land</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#e2e8f0] mb-1">
              {budgetConfig[formData.intent]?.label || budgetConfig.default.label}
            </label>
            <div className="relative">
              <select
                name="budget"
                value={formData.budget} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all appearance-none cursor-pointer pr-10"
              >
                {(budgetConfig[formData.intent]?.options || budgetConfig.default.options).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Preferred Location</label>
          <input
            type="text" name="preferred_location"
            value={formData.preferred_location} onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all"
            placeholder="City, Neighborhood, or Zip Code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e2e8f0] mb-1">Buying Timeline</label>
          <div className="relative">
            <select
              name="timeline"
              value={formData.timeline} onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="Immediately">Immediately</option>
              <option value="1–3 months">1–3 Months</option>
              <option value="3–6 months">3–6 Months</option>
              <option value="Just exploring">Just exploring</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-full font-bold text-white transition-all transform flex items-center justify-center gap-2 ${status === 'loading' ? 'bg-[#4f46e5]/50 cursor-not-allowed' : 'bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] hover:scale-[1.02] shadow-[0_4px_15px_rgba(79,70,229,0.4)]'}`}
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </>
          ) : (
            'Get an Instant AI Call'
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
