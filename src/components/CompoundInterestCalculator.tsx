import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { PiggyBank, TrendingUp, Calculator, BarChart3, BookOpen, GitCompare, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import Icon3D from './ui/Icon3D';
import Tooltip from './ui/Tooltip';
import { useInView } from './ui/useInView';

interface CalculatorData {
  principal: number;
  rate: number;
  time: number;
  frequency: number;
  monthlyContribution: number;
}

interface Results {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
}

interface ChartDataPoint {
  year: number;
  amount1: number;
  principal1: number;
  interest1: number;
  amount2: number;
  principal2: number;
  interest2: number;
  amount3: number;
  principal3: number;
  interest3: number;
}

interface LineVisibility {
  principal1: boolean;
  interest1: boolean;
  principal2: boolean;
  interest2: boolean;
  principal3: boolean;
  interest3: boolean;
}

const CompoundInterestCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scenario1' | 'scenario2' | 'scenario3'>('scenario1');
  const [isIntroCollapsed, setIsIntroCollapsed] = useState(false);
  
  const [scenario1Data, setScenario1Data] = useState<CalculatorData>({
    principal: 10000,
    rate: 5,
    time: 10,
    frequency: 12,
    monthlyContribution: 500
  });

  const [scenario2Data, setScenario2Data] = useState<CalculatorData>({
    principal: 15000,
    rate: 7,
    time: 10,
    frequency: 12,
    monthlyContribution: 300
  });

  const [scenario3Data, setScenario3Data] = useState<CalculatorData>({
    principal: 5000,
    rate: 8,
    time: 10,
    frequency: 12,
    monthlyContribution: 700
  });

  const [scenario1Results, setScenario1Results] = useState<Results>({
    finalAmount: 0,
    totalInterest: 0,
    totalContributions: 0
  });

  const [scenario2Results, setScenario2Results] = useState<Results>({
    finalAmount: 0,
    totalInterest: 0,
    totalContributions: 0
  });

  const [scenario3Results, setScenario3Results] = useState<Results>({
    finalAmount: 0,
    totalInterest: 0,
    totalContributions: 0
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  const [lineVisibility, setLineVisibility] = useState<LineVisibility>({
    principal1: true,
    interest1: true,
    principal2: true,
    interest2: true,
    principal3: true,
    interest3: true,
  });

  const calculateScenario = (data: CalculatorData) => {
    const { principal, rate, time, frequency, monthlyContribution } = data;
    const r = rate / 100;
    
    let amount = principal;
    let totalContributions = principal;
    const yearlyData = [];
    
    for (let year = 0; year <= time; year++) {
      if (year === 0) {
        yearlyData.push({
          year,
          amount: principal,
          principal: totalContributions,
          interest: 0
        });
      } else {
        // Calculate compound interest with monthly contributions
        for (let month = 1; month <= 12; month++) {
          amount = amount * (1 + r / frequency) + monthlyContribution;
        }
        totalContributions += monthlyContribution * 12;
        
        yearlyData.push({
          year,
          amount: Math.round(amount),
          principal: totalContributions,
          interest: Math.round(amount - totalContributions)
        });
      }
    }

    const finalAmount = Math.round(amount);
    const totalInterest = Math.round(amount - totalContributions);

    return {
      results: {
        finalAmount,
        totalInterest,
        totalContributions
      },
      yearlyData
    };
  };

  const calculateAllScenarios = () => {
    const scenario1 = calculateScenario(scenario1Data);
    const scenario2 = calculateScenario(scenario2Data);
    const scenario3 = calculateScenario(scenario3Data);

    setScenario1Results(scenario1.results);
    setScenario2Results(scenario2.results);
    setScenario3Results(scenario3.results);

    // Combine data for chart
    const combinedData: ChartDataPoint[] = [];
    const maxTime = Math.max(scenario1Data.time, scenario2Data.time, scenario3Data.time);

    for (let year = 0; year <= maxTime; year++) {
      const data1 = scenario1.yearlyData.find(d => d.year === year);
      const data2 = scenario2.yearlyData.find(d => d.year === year);
      const data3 = scenario3.yearlyData.find(d => d.year === year);

      combinedData.push({
        year,
        amount1: data1?.amount || 0,
        principal1: data1?.principal || 0,
        interest1: data1?.interest || 0,
        amount2: data2?.amount || 0,
        principal2: data2?.principal || 0,
        interest2: data2?.interest || 0,
        amount3: data3?.amount || 0,
        principal3: data3?.principal || 0,
        interest3: data3?.interest || 0,
      });
    }

    setChartData(combinedData);
  };

  useEffect(() => {
    calculateAllScenarios();
  }, [scenario1Data, scenario2Data, scenario3Data]);

  const handleInputChange = (scenario: 'scenario1' | 'scenario2' | 'scenario3', field: keyof CalculatorData, value: number) => {
    if (scenario === 'scenario1') {
      setScenario1Data(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (scenario === 'scenario2') {
      setScenario2Data(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setScenario3Data(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleLineVisibility = (line: keyof LineVisibility) => {
    setLineVisibility(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <p className="font-medium text-gray-900 dark:text-white mb-3">Ano {label}</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Cenário 1</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.amount1)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Contribuições:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.principal1)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Juros:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.interest1)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Cenário 2</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.amount2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Contribuições:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.principal2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Juros:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.interest2)}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Cenário 3</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.amount3)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Contribuições:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.principal3)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Juros:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.interest3)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCalculatorForm = (scenario: 'scenario1' | 'scenario2' | 'scenario3', data: CalculatorData, title: string) => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Principal Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Capital Inicial
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              €
            </span>
            <input
              type="number"
              value={data.principal}
              onChange={(e) => handleInputChange(scenario, 'principal', Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
              placeholder="10.000"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Taxa de Juro Anual
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={data.rate}
              onChange={(e) => handleInputChange(scenario, 'rate', Number(e.target.value))}
              className="w-full pr-8 pl-4 py-3 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
              placeholder="5.0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              %
            </span>
          </div>
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Período (Anos)
          </label>
          <input
            type="number"
            value={data.time}
            onChange={(e) => handleInputChange(scenario, 'time', Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
            placeholder="10"
          />
        </div>

        {/* Monthly Contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contribuição Mensal
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              €
            </span>
            <input
              type="number"
              value={data.monthlyContribution}
              onChange={(e) => handleInputChange(scenario, 'monthlyContribution', Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
              placeholder="500"
            />
          </div>
        </div>

        {/* Compound Frequency */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência de Capitalização
          </label>
          <select
            value={data.frequency}
            onChange={(e) => handleInputChange(scenario, 'frequency', Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value={1}>Anualmente</option>
            <option value={4}>Trimestralmente</option>
            <option value={12}>Mensalmente</option>
            <option value={365}>Diariamente</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderResults = (results: Results, title: string, colorClass: string) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 border border-opacity-50`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
              Montante Final
            </h5>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(results.finalAmount)}
          </p>
        </div>

        <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 border border-opacity-50`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
              Juros Ganhos
            </h5>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(results.totalInterest)}
          </p>
        </div>

        <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 border border-opacity-50`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
              Total Investido
            </h5>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(results.totalContributions)}
          </p>
        </div>
      </div>
    </div>
  );

  const lineColors = {
    principal1: '#1E40AF', // Blue 800
    interest1: '#3B82F6',  // Blue 500
    principal2: '#047857', // Emerald 800
    interest2: '#10B981',  // Emerald 500
    principal3: '#7C2D12', // Orange 800
    interest3: '#EA580C',  // Orange 500
  };

  const lineLabels = {
    principal1: 'Cenário 1 - Contribuições',
    interest1: 'Cenário 1 - Juros',
    principal2: 'Cenário 2 - Contribuições',
    interest2: 'Cenário 2 - Juros',
    principal3: 'Cenário 3 - Contribuições',
    interest3: 'Cenário 3 - Juros',
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={() => setIsIntroCollapsed(!isIntroCollapsed)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              O que são Juros Compostos?
            </h2>
          </div>
          <div className="p-2 rounded-lg bg-gray-100/60 dark:bg-gray-700/60 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-600/80 transition-colors duration-200">
            {isIntroCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </div>
        </button>
        
        {!isIntroCollapsed && (
          <div className="mt-6 prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Os juros compostos são frequentemente chamados de "oitava maravilha do mundo" porque permitem que o seu dinheiro cresça exponencialmente ao longo do tempo. 
              Ao contrário dos juros simples, onde apenas o capital inicial rende juros, nos juros compostos os juros ganhos também passam a render juros.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Esta calculadora permite-lhe visualizar como pequenas contribuições regulares, combinadas com o poder dos juros compostos, 
              podem transformar-se numa quantia substancial ao longo dos anos. Compare diferentes cenários e descubra como pequenas alterações 
              na taxa de juro ou nas contribuições mensais podem ter um impacto significativo no seu futuro financeiro.
            </p>
          </div>
        )}
      </div>

      {/* Calculator Form with Tabs */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Parâmetros de Cálculo
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100/60 dark:bg-gray-700/60 backdrop-blur-sm p-1 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('scenario1')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'scenario1'
                ? 'bg-white/80 dark:bg-gray-600/80 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Cenário 1
          </button>
          <button
            onClick={() => setActiveTab('scenario2')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'scenario2'
                ? 'bg-white/80 dark:bg-gray-600/80 text-green-600 dark:text-green-400 shadow-sm backdrop-blur-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Cenário 2
          </button>
          <button
            onClick={() => setActiveTab('scenario3')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'scenario3'
                ? 'bg-white/80 dark:bg-gray-600/80 text-orange-600 dark:text-orange-400 shadow-sm backdrop-blur-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Cenário 3
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'scenario1' && renderCalculatorForm('scenario1', scenario1Data, 'Cenário 1')}
        {activeTab === 'scenario2' && renderCalculatorForm('scenario2', scenario2Data, 'Cenário 2')}
        {activeTab === 'scenario3' && renderCalculatorForm('scenario3', scenario3Data, 'Cenário 3')}
      </div>

      {/* Results */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="space-y-8">
          {renderResults(scenario1Results, 'Resultados - Cenário 1', 'from-blue-50/60 to-blue-100/60 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/50 dark:border-blue-700/50')}
          {renderResults(scenario2Results, 'Resultados - Cenário 2', 'from-green-50/60 to-green-100/60 dark:from-green-900/30 dark:to-green-800/30 border-green-200/50 dark:border-green-700/50')}
          {renderResults(scenario3Results, 'Resultados - Cenário 3', 'from-orange-50/60 to-orange-100/60 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200/50 dark:border-orange-700/50')}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Comparação de Cenários
          </h2>
        </div>

        {/* Line Visibility Controls */}
        <div className="mb-6 p-4 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Controlar Linhas do Gráfico</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(lineLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleLineVisibility(key as keyof LineVisibility)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  lineVisibility[key as keyof LineVisibility]
                    ? 'bg-white/80 dark:bg-gray-600/80 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-100/60 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400'
                }`}
              >
                {lineVisibility[key as keyof LineVisibility] ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: lineColors[key as keyof typeof lineColors] }}
                ></div>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scenario1Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scenario1PrincipalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scenario2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scenario2PrincipalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scenario3Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scenario3PrincipalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C2D12" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C2D12" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="year" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <ReTooltip content={customTooltip} />
              
              {/* Scenario 1 Areas */}
              {lineVisibility.principal1 && (
                <Area
                  type="monotone"
                  dataKey="principal1"
                  stackId="1"
                  stroke={lineColors.principal1}
                  fill="url(#scenario1PrincipalGradient)"
                  strokeWidth={2}
                />
              )}
              {lineVisibility.interest1 && (
                <Area
                  type="monotone"
                  dataKey="interest1"
                  stackId="1"
                  stroke={lineColors.interest1}
                  fill="url(#scenario1Gradient)"
                  strokeWidth={2}
                />
              )}
              
              {/* Scenario 2 Areas */}
              {lineVisibility.principal2 && (
                <Area
                  type="monotone"
                  dataKey="principal2"
                  stackId="2"
                  stroke={lineColors.principal2}
                  fill="url(#scenario2PrincipalGradient)"
                  strokeWidth={2}
                />
              )}
              {lineVisibility.interest2 && (
                <Area
                  type="monotone"
                  dataKey="interest2"
                  stackId="2"
                  stroke={lineColors.interest2}
                  fill="url(#scenario2Gradient)"
                  strokeWidth={2}
                />
              )}

              {/* Scenario 3 Areas */}
              {lineVisibility.principal3 && (
                <Area
                  type="monotone"
                  dataKey="principal3"
                  stackId="3"
                  stroke={lineColors.principal3}
                  fill="url(#scenario3PrincipalGradient)"
                  strokeWidth={2}
                />
              )}
              {lineVisibility.interest3 && (
                <Area
                  type="monotone"
                  dataKey="interest3"
                  stackId="3"
                  stroke={lineColors.interest3}
                  fill="url(#scenario3Gradient)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-8 mt-6 text-sm flex-wrap">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.principal1 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 1 - Contribuições</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.interest1 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 1 - Juros</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.principal2 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 2 - Contribuições</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.interest2 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 2 - Juros</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.principal3 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 3 - Contribuições</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColors.interest3 }}></div>
              <span className="text-gray-600 dark:text-gray-400">Cenário 3 - Juros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;