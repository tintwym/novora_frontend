import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export default function Pricing({ onOpenTrial, onOpenDemo }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [interactiveSeats, setInteractiveSeats] = useState(40);

  // Math variables
  const seatPrice = billingPeriod === 'annual' ? 7 : 8;
  const totalCost = interactiveSeats * seatPrice;

  const plans = [
    {
      name: 'Growth',
      price: billingPeriod === 'annual' ? 4 : 5,
      limit: 'Up to 25 employees',
      description: 'Perfect for early-stage startups establishing solid HR records and basic leave tracking.',
      features: [
        'Central Employee Directory',
        'Mobile Employee Portal',
        'Basic Leave & Absence manager',
        'Digital documents vault',
        'Standard Email support'
      ],
      ctaText: 'Start Free Trial',
      action: onOpenTrial,
      highlighted: false
    },
    {
      name: 'Pro',
      price: billingPeriod === 'annual' ? 7 : 8,
      limit: 'Up to 150 employees',
      description: 'The standard choice for growing businesses seeking biometric clock-in syncs and direct-bank payroll.',
      features: [
        'Everything in Growth',
        'Biometric Terminal integrations',
        'Direct-Bank automated Payroll Runs',
        'Performance Evaluation matrices',
        'Continuous team feedback tools',
        'Priority 24/7 Slack support'
      ],
      ctaText: 'Start Free Trial',
      action: onOpenTrial,
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      limit: 'Unlimited employees',
      description: 'Custom setups for large organizations with advanced access controls, compliance rules, and dedicated database nodes.',
      features: [
        'Everything in Pro',
        'Dedicated secure AWS/GCP database node',
        'Custom localized tax formulas',
        'Single Sign-On (SAML, Okta, AzureAD)',
        'Active Directory sync scheduler',
        'Dedicated Onboarding Account Engineer'
      ],
      ctaText: 'Contact Sales',
      action: onOpenDemo,
      highlighted: false
    }
  ];

  return (
    <div id="pricing" className="py-20 bg-slate-50 border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Predictable billing scaled to fits businesses of all sizes.
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Choose a fixed package or estimate your custom company seat size below. No hidden fees. Lock in the annual savings discount today.
          </p>

          {/* Monthly / Annual Switcher */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-semibold ${billingPeriod === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly Billing</span>
            <button
              type="button"
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-11 h-6 bg-slate-900 rounded-full p-1 cursor-pointer transition-colors"
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${billingPeriod === 'annual' ? 'translate-x-5' : ''}`} />
            </button>
            <span className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${billingPeriod === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>Annual Billing</span>
              <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-200">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col justify-between relative transition-all ${
                plan.highlighted 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-100 md:scale-[1.03] z-10' 
                  : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200 hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${plan.highlighted ? 'text-blue-400' : 'text-slate-500'}`}>
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-3xl font-black tracking-tight">${plan.price}</span>
                        <span className={`text-xs ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>/employee/mo</span>
                      </>
                    ) : (
                      <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                    )}
                  </div>
                  <p className={`text-[10px] font-semibold mt-0.5 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.limit}</p>
                </div>

                <p className={`text-xs leading-relaxed ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

                <div className={`border-t pt-4 ${plan.highlighted ? 'border-slate-800' : 'border-slate-100'} space-y-2.5`}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-650'}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={plan.action}
                className={`w-full mt-8 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer text-center ${
                  plan.highlighted 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic Seat Price Calculator slider */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between shadow-sm">
          <div className="flex-1 space-y-4 w-full">
            <div>
              <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                Custom Estimator
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Need a custom quote for specific seats?</h4>
              <p className="text-xs text-slate-500">Drag the slider below to calculate precise monthly pricing for your exact staff count.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Calculated Seats:</span>
                <span className="font-mono text-slate-900 font-bold bg-slate-50 px-2 py-0.5 border rounded border-slate-100">{interactiveSeats} Employees</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={interactiveSeats}
                onChange={(e) => setInteractiveSeats(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Cost result badge */}
          <div className="w-full sm:w-[220px] bg-slate-900 text-slate-100 rounded-xl p-5 text-center shrink-0 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Billing</p>
              <p className="text-2xl font-black text-white mt-1">${totalCost.toLocaleString()}<span className="text-xs text-slate-400 font-medium">/mo</span></p>
              <p className="text-[10px] text-blue-400 mt-1 font-semibold">Billed {billingPeriod}</p>
            </div>
            
            <button
              type="button"
              onClick={onOpenTrial}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-[11px] transition-colors w-full cursor-pointer flex items-center justify-center gap-0.5"
            >
              Lock in price <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
