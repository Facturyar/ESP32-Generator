
import React, { useState, useCallback } from 'react';
import { ProjectConfig } from './types';
import { generateProjectPlan, generateProjectIdea } from './services/geminiService';
import ProjectForm from './components/ProjectForm';
import OutputDisplay from './components/OutputDisplay';
import { PROJECT_GOALS, COMPONENT_OPTIONS, COMMUNICATION_OPTIONS } from './constants';
import { GithubIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [projectGoals, setProjectGoals] = useState<string[]>(PROJECT_GOALS);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    board: 'ESP32 DevKitC V4 (38-pin)',
    customBoardConfig: '',
    goal: projectGoals[0],
    modules: ['LED', 'کلید فشاری'],
    communication: ['WiFi'],
    language: 'Arduino C++',
    power: 'USB 5V',
    customDescription: '',
  });
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    try {
      const plan = await generateProjectPlan(projectConfig);
      setGeneratedPlan(plan);
    } catch (err) {
      setError('متاسفانه در تولید پروژه خطایی رخ داد. لطفاً دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectConfig]);

  const handleSuggestGoal = useCallback(async () => {
    setIsSuggesting(true);
    setError(null);
    try {
      const idea = await generateProjectIdea();
      const cleanedIdea = idea.replace(/["*]/g, '').trim();
      if (cleanedIdea && !projectGoals.includes(cleanedIdea)) {
        const newGoals = [cleanedIdea, ...projectGoals];
        setProjectGoals(newGoals);
        handleConfigChange('goal', cleanedIdea);
      }
    } catch (err) {
      setError('خطا در دریافت ایده جدید. لطفاً اتصال خود را بررسی کنید.');
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  }, [projectGoals]);

  const handleConfigChange = useCallback(<K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) => {
    setProjectConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleMultiSelectChange = (key: 'modules' | 'communication', value: string) => {
    setProjectConfig(prev => {
      const currentValues = prev[key] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">
            مولد پروژه ESP32 با هوش مصنوعی
          </h1>
        </div>
        <a 
          href="https://github.com/YOUR_GITHUB_REPO" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="GitHub Repository"
        >
          <GithubIcon className="w-7 h-7" />
        </a>
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <ProjectForm
                config={projectConfig}
                onConfigChange={handleConfigChange}
                onMultiSelectChange={handleMultiSelectChange}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                isSuggesting={isSuggesting}
                onSuggestGoal={handleSuggestGoal}
                componentOptions={COMPONENT_OPTIONS}
                communicationOptions={COMMUNICATION_OPTIONS}
                projectGoals={projectGoals}
              />
            </div>
          </aside>
          <div className="lg:col-span-8 xl:col-span-9">
            <OutputDisplay
              plan={generatedPlan}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
