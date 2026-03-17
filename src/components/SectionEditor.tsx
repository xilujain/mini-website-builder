/* eslint-disable jsx-a11y/alt-text */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Section } from '@/types';
import { X, Save, RefreshCw, Image, Type, Palette, Link } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../components/ThemeContext';

interface Props {
  section: Section;
  onSave: (content: Section['content']) => void;
  onClose: () => void;
}

export default function SectionEditor({ section, onSave, onClose }: Props) {
  const [content, setContent] = useState(section.content);
  const [isSaving, setIsSaving] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(modalRef.current, { scale: 0.8, duration: 0.4, ease: "back.out(1.7)" })
    .from(contentRef.current, { y: 50, duration: 0.3, ease: "power2.out" }, "-=0.2")
    .from('.editor-field', { x: -20, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.1");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await gsap.timeline().to(formRef.current, { scale: 0.98, duration: 0.1, ease: "power2.in" })
    .to(formRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });

    onSave(content);
    setIsSaving(false);
  };

  const handleReset = () => {
    setContent(section.content);
    
    gsap.to(formRef.current, { keyframes: { x: [0, -10, 10, -10, 10, 0] }, duration: 0.5, ease: "power3.inOut" });
  };

  const getSectionIcon = () => {
    switch(section.type) {
      case 'header': return <Type className="w-6 h-6" />;
      case 'hero': return <Image className="w-6 h-6" />;
      case 'footer': return <Link className="w-6 h-6" />;
      default: return <Palette className="w-6 h-6" />;
    }
  };

  const renderInlinePreview = () => {
    const merged: Section = { ...section, content };

    switch (merged.type) {
      case 'header':
        return (
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-semibold">
              {merged.content.title || 'Header title'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Navigation preview
            </span>
          </div>
        );
      case 'hero':
      case 'cta':
        return (
          <div className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold mb-1">
              {merged.content.title || 'Hero / CTA title'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {merged.content.description || 'Section description preview'}
            </p>
              <button className="inline-flex px-3 py-1.5 rounded-full text-xs bg-purple-600 text-white">
                {merged.content.buttonText}kjhjugjhkhj
              </button>
          </div>
        );
      default:
        return (
          <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            {merged.content.title || 'Section title'} –{' '}
            {merged.content.description || 'section content'}
          </div>
        );
    }
  };

  const renderFieldsByType = () => {
    const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-gray-700'}`;

    const inputClass = `w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent
    ${isDark ? 'bg-slate-800 border border-slate-600 text-slate-100' : 'bg-gray-50 border border-gray-200 text-gray-900'}`;

    const colorInputClass = `w-12 h-12 rounded-lg cursor-pointer ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`;

    switch (section.type) {
      case 'header':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>Logo / Site name</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} placeholder="My Awesome Site" />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Header background color</label>
              <div className="flex items-center space-x-2">
                <input type="color" value={content.backgroundColor || '#ffffff'} onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })} className={colorInputClass} />
                <input type="text" value={content.backgroundColor || '#ffffff'} onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })} className={inputClass}
                placeholder="#ffffff" />
              </div>
            </div>

            <div className="editor-field grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Home link label</label>
                <input type="text" value={content.navHome || ''} onChange={(e) => setContent({ ...content, navHome: e.target.value })} className={inputClass} placeholder="الرئيسية" />
              </div>
              <div>
                <label className={labelClass}>About link label</label>
                <input type="text" value={content.navAbout || ''} onChange={(e) => setContent({ ...content, navAbout: e.target.value })} className={inputClass} placeholder="عن الشركة" />
              </div>
              <div>
                <label className={labelClass}>Services link label</label>
                <input type="text" value={content.navServices || ''} onChange={(e) => setContent({ ...content, navServices: e.target.value })} className={inputClass} placeholder="الخدمات" />
              </div>
              <div>
                <label className={labelClass}>Contact link label</label>
                <input type="text" value={content.navContact || ''} onChange={(e) => setContent({ ...content, navContact: e.target.value })} className={inputClass} placeholder="اتصل بنا" />
              </div>
            </div>
          </>
        );

      case 'hero':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>Hero headline</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} placeholder="Welcome to our website" />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Subheading</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={4}
              placeholder="Explain your value in one or two sentences." />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Hero image URL</label>
              <div className="relative">
                <input type="url" value={content.imageUrl || ''} onChange={(e) => setContent({ ...content, imageUrl: e.target.value })} className={`${inputClass} pl-10`}
                placeholder="https://example.com/hero.jpg" />
                <Image className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="editor-field">
              <label className={labelClass}>Primary button label</label>
              <input type="text" value={content.buttonText || ''} onChange={(e) => setContent({ ...content, buttonText: e.target.value })} className={inputClass} placeholder="Get started" />
            </div>
          </>
        );

      case 'cta':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>CTA title</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} placeholder="Ready to get started?" />
            </div>

            <div className="editor-field">
              <label className={labelClass}>CTA description</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={3}
              placeholder="Short sentence encouraging users to act." />
            </div>

            <div className="editor-field">
              <label className={labelClass}>CTA button label</label>
              <input type="text" value={content.buttonText || ''} onChange={(e) => setContent({ ...content, buttonText: e.target.value })} className={inputClass} placeholder="Sign up now" />
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>Contact section title</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} placeholder="Get in touch" />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Contact details / instructions</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={4}
              placeholder="Add email, phone, or instructions for the contact form." />
            </div>
          </>
        );

      case 'about':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>About title</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} placeholder="About our company" />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Story / description</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={5}
              placeholder="Write a short story about your brand." />
            </div>
          </>
        );
      case 'footer':
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>Footer text</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={3}
              placeholder="© 2024 Your Company. All rights reserved." />
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="editor-field">
              <label className={labelClass}>Title</label>
              <input type="text" value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })} className={inputClass} />
            </div>

            <div className="editor-field">
              <label className={labelClass}>Description</label>
              <textarea value={content.description || ''} onChange={(e) => setContent({ ...content, description: e.target.value })} className={inputClass} rows={4} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div ref={modalRef} className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
        <div className="relative p-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot;
          xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Cpath
          d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]
          opacity-20" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                {getSectionIcon()}
              </div>
              <div>
                <h2 className={`text-2xl font-bold capitalize ${isDark ? 'text-slate-100' : 'text-black'}`}>
                  تعديل {section.type} قسم
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-100' : 'text-black'}`}>
                  تخصيص المحتوى والمظهر
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={onClose} className={`p-2 bg-white/20 rounded-lg transition-colors ${isDark ? 'text-slate-100' : 'text-black'}`}>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div ref={contentRef} className={`p-6 overflow-y-auto ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
            {renderInlinePreview()}
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 mt-4">
              {renderFieldsByType()}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={handleReset} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors flex items-center space-x-2">
                  <RefreshCw size={18} />
                  <span>إعادة تعيين</span>
                </button>
                
                <button type="submit" disabled={isSaving} className="px-6 py-2 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50">
                  {isSaving ? (
                    <>
                      <div className={`w-4 h-4 border-2 ${isDark ? 'border-slate-100 border-t-transparent' : 'border-white border-t-transparent'} rounded-full animate-spin`} />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span className={`${isDark ? 'text-slate-100' : 'text-black'}`}>حفظ التعديلات</span>
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}