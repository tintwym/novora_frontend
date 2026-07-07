import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Novora has saved our operations team over 45 hours every month. The absolute highlight is the biometric terminal sync. We used to spend days verifying timesheet punches with manual leave forms. Now, it calculates taxes and pays out in just one click.",
      author: "Elena Rostova",
      role: "HR Operations Director",
      company: "Stark Logistics Corp",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    },
    {
      quote: "As a scaling retail business with 5 distinct physical stores, coordinating shift schedules and clock-ins was an absolute nightmare. Novora's biometric facial recognition sync matched with their native mobile app streamlined our entire scheduling workflow.",
      author: "Marcus Chen",
      role: "VP of People & Culture",
      company: "Moderna Retail Retailers",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    },
    {
      quote: "We migrated our 210-employee engineering agency from legacy spreadsheets in under a day. The automatic leave balances accruals and customizable compliance payroll tax calculations are exceptionally robust. Highly recommend to teams of all sizes.",
      author: "Sarah Jenkins",
      role: "Founder & CEO",
      company: "Apex Tech Labs",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div id="testimonials" className="py-20 bg-slate-50 font-sans border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trusted By Client Logos Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            TRUSTED BY 12,000+ COMPLIANT TEAMS WORLDWIDE
          </p>
          
          {/* Mock Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-6 items-center max-w-4xl mx-auto opacity-55 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center justify-center font-bold text-slate-800 text-sm tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" /> STARK LOGISTICS
            </div>
            <div className="flex items-center justify-center font-bold text-slate-800 text-sm tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" /> MODERNA RETAIL
            </div>
            <div className="flex items-center justify-center font-bold text-slate-800 text-sm tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" /> APEX TECH
            </div>
            <div className="flex items-center justify-center font-bold text-slate-800 text-sm tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" /> MEDICA CARE
            </div>
            <div className="flex items-center justify-center font-bold text-slate-800 text-sm tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" /> FINTECH LABS
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            Verified Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight font-sans">
            Here is what our clients say about Novora HRMS
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            From early stage startups to multi-site retail networks, Novora streamlines operational bottlenecks and drives internal administrative happiness.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Icon */}
                <div className="text-blue-500 opacity-20">
                  <Quote className="w-8 h-8 fill-blue-500" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Author profile */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
                <img
                  src={test.avatarUrl}
                  alt={test.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{test.author}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{test.role}</p>
                  <p className="text-[10px] text-blue-600 font-bold tracking-tight uppercase leading-none mt-1">{test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
