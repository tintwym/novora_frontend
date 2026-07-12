import { useState } from 'react';
import { TrendingUp, Clock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ROICalculator() {
  const [employees, setEmployees] = useState(65);
  const [hoursPerEmp, setHoursPerEmp] = useState(6);

  // Math logic
  // Typically manual HR tasks takes 6 hours per employee per month in administrative burden (leaves, payroll, manual attendance logs checking, reviews, profiles setup).
  // Novora HRMS automates 80% of this time.
  const hoursSavedPerMonth = Math.round(employees * hoursPerEmp * 0.80);
  // Average HR manager cost is $35/hour
  const estimatedDollarsSaved = Math.round(hoursSavedPerMonth * 35);
  // Manual payroll errors occur ~3.5% of the time, Novora reduces that down to 0.05%
  const accuracyIncrease = "99.95%";
  // ROI percentage
  const pricingCostPerUser = 7; // Pro pricing is $7
  const estimatedCost = employees * pricingCostPerUser;
  const roiMultiplier = estimatedCost > 0 ? ((estimatedDollarsSaved - estimatedCost) / estimatedCost) * 100 : 0;

  return (
    <div id="roi-calculator" className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 font-sans">
      
      {/* Input Sliders */}
      <div className="flex-1 space-y-6">
        <div>
          <span className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-150 flex items-center gap-1.5 w-fit shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className="bg-linear-to-r from-cyan-600 via-lime-600 to-orange-500 bg-clip-text text-transparent font-extrabold">ROI Calculator</span>
          </span>
          <h4 className="text-xl font-bold text-slate-900 mt-2.5">Estimate your organization's savings</h4>
          <p className="text-sm text-slate-500 mt-1">Drag the sliders below to calculate the impact Novora can have on your internal HR operations and overhead expenses.</p>
        </div>

        {/* Slider 1: Employee count */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Employees</label>
            <span className="text-lg font-bold text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{employees} team members</span>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={employees}
            onChange={(e) => setEmployees(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5 Employees</span>
            <span>250 Employees</span>
            <span>500+ Employees</span>
          </div>
        </div>

        {/* Slider 2: Hours spent */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Manual HR Work/Employee/Mo</label>
            <span className="text-lg font-bold text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{hoursPerEmp} Hours</span>
          </div>
          <p className="text-[10px] text-slate-400">Includes leave logging, payroll approvals, checking biometric clock-ins, onboarding and feedback reviews.</p>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={hoursPerEmp}
            onChange={(e) => setHoursPerEmp(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>2 hrs/mo (Low)</span>
            <span>10 hrs/mo (Avg)</span>
            <span>20 hrs/mo (High)</span>
          </div>
        </div>

        {/* Footnote benefit details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-800">Biometric & Attendance Auto-Sync</p>
            <p className="text-[11px] text-slate-500 mt-0.5">By directly tying biometric hardware logs to our automatic payroll calculation module, you completely eliminate manual hours spent verifying timesheets.</p>
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="lg:w-[320px] bg-slate-900 rounded-2xl p-6 text-slate-100 flex flex-col justify-between border border-slate-800 shadow-lg shrink-0">
        <div className="space-y-5">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Value</h5>

          {/* Metric 1: Hours Saved - Cyan */}
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Admin Time Reclaimed</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{hoursSavedPerMonth}</span>
              <span className="text-xs text-slate-400">hours / mo saved</span>
            </div>
          </div>

          {/* Metric 2: Dollars Saved - Orange */}
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Administrative Cost Saved</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">${estimatedDollarsSaved.toLocaleString()}</span>
              <span className="text-xs text-orange-400 font-semibold">/ mo back</span>
            </div>
          </div>

          {/* Metric 3: Accuracy Guarantee - Lime Green */}
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-lime-400" /> Payroll Accuracy Rate</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{accuracyIncrease}</span>
              <span className="text-xs text-lime-400 font-semibold">No errors</span>
            </div>
          </div>
        </div>

        {/* ROI summary card */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Estimated ROI:</span>
            <span className="font-bold text-cyan-400">+{Math.round(roiMultiplier)}%</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on an estimated Novora licensing cost of only <span className="text-slate-300 font-semibold">${estimatedCost}/mo</span> for {employees} seats.</p>
        </div>
      </div>

    </div>
  );
}
