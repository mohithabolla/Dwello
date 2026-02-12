import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';

const data = [
  { center: 'Civil', planned: 450, actual: 480 },
  { center: 'Steel', planned: 1200, actual: 600 },
  { center: 'MEP', planned: 800, actual: 50 },
  { center: 'Exterior', planned: 600, actual: 0 },
  { center: 'Interior', planned: 950, actual: 0 },
];

const BudgetPlanning: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn h-full pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-dwello-indigo dark:text-dwello-silk tracking-tighter">Financial Ledger</h1>
          <p className="text-dwello-grape/70 font-medium">Real-time capital allocation and expenditure tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border-2 border-dwello-indigo/10 text-dwello-indigo px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dwello-parchment transition-colors">Download PDF</button>
          <button className="bg-dwello-indigo text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-dwello-indigo/20 hover:scale-[1.02] transition-all">Approve Requisition</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Projected Budget', value: '$4.2M', sub: 'Total Estimates' },
          { label: 'Actual Expenditure', value: '$1.8M', sub: '42.8% Utilized' },
          { label: 'Variance Margin', value: '+2.4%', sub: 'Overspent Forecast' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-dwello-lilac/10 shadow-sm flex flex-col justify-between h-44">
            <span className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-dwello-indigo tracking-tighter dark:text-dwello-parchment">{stat.value}</span>
              <span className="text-xs font-bold text-dwello-grape/60">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[48px] border border-dwello-lilac/20 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk">Variance Spectrum</h2>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-dwello-indigo"></div> Actual</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-dwello-parchment"></div> Planned</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="center" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} tickFormatter={(value) => `$${value}k`} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="planned" fill="#f1f5f9" radius={[10, 10, 0, 0]} />
                <Bar dataKey="actual" fill="#22223b" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.actual > entry.planned ? '#ef4444' : '#22223b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dwello-indigo p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-dwello-silk/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-dwello-silk/20 transition-all duration-500"></div>
          <h2 className="text-2xl font-black text-dwello-silk mb-2">Liquidity Projection</h2>
          <p className="text-dwello-parchment/60 text-xs font-bold mb-10 uppercase tracking-widest">30-Day Automated Forecast</p>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { day: 'Day 1', val: 100 }, { day: 'Day 5', val: 80 }, { day: 'Day 10', val: 75 },
                { day: 'Day 15', val: 90 }, { day: 'Day 20', val: 60 }, { day: 'Day 25', val: 40 }, { day: 'Day 30', val: 20 }
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc900" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffc900" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: '#22223b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="val" stroke="#ffc900" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-dwello-parchment/50 tracking-widest mb-1">Burn Rate</p>
              <p className="text-3xl font-black text-white">$14.2k <span className="text-xs text-dwello-silk">/ day</span></p>
            </div>
            <button className="bg-dwello-silk text-dwello-indigo px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
              Lock Capital
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[48px] border border-dwello-lilac/20">
        <h2 className="text-2xl font-black text-dwello-indigo dark:text-dwello-silk mb-10">Expenditure Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-dwello-parchment">
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Cost Center</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Allocated</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Expended</th>
                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Status</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-dwello-lilac">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dwello-parchment">
              {data.map((row, i) => (
                <tr key={i} className="group hover:bg-dwello-parchment/10 transition-colors">
                  <td className="py-6 font-bold text-dwello-indigo dark:text-dwello-parchment">{row.center}</td>
                  <td className="py-6 text-sm font-medium text-dwello-grape">${row.planned}k</td>
                  <td className="py-6 text-sm font-medium text-dwello-indigo dark:text-white">${row.actual}k</td>
                  <td className="py-6">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${row.actual > row.planned ? 'bg-red-100 text-red-600' :
                        row.actual > 0 ? 'bg-green-100 text-green-600' : 'bg-dwello-parchment text-dwello-indigo'
                      }`}>
                      {row.actual > row.planned ? 'Exceeded' : row.actual > 0 ? 'On-track' : 'Planned'}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    <button className="text-[10px] font-black uppercase tracking-widest text-dwello-lilac hover:text-dwello-indigo transition-colors font-bold">Audit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;
