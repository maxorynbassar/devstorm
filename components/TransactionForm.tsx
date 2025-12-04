import React, { useState } from 'react';
import { TransactionData, TransactionType, RiskAnalysisResult } from '../types';
import { TRANSACTION_TYPES_OPTIONS } from '../constants';
import { analyzeTransaction } from '../services/geminiService';
import { Loader2, ArrowRight, RefreshCw, AlertOctagon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TransactionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TransactionData>({
    step: 1,
    type: TransactionType.TRANSFER,
    amount: 0,
    nameOrig: 'C123456789',
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    nameDest: 'C987654321',
    oldbalanceDest: 0,
    newbalanceDest: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'type' || name.startsWith('name') ? value : parseFloat(value) || 0
    }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeTransaction(formData);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get color based on risk score
  const getRiskColor = (score: number) => {
    if (score > 0.7) return 'bg-red-50 border-red-200 text-red-700';
    if (score > 0.3) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit sticky top-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <ArrowRight className="mr-2 text-blue-500" size={24}/> 
          Параметры Транзакции
        </h2>
        
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Тип операции</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {TRANSACTION_TYPES_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Сумма</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Step (Час)</label>
              <input
                type="number"
                name="step"
                value={formData.step}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Отправитель (Origin)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">ID Отправителя</label>
                <input
                  type="text"
                  name="nameOrig"
                  value={formData.nameOrig}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs text-slate-500 mb-1">Баланс ДО</label>
                  <input
                    type="number"
                    name="oldbalanceOrg"
                    value={formData.oldbalanceOrg}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Баланс ПОСЛЕ</label>
                  <input
                    type="number"
                    name="newbalanceOrig"
                    value={formData.newbalanceOrig}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Получатель (Dest)</h3>
             <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">ID Получателя</label>
                <input
                  type="text"
                  name="nameDest"
                  value={formData.nameDest}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs text-slate-500 mb-1">Баланс ДО</label>
                  <input
                    type="number"
                    name="oldbalanceDest"
                    value={formData.oldbalanceDest}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Баланс ПОСЛЕ</label>
                  <input
                    type="number"
                    name="newbalanceDest"
                    value={formData.newbalanceDest}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Анализирую...
              </>
            ) : (
              <>
                <AlertOctagon className="mr-2" size={20} />
                Оценить риск
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      <div className="lg:col-span-2">
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
                <div className="flex">
                <div className="flex-shrink-0">
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">Ошибка анализа</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
                </div>
            </div>
        )}

        {!result && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <AlertOctagon size={64} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium">Результаты анализа появятся здесь</p>
                <p className="text-sm mt-2 max-w-md text-center">Заполните форму слева и нажмите "Оценить риск", чтобы модель проверила транзакцию на признаки мошенничества.</p>
            </div>
        )}

        {loading && (
             <div className="h-full flex flex-col items-center justify-center p-12">
                 <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                 </div>
                 <p className="mt-6 text-slate-600 font-medium animate-pulse">FraudDetect 2.0 проверяет паттерны...</p>
             </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className={`p-6 border-b ${getRiskColor(result.riskScore)}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{result.verdict}</h2>
                        <p className="opacity-90 font-medium">Уровень риска: {result.riskLevel}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{Math.round(result.riskScore * 100)}%</div>
                        <span className="text-xs uppercase tracking-wide opacity-80">Fraud Score</span>
                    </div>
                </div>
            </div>
            
            <div className="p-8">
                <div className="prose prose-slate max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-4">
                     <ReactMarkdown>{result.rawResponse}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={() => setResult(null)} 
                        className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium transition"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Очистить и проверить новую
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
