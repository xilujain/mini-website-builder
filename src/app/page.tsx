/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import gsap from 'gsap';
import SectionEditor from '@/components/SectionEditor';
import ExportImport from '@/components/ExportImport';
import { Section, WebsiteConfig } from '@/types';
import { Sparkles, Layers, Zap, Plus, Moon, Sun } from 'lucide-react';
import { preMadeSections } from '@/src/data/templates';
import PreviewArea from '@/components/PreviewArea';
import { useTheme } from '@/components/ThemeContext';

export default function WebsiteBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();

  const sectionTypes: { type: Section['type']; label: string }[] = [
    { type: 'header', label: 'Header' },
    { type: 'hero', label: 'Hero' },
    { type: 'cta', label: 'Call to Action' },
    { type: 'footer', label: 'Footer' },
    { type: 'contact', label: 'Contact' },
    { type: 'about', label: 'About' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('mini-builder:sections');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as WebsiteConfig;
          if (Array.isArray(parsed.sections)) {
            setSections(parsed.sections);
          }
        } catch {}
      }
    }

    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    }).from('.stat-card', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.5").from('.library-section', {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8").from('.preview-section', {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=1");

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (sections.length > 0 && !isLoading) {
      gsap.from('.section-item', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)"
      });
    }
  }, [sections.length, isLoading]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const config: WebsiteConfig = { sections };
    window.localStorage.setItem('mini-builder:sections', JSON.stringify(config));
  }, [sections]);

  const addSection = useCallback(
    (type: Section['type']) => {
      const newSection: Section = {
        id: `${type}-${Date.now()}`,
        type,
        content: { ...preMadeSections[type] },
        order: sections.length
      };

      setSections((prev) => [...prev, newSection]);

      gsap.to('.library-section', {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    },
    [sections.length]
  );

  const updateSection = useCallback((id: string, content: Section['content']) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ));
    setSelectedSection(null);
    setIsEditorOpen(false);
  }, []);

  const deleteSection = useCallback((id: string) => {
    gsap.to(`#section-${id}`, {
      x: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        setSections(prev => prev.filter(section => section.id !== id));
        if (selectedSection?.id === id) {
          setSelectedSection(null);
          setIsEditorOpen(false);
        }
      }
    });
  }, [selectedSection]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setSections(prev => {
        const oldIndex = prev.findIndex(s => s.id === active.id);
        const newIndex = prev.findIndex(s => s.id === over?.id);
        
        const newSections = [...prev];
        const [removed] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, removed);
        
        return newSections.map((section, index) => ({
          ...section,
          order: index
        }));
      });

      gsap.to('.preview-area', {
        scale: 1.01,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    }
  }, []);

  const exportConfig = useCallback(() => {
    const config: WebsiteConfig = { sections };
    return JSON.stringify(config, null, 2);
  }, [sections]);

  const importConfig = useCallback((json: string) => {
    try {
      const config = JSON.parse(json) as WebsiteConfig;
      setSections(config.sections);
      
      gsap.to('.preview-section', {
        rotate: 360,
        scale: 1.1,
        duration: 0.8,
        ease: "back.out(1.2)"
      });
    } catch {
      console.error('Invalid configuration file');
      
      gsap.to('.export-import', {
        keyframes: {
          x: [0, -10, 10, -10, 10, 0],
        },
        duration: 0.5,
        ease: "power3.inOut"
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header ref={headerRef} className="glass-effect sticky top-0 z-40 border-b border-gray-200/70">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Layers className="w-8 h-8 text-purple-600" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text">ابني موقعك الخاص بك بسهولة</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">ابني موقعك الخاص بك بسهولة باستخدام البناء المباشر</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="interactive p-2 rounded-full border border-gray-200/70 bg-white/60 shadow-sm transition-colors" aria-label="Toggle theme">
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              <div className="export-import">
                <ExportImport onExport={exportConfig} onImport={importConfig} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main ref={mainRef} className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 library-section space-y-4">
            <div className="glass-effect rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">مكتبة الأقسام</h2>
              <div className="grid grid-cols-2 gap-2">
                {sectionTypes.map(({ type, label }) => (
                  <button key={type} type="button" onClick={() => addSection(type)} className="flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-gray-200/70
                  dark:border-gray-700/70 transition-colors">
                    <span>{label}</span>
                    <Plus className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 preview-section">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <PreviewArea sections={sections} onSelectSection={(section) => {
                    setSelectedSection(section);
                    setIsEditorOpen(true);
                    gsap.to(`#section-${section.id}`, {
                      scale: 1.02,
                      duration: 0.3,
                      yoyo: true,
                      repeat: 1,
                    });
                  }}
                  onDeleteSection={deleteSection}
                />
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>

      {isEditorOpen && selectedSection && (
        <SectionEditor section={selectedSection} onSave={(content) => updateSection(selectedSection.id, content)} onClose={() => {
          setSelectedSection(null);
          setIsEditorOpen(false);
        }} />
      )}
    </div>
  );
}