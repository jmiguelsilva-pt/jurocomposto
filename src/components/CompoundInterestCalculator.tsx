import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
// Emojis em vez de ícones
import Tooltip from './ui/Tooltip';
import Reveal from './ui/Reveal';

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

//

const CompoundInterestCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scenario1' | 'scenario2'>('scenario1');
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

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  const [showRes1, setShowRes1] = useState(true);
  const [showRes2, setShowRes2] = useState(true);

  const calculateScenario = (data: CalculatorData) => {
    const { principal, rate, time, frequency, monthlyContribution } = data;
    const r = rate / 100;
    
    let amount = principal;
    let totalContributions = principal;
    const yearlyData: Array<{year:number; amount:number; principal:number; interest:number}> = [];

    const periodsPerYear = frequency; // 1=anual, 4=trimestral, 12=mensal, 365=diário
    const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear);
    
    for (let year = 0; year <= time; year++) {
      if (year === 0) {
        yearlyData.push({ year, amount: principal, principal: totalContributions, interest: 0 });
      } else {
        for (let p = 1; p <= periodsPerYear; p++) {
          amount = amount * (1 + r / periodsPerYear) + contributionPerPeriod;
          totalContributions += contributionPerPeriod;
        }
        yearlyData.push({
          year,
          amount: Math.round(amount),
          principal: Math.round(totalContributions),
          interest: Math.round(amount - totalContributions),
        });
      }
    }

    const finalAmount = Math.round(amount);
    const totalInterest = Math.round(amount - totalContributions);

    return {
      results: { finalAmount, totalInterest, totalContributions: Math.round(totalContributions) },
      yearlyData,
    };
  };

  const calculateAllScenarios = () => {
    const scenario1 = calculateScenario(scenario1Data);
    const scenario2 = calculateScenario(scenario2Data);

    setScenario1Results(scenario1.results);
    setScenario2Results(scenario2.results);

    // Combine data for chart
    const combinedData: ChartDataPoint[] = [];
    const maxTime = Math.max(scenario1Data.time, scenario2Data.time);

    for (let year = 0; year <= maxTime; year++) {
      const data1 = scenario1.yearlyData.find(d => d.year === year);
      const data2 = scenario2.yearlyData.find(d => d.year === year);

      combinedData.push({
        year,
        amount1: data1?.amount || 0,
        principal1: data1?.principal || 0,
        interest1: data1?.interest || 0,
        amount2: data2?.amount || 0,
        principal2: data2?.principal || 0,
        interest2: data2?.interest || 0,
        amount3: 0,
        principal3: 0,
        interest3: 0,
      });
    }

    setChartData(combinedData);
  };

  useEffect(() => {
    calculateAllScenarios();
  }, [scenario1Data, scenario2Data]);

  const handleInputChange = (scenario: 'scenario1' | 'scenario2', field: keyof CalculatorData, value: number) => {
    if (scenario === 'scenario1') {
      setScenario1Data(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setScenario2Data(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  //

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
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCalculatorForm = (scenario: 'scenario1' | 'scenario2', data: CalculatorData, title: string) => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-xl">🧮</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investimento Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            <div className="inline-flex items-center gap-2">
              <span>Investimento Inicial</span>
              <Tooltip content="Montante inicial que investe. Pode ser 0€.">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-800 text-[10px]">i</span>
              </Tooltip>
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
            <input type="number" value={data.principal} onChange={(e) => handleInputChange(scenario, 'principal', Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-black/0 text-gray-900 dark:text-white transition-all duration-200 shadow-sm" placeholder="10.000" />
          </div>
        </div>

        {/* Período (Anos) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            <div className="inline-flex items-center gap-2">
              <span>Período (Anos)</span>
              <Tooltip content="Número de anos do investimento."><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-800 text-[10px]">i</span></Tooltip>
            </div>
          </label>
          <input type="number" value={data.time} onChange={(e) => handleInputChange(scenario, 'time', Number(e.target.value))} className="w-full px-4 py-3 bg-white dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-black/0 text-gray-900 dark:text-white transition-all duration-200 shadow-sm" placeholder="10" />
        </div>

        {/* Investimento Adicional (Mensal base) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            <div className="inline-flex items-center gap-2">
              <span>Investimento Adicional</span>
              <Tooltip content="Valor base mensal. Ajustado pela frequência."><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-800 text-[10px]">i</span></Tooltip>
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
            <input type="number" value={data.monthlyContribution} onChange={(e) => handleInputChange(scenario, 'monthlyContribution', Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-black/0 text-gray-900 dark:text-white transition-all duration-200 shadow-sm" placeholder="500" />
          </div>
        </div>

        {/* Frequência do Investimento */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            <div className="inline-flex items-center gap-2">
              <span>Frequência do Investimento</span>
              <Tooltip content="Periodicidade de aplicação dos juros e contribuições."><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-800 text-[10px]">i</span></Tooltip>
            </div>
          </label>
          <select value={data.frequency} onChange={(e) => handleInputChange(scenario, 'frequency', Number(e.target.value))} className="w-full px-4 py-3 bg-white dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-black/0 text-gray-900 dark:text-white transition-all duration-200 shadow-sm">
            <option value={1}>Anualmente</option>
            <option value={4}>Trimestralmente</option>
            <option value={12}>Mensalmente</option>
            <option value={365}>Diariamente</option>
          </select>
        </div>

        {/* Taxa de Juro */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            <div className="inline-flex items-center gap-2">
              <span>Taxa de Juro</span>
              <Tooltip content="Taxa média anual esperada (ex.: 7 para 7%)."><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-800 text-[10px]">i</span></Tooltip>
            </div>
          </label>
          <div className="relative">
            <input type="number" step="0.1" value={data.rate} onChange={(e) => handleInputChange(scenario, 'rate', Number(e.target.value))} className="w-full pr-8 pl-4 py-3 bg-white dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-black/0 text-gray-900 dark:text-white transition-all duration-200 shadow-sm" placeholder="7" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calculadora de Juros Compostos
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scenario1')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'scenario1'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Cenário 1
          </button>
          <button
            onClick={() => setActiveTab('scenario2')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'scenario2'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Cenário 2
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calculator Form */}
        <div className="flex-1">
          {renderCalculatorForm(activeTab, activeTab === 'scenario1' ? scenario1Data : scenario2Data, activeTab === 'scenario1' ? 'Cenário 1' : 'Cenário 2')}
        </div>

        {/* Results and Chart */}
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resultados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Montante Final:
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(activeTab === 'scenario1' ? scenario1Results.finalAmount : scenario2Results.finalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Total de Contribuições:
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(activeTab === 'scenario1' ? scenario1Results.totalContributions : scenario2Results.totalContributions)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Total de Juros:
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(activeTab === 'scenario1' ? scenario1Results.totalInterest : scenario2Results.totalInterest)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gráfico de Evolução
            </h3>
            <div className="h-[300px] w-full">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ReTooltip content={customTooltip} />
                <Area
                  type="monotone"
                  dataKey={activeTab === 'scenario1' ? 'amount1' : 'amount2'}
                  stroke={activeTab === 'scenario1' ? '#4f46e5' : '#22c55e'}
                  fill={activeTab === 'scenario1' ? '#e0e7ff' : '#d1fae5'}
                  name={activeTab === 'scenario1' ? 'Cenário 1' : 'Cenário 2'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  stackId="1"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey={activeTab === 'scenario1' ? 'principal1' : 'principal2'}
                  stroke={activeTab === 'scenario1' ? '#4f46e5' : '#22c55e'}
                  fill={activeTab === 'scenario1' ? '#e0e7ff' : '#d1fae5'}
                  name={activeTab === 'scenario1' ? 'Cenário 1' : 'Cenário 2'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  stackId="1"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey={activeTab === 'scenario1' ? 'interest1' : 'interest2'}
                  stroke={activeTab === 'scenario1' ? '#4f46e5' : '#22c55e'}
                  fill={activeTab === 'scenario1' ? '#e0e7ff' : '#d1fae5'}
                  name={activeTab === 'scenario1' ? 'Cenário 1' : 'Cenário 2'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  stackId="1"
                  isAnimationActive={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;