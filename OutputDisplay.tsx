
import React from 'react';
import { InfoIcon, CodeIcon, CircuitIcon, PinoutIcon, RocketIcon, SchematicIcon } from './Icons';


interface OutputDisplayProps {
  plan: string;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ plan, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
        <svg className="animate-spin h-12 w-12 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white">در حال ساخت پروژه شما...</h3>
        <p className="text-slate-400 mt-2">هوش مصنوعی در حال انتخاب بهترین پین‌ها و نوشتن کد است. لطفاً کمی صبر کنید.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center bg-red-900/20 rounded-lg border-2 border-dashed border-red-500/50 p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-white">خطا در پردازش</h3>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700 p-8">
        <CircuitIcon className="w-16 h-16 text-slate-500 mb-4" />
        <h3 className="text-2xl font-bold text-white">به مولد پروژه ESP32 خوش آمدید!</h3>
        <p className="text-slate-400 mt-2 max-w-md">
          مشخصات پروژه خود را در پنل سمت راست انتخاب کنید و دکمه "تولید نقشه پروژه" را بزنید تا راهنمای کامل، شماتیک و کد پروژه شما توسط هوش مصنوعی ساخته شود.
        </p>
      </div>
    );
  }

  const sections = plan.split(/###\s\d+\.\s/).filter(s => s.trim() !== '');

  const getIconForTitle = (title: string) => {
    if (title.includes('عملکرد')) return <InfoIcon className="w-6 h-6" />;
    if (title.includes('اتصالات')) return <PinoutIcon className="w-6 h-6" />;
    if (title.includes('شماتیک')) return <SchematicIcon className="w-6 h-6" />;
    if (title.includes('کد')) return <CodeIcon className="w-6 h-6" />;
    if (title.includes('نکات')) return <InfoIcon className="w-6 h-6" />;
    if (title.includes('ارتقاء')) return <RocketIcon className="w-6 h-6" />;
    return <CircuitIcon className="w-6 h-6" />;
  };
  
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 md:p-6 space-y-6">
      {sections.map((section, index) => {
        const firstNewline = section.indexOf('\n');
        const title = section.substring(0, firstNewline).trim();
        const content = section.substring(firstNewline + 1).trim();
        const isCodeSection = title.includes('کد کامل پروژه');
        const isSchematicSection = title.includes('شماتیک متنی مدار');

        return (
          <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              {getIconForTitle(title)}
              {title}
            </h3>
            {isCodeSection || isSchematicSection ? (
                <pre className="bg-slate-900 p-4 rounded-md whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{content.replace(/```(cpp|c|python|bash|text|)\n?/g, '').replace(/```/g, '')}</code>
                </pre>
            ) : (
                <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OutputDisplay;
