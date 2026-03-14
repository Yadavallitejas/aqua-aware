import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Waves, 
  Globe, 
  Users, 
  Factory, 
  Home, 
  ArrowRight, 
  CheckCircle, 
  Activity, 
  BarChart3, 
  BookOpen,
  Sprout,
  CloudRain,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const SliderInput = ({ 
  label, 
  value, 
  setValue, 
  min, 
  max, 
  unit 
}: { 
  label: string, 
  value: number | string, 
  setValue: (val: number | string) => void, 
  min: number, 
  max: number, 
  unit: string 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setValue('');
      return;
    }
    
    let numValue = Number(rawValue);
    if (isNaN(numValue)) return;
    
    // Prevent absurdly large numbers while typing, but don't strictly clamp yet
    if (numValue > max * 10) numValue = max;
    
    setValue(numValue);
  };

  const handleBlur = () => {
    let numValue = Number(value);
    if (isNaN(numValue) || value === '') {
      numValue = min;
    } else {
      // Strictly clamp value on blur
      numValue = Math.max(min, Math.min(max, numValue));
    }
    setValue(numValue);
  };

  return (
    <div>
      <div className="flex justify-between mb-2 items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            min={min} 
            max={max} 
            value={value} 
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-16 px-2 py-1 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-bold text-slate-500 w-10">{unit}</span>
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value === '' ? min : value} 
        onChange={handleInputChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};

const DetailedReportModal = ({ onClose, data }: any) => {
  const pieData = [
    { name: 'Showers', value: Math.round(data.dailyShowers) },
    { name: 'Flushes', value: Math.round(data.dailyFlushes) },
    { name: 'Dishwasher', value: Math.round(data.dailyDishwasher) },
    { name: 'Laundry', value: Math.round(data.dailyLaundry) },
  ].filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#6366f1'];

  const barData = [
    { name: 'Your Usage', gallons: data.totalDaily },
    { name: 'US Average', gallons: 82 },
    { name: 'Target', gallons: 50 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-2xl font-serif font-bold text-slate-900">Your Detailed Water Report</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Breakdown Chart */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-lg font-semibold text-slate-800 mb-6 text-center">Usage Breakdown</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} gallons`, 'Usage']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-lg font-semibold text-slate-800 mb-6 text-center">Historical & Average Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="gallons" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? (entry.gallons > 82 ? '#f97316' : '#3b82f6') : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Actionable Insights</h4>
            <ul className="space-y-4">
              {data.dailyShowers > 30 && (
                <li className="flex gap-3 text-blue-800">
                  <div className="mt-1 shrink-0"><Droplet className="w-5 h-5 text-blue-600" /></div>
                  <p><strong>Showers:</strong> Your shower usage is high. Installing a low-flow showerhead can save up to 15 gallons per 10-minute shower.</p>
                </li>
              )}
              {data.dailyFlushes > 15 && (
                <li className="flex gap-3 text-blue-800">
                  <div className="mt-1 shrink-0"><Droplet className="w-5 h-5 text-blue-600" /></div>
                  <p><strong>Toilets:</strong> Consider upgrading to a dual-flush toilet or placing a displacement device in the tank to save water per flush.</p>
                </li>
              )}
              {data.dailyLaundry > 10 && (
                <li className="flex gap-3 text-blue-800">
                  <div className="mt-1 shrink-0"><Droplet className="w-5 h-5 text-blue-600" /></div>
                  <p><strong>Laundry:</strong> Try to only run full loads of laundry, and if possible, upgrade to a high-efficiency (HE) washing machine.</p>
                </li>
              )}
              {data.totalDaily <= 82 && (
                <li className="flex gap-3 text-emerald-800">
                  <div className="mt-1 shrink-0"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p><strong>Great Job!</strong> You are below the national average. Keep maintaining these water-saving habits.</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const WaterCalculator = () => {
  const [showers, setShowers] = useState<number | string>(10);
  const [flushes, setFlushes] = useState<number | string>(5);
  const [dishwasher, setDishwasher] = useState<number | string>(3);
  const [laundry, setLaundry] = useState<number | string>(2);
  const [showReport, setShowReport] = useState(false);

  // Calculations (Gallons per day)
  const safeShowers = Number(showers) || 0;
  const safeFlushes = Number(flushes) || 0;
  const safeDishwasher = Number(dishwasher) || 0;
  const safeLaundry = Number(laundry) || 0;

  const dailyShowers = safeShowers * 2.1;
  const dailyFlushes = safeFlushes * 1.6;
  const dailyDishwasher = (safeDishwasher * 6) / 7;
  const dailyLaundry = (safeLaundry * 15) / 7;
  
  const totalDaily = Math.round(dailyShowers + dailyFlushes + dailyDishwasher + dailyLaundry);
  
  // Average American uses ~82 gallons per day at home
  const isAboveAverage = totalDaily > 82;

  return (
    <div className="mt-24 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Personal Footprint Calculator</h3>
          <p className="text-slate-600 mb-8">Estimate your daily water usage by adjusting the sliders below.</p>
          
          <div className="space-y-6">
            <SliderInput 
              label="Showers (minutes/day)" 
              value={showers} 
              setValue={setShowers} 
              min={0} 
              max={60} 
              unit="min" 
            />
            
            <SliderInput 
              label="Toilet Flushes (per day)" 
              value={flushes} 
              setValue={setFlushes} 
              min={0} 
              max={20} 
              unit="times" 
            />
            
            <SliderInput 
              label="Dishwasher (loads/week)" 
              value={dishwasher} 
              setValue={setDishwasher} 
              min={0} 
              max={14} 
              unit="loads" 
            />
            
            <SliderInput 
              label="Laundry (loads/week)" 
              value={laundry} 
              setValue={setLaundry} 
              min={0} 
              max={14} 
              unit="loads" 
            />
          </div>
        </div>
        
        <div className="p-8 md:p-12 bg-slate-900 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Droplet size={200} />
          </div>
          
          <div className="relative z-10">
            <h4 className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Estimated Daily Usage</h4>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-6xl font-bold text-white">{totalDaily}</span>
              <span className="text-xl text-slate-400">gallons</span>
            </div>
            
            <div className={`p-4 rounded-xl mb-6 ${isAboveAverage ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'}`}>
              <div className="flex gap-3 items-start">
                {isAboveAverage ? <Activity className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" /> : <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />}
                <p className="text-sm text-slate-200">
                  {isAboveAverage 
                    ? "You're using more than the average of 82 gallons per day. Consider reducing shower times or running full loads of laundry." 
                    : "Great job! You're using less than the average of 82 gallons per day. Keep up the good work!"}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowReport(true)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              Get Detailed Report
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReport && (
          <DetailedReportModal 
            onClose={() => setShowReport(false)}
            data={{ dailyShowers, dailyFlushes, dailyDishwasher, dailyLaundry, totalDaily }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Droplet size={24} strokeWidth={2.5} />
              </div>
              <span className="font-serif font-bold text-xl text-slate-900">AquaAware</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#crisis" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">The Crisis</a>
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Solutions</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#use-cases" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Use Cases</a>
            </div>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
                Take Action
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1538300342682-ffa5ac837c6e?q=80&w=2940&auto=format&fit=crop" 
            alt="Water surface" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-slate-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase mb-6">
                Global Emergency
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Every Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Counts.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                We are facing an unprecedented global water crisis. Discover the facts, explore innovative solutions, and learn how you can make a difference today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#crisis" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Understand the Crisis
                </a>
                <a href="#solutions" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Explore Solutions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Crisis Section */}
      <section id="crisis" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">The Global Water Crisis</h2>
              <p className="text-lg text-slate-600">
                Water scarcity is not just a future threat; it is a present reality for billions. The combination of climate change, population growth, and poor management is depleting our most precious resource.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-red-500" />,
                stat: "2 Billion",
                title: "Lack Safe Drinking Water",
                desc: "Over a quarter of the global population does not have access to safely managed drinking water services."
              },
              {
                icon: <Globe className="w-8 h-8 text-orange-500" />,
                stat: "40%",
                title: "Global Water Deficit by 2030",
                desc: "If current trends continue, the world will face a 40% shortfall between forecast demand and available supply."
              },
              {
                icon: <Activity className="w-8 h-8 text-purple-500" />,
                stat: "80%",
                title: "Untreated Wastewater",
                desc: "Globally, 80% of wastewater flows back into the ecosystem without being treated or reused."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-full hover:shadow-lg transition-shadow">
                  <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">{item.stat}</h3>
                  <h4 className="text-xl font-semibold text-slate-800 mb-3">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Innovative Solutions for a Thirsty World</h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Addressing the water crisis requires a multi-faceted approach. From grassroots conservation efforts to massive infrastructure projects, we have the tools to secure our water future.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: <CloudRain className="w-6 h-6 text-cyan-400" />,
                      title: "Rainwater Harvesting & Reuse",
                      desc: "Capturing rainwater for agricultural and domestic use reduces dependence on groundwater."
                    },
                    {
                      icon: <Waves className="w-6 h-6 text-blue-400" />,
                      title: "Advanced Desalination",
                      desc: "New, energy-efficient technologies are making it viable to turn ocean water into fresh drinking water."
                    },
                    {
                      icon: <Sprout className="w-6 h-6 text-emerald-400" />,
                      title: "Precision Agriculture",
                      desc: "Smart irrigation systems that use data to deliver exactly the right amount of water to crops."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1 bg-slate-800 p-3 rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            <div className="relative">
              <FadeIn delay={0.3}>
                <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1468421870903-4df1664ac249?q=80&w=2831&auto=format&fit=crop" 
                    alt="Clean water" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent"></div>
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-8 -left-8 bg-white text-slate-900 p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="font-bold text-2xl">30%</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Reduction in water waste possible through smart infrastructure.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">How AquaAware Works</h2>
              <p className="text-lg text-slate-600">
                Our platform connects data, education, and actionable steps to help individuals and organizations reduce their water footprint.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-blue-200 -translate-y-1/2 z-0"></div>

            {[
              {
                step: "01",
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                title: "Educate & Assess",
                desc: "Learn about your local water sources and calculate your current water footprint using our assessment tools."
              },
              {
                step: "02",
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                title: "Track & Monitor",
                desc: "Connect smart meters or manually log usage to visualize your consumption patterns over time."
              },
              {
                step: "03",
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Implement Solutions",
                desc: "Receive personalized recommendations for water-saving technologies and behavioral changes."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-50 mb-6 relative">
                    {item.icon}
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <WaterCalculator />
          </FadeIn>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 md:flex md:justify-between md:items-end">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Who Can Use This?</h2>
                <p className="text-lg text-slate-600">
                  Water conservation is a collective responsibility. Our tools are designed to scale from individual households to massive industrial operations.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Home className="w-6 h-6 text-slate-700" />,
                title: "Households",
                image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop",
                desc: "Track daily usage, find leaks early, and learn simple habits to reduce your family's water bill and environmental impact."
              },
              {
                icon: <Sprout className="w-6 h-6 text-slate-700" />,
                title: "Agriculture",
                image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop",
                desc: "Optimize irrigation schedules based on weather data and soil moisture sensors to maximize crop yield while minimizing water use."
              },
              {
                icon: <Factory className="w-6 h-6 text-slate-700" />,
                title: "Industry & Business",
                image: "https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=2942&auto=format&fit=crop",
                desc: "Audit facility water use, implement recycling systems, and meet corporate sustainability goals (ESG) with detailed reporting."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg">
                      {item.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    <a href="#" className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion / CTA */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Water is Life. Let's Preserve It.
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              The water crisis is daunting, but it is not insurmountable. By combining awareness with action, we can ensure a sustainable water future for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 text-base font-bold rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-lg">
                Start Your Assessment
              </button>
              <button className="px-8 py-4 text-base font-bold rounded-full text-white border-2 border-white/30 hover:bg-white/10 transition-colors">
                Join the Community
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="w-6 h-6 text-blue-500" />
                <span className="font-serif font-bold text-xl text-white">AquaAware</span>
              </div>
              <p className="text-sm max-w-sm">
                Dedicated to educating the public and providing actionable solutions to combat the global water crisis.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Water Calculator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} AquaAware. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
