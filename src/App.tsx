import React, { useState, useEffect } from 'react';
import { Calculator, Moon, Sun, TrendingUp } from 'lucide-react';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference, default to light mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Calculadora de Juros Compostos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calcule o crescimento dos seus investimentos
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100/60 dark:bg-gray-700/60 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 backdrop-blur-sm transition-all duration-200"
            aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <CompoundInterestCalculator />
      </main>

      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Planeie o seu futuro financeiro com inteligência</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;