
import React from 'react';
import { ProjectConfig } from '../types';
import { GenerateIcon, MagicWandIcon } from './Icons';

interface ProjectFormProps {
  config: ProjectConfig;
  onConfigChange: <K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) => void;
  onMultiSelectChange: (key: 'modules' | 'communication', value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSuggesting: boolean;
  onSuggestGoal: () => void;
  projectGoals: string[];
  componentOptions: string[];
  communicationOptions: string[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  config,
  onConfigChange,
  onMultiSelectChange,
  onSubmit,
  isLoading,
  isSuggesting,
  onSuggestGoal,
  projectGoals,
  componentOptions,
  communicationOptions,
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-6">
      <h2 className="text-lg font-semibold text-white">تنظیمات پروژه</h2>
      
      {/* Board Configuration */}
      <div>
        <label htmlFor="board" className="block text-sm font-medium text-slate-300 mb-2">نوع برد ESP32</label>
        <select
          id="board"
          value={config.board}
          onChange={(e) => {
            onConfigChange('board', e.target.value);
            if (e.target.value !== 'Custom') {
              onConfigChange('customBoardConfig', '');
            }
          }}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
          <option value="ESP32 DevKitC V4 (38-pin)">ESP32 DevKitC V4 (38-pin)</option>
          <option value="Custom">سفارشی (Custom)</option>
        </select>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${config.board === 'Custom' ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <label htmlFor="customBoardConfig" className="block text-sm font-medium text-slate-300 mb-2">
          توضیحات برد سفارشی
        </label>
        <textarea
          id="customBoardConfig"
          value={config.customBoardConfig}
          onChange={(e) => onConfigChange('customBoardConfig', e.target.value)}
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          placeholder="مثال: برد سفارشی با ماژول ESP32-WROOM-32. GPIO12 به یک LED متصل است..."
        />
      </div>

      {/* Project Goal */}
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-slate-300 mb-2">هدف پروژه</label>
        <div className="flex items-center gap-2">
            <select
            id="goal"
            value={config.goal}
            onChange={(e) => onConfigChange('goal', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
            {projectGoals.map(goal => <option key={goal} value={goal}>{goal}</option>)}
            </select>
            <button
                onClick={onSuggestGoal}
                disabled={isSuggesting}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label="Suggest a project idea"
            >
                {isSuggesting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                ) : (
                    <MagicWandIcon className="w-5 h-5 text-cyan-400" />
                )}
            </button>
        </div>
      </div>

      {/* Modules */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">ماژول‌ها و قطعات</label>
        <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-3 rounded-md border border-slate-700 space-y-2">
          {componentOptions.map(option => (
            <div key={option} className="flex items-center">
              <input
                id={`module-${option}`}
                type="checkbox"
                checked={config.modules.includes(option)}
                onChange={() => onMultiSelectChange('modules', option)}
                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor={`module-${option}`} className="mr-3 text-sm text-slate-200">{option}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Communication */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">پروتکل ارتباطی</label>
        <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700 space-y-2">
          {communicationOptions.map(option => (
            <div key={option} className="flex items-center">
              <input
                id={`comm-${option}`}
                type="checkbox"
                checked={config.communication.includes(option)}
                onChange={() => onMultiSelectChange('communication', option)}
                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor={`comm-${option}`} className="mr-3 text-sm text-slate-200">{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">زبان برنامه‌نویسی</label>
        <div className="flex gap-4">
          {(['Arduino C++', 'MicroPython'] as const).map(lang => (
            <div key={lang} className="flex items-center">
              <input
                id={`lang-${lang}`}
                type="radio"
                name="language"
                value={lang}
                checked={config.language === lang}
                onChange={() => onConfigChange('language', lang)}
                className="h-4 w-4 border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor={`lang-${lang}`} className="mr-2 text-sm text-slate-200">{lang}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Power Supply */}
      <div>
        <label htmlFor="power" className="block text-sm font-medium text-slate-300 mb-2">منبع تغذیه</label>
        <input
          id="power"
          type="text"
          value={config.power}
          onChange={(e) => onConfigChange('power', e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      {/* Custom Description */}
      <div>
        <label htmlFor="customDescription" className="block text-sm font-medium text-slate-300 mb-2">
          توضیحات سفارشی پروژه
        </label>
        <textarea
          id="customDescription"
          value={config.customDescription}
          onChange={(e) => onConfigChange('customDescription', e.target.value)}
          rows={4}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          placeholder="هر توضیح یا نیاز خاصی که دارید اینجا بنویسید. مثلا: می‌خواهم وقتی دما از ۳۰ درجه بیشتر شد، یک ایمیل ارسال شود..."
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال تولید...
          </>
        ) : (
          <>
            <GenerateIcon className="w-5 h-5" />
            تولید نقشه پروژه
          </>
        )}
      </button>
    </div>
  );
};

export default ProjectForm;
