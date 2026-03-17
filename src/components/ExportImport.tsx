'use client';

import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import gsap from 'gsap';

interface Props {
  onExport: () => string;
  onImport: (json: string) => void;
}

export default function ExportImport({ onExport, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleExport = () => {
    setIsExporting(true);
    
    gsap.timeline().to('.export-button', {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.in"
    }).to('.export-button', {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
    });

    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-config-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsExporting(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    gsap.timeline().to('.import-button', {
        rotate: 360,
        scale: 1.1,
        duration: 0.5,
        ease: "back.out(1.2)",
    });

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        onImport(json);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        gsap.to('.import-button', {
          backgroundColor: '#10b981',
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      } catch {
        setErrorMessage('ملف JSON غير صالح');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        
        gsap.to('.import-button', {
          keyframes: {
            x: [0, -10, 10, -10, 10, 0],
          },
          backgroundColor: '#ef4444',
          duration: 0.5,
          ease: "power3.inOut",
        });
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
    
    e.target.value = '';
  };

  return (
    <div className="relative flex items-center space-x-3">
      {showSuccess && (
        <div className="absolute top-full mt-2 right-0 flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          <Check size={16} />
          <span className="text-sm">تمت العملية بنجاح!</span>
        </div>
      )}

      {showError && (
        <div className="absolute top-full mt-2 right-0 flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          <AlertCircle size={16} />
          <span className="text-sm">{errorMessage || 'حدث خطأ ما'}</span>
        </div>
      )}

      <button onClick={handleExport} disabled={isExporting} className="export-button group relative overflow-hidden px-4 py-2 dark:text-white rounded-lg transition-all duration-300
      disabled:opacity-50">
        <div className="absolute inset-0 bg-white transform scale-x-0 transition-transform duration-300 origin-left opacity-20" />
        <div className="relative flex items-center space-x-2">
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري التصدير...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>تصدير</span>
            </>
          )}
        </div>
      </button>

      <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="import-button group relative overflow-hidden px-4 py-2 dark:text-white rounded-lg transition-all
      duration-300 disabled:opacity-50">
        <div className="absolute inset-0 bg-white transform scale-x-0 transition-transform duration-300 origin-left opacity-20" />
        <div className="relative flex items-center space-x-2">
          {isImporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري الاستيراد...</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>استيراد</span>
            </>
          )}
        </div>
      </button>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
    </div>
  );
}