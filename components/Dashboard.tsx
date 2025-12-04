import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

const COLORS = ['#ef4444', '#10b981']; // Red for Fraud, Green for Legitimate

const Dashboard: React.FC = () => {
  // Aggregate data for Pie Chart
  const totalFraud = MOCK_CHART_DATA.reduce((acc, curr) => acc + curr.fraud, 0);
  const totalLegit = MOCK_CHART_DATA.reduce((acc, curr) => acc + curr.legitimate, 0);
  
  const pieData = [
    { name: 'Мошенничество', value: totalFraud },
    { name: 'Нормальные', value: totalLegit },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Обзор Транзакций</h1>
        <p className="text-slate-500 mt-2">Аналитика по датасету Synthetic Financial Log</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">ВСЕГО ОПЕРАЦИЙ</span>
            <Activity className="text-blue-500 h-5 w-5" />
          </div>
          <span className="text-2xl font-bold text-slate-800">6.3M</span>
          <span className="text-xs text-green-500 mt-1 flex items-center">
            <TrendingUp size={12} className="mr-1"/> +12% к прошлому месяцу
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">МОШЕННИЧЕСТВО</span>
            <AlertTriangle className="text-red-500 h-5 w-5" />
          </div>
          <span className="text-2xl font-bold text-slate-800">8,213</span>
          <span className="text-xs text-red-500 mt-1">
            0.13% от общего объема
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">УСПЕШНЫЕ ПРОВЕРКИ</span>
            <CheckCircle className="text-emerald-500 h-5 w-5" />
          </div>
          <span className="text-2xl font-bold text-slate-800">99.8%</span>
          <span className="text-xs text-slate-400 mt-1">
             Точность обнаружения
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">СРЕДНИЙ УЩЕРБ</span>
            <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded">TRANSFER</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">$1.4M</span>
          <span className="text-xs text-slate-400 mt-1">
            Средняя сумма мошенничества
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Распределение по типам операций</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_CHART_DATA}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="legitimate" name="Нормальные" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="fraud" name="Мошенничество" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Доля мошенничества</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-slate-500 mt-4">
            Примечание: Мошенничество составляет малую долю от общего объема, но наносит критический ущерб.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
