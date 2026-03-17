/* eslint-disable @next/next/no-img-element */

'use client';

import { useSortable } from '@dnd-kit/sortable';
import { Section } from '@/types';
import { GripVertical, Trash2, Edit2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/components/ThemeContext';

interface Props {
  sections: Section[];
  onSelectSection: (section: Section) => void;
  onDeleteSection: (id: string) => void;
}

function SortableSection({
  section,
  onSelectSection,
  onDeleteSection
}: {
  section: Section;
  onSelectSection: (section: Section) => void;
  onDeleteSection: (id: string) => void;
}) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging
  } = useSortable({ id: section.id });

  useEffect(() => {
    if (sectionRef.current) {
        gsap.from(sectionRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.2)"
        });
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
        gsap.to(contentRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
  }, []);

  return (
    <div ref={setNodeRef} id={`section-${section.id}`} className="section-item relative group">
      <div ref={contentRef} className={`relative rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border border-slate-700'
      : 'bg-white border border-slate-200'} ${isDragging ? 'shadow-2xl ring-2 ring-purple-500' : ''}`}>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 rounded-xl" style={{ padding: '2px' }}>
          <div className={`w-full h-full rounded-xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`} />
        </div>

        <div className="absolute right-2 flex items-center space-x-2 transition-all duration-300">
          <button onClick={() => onSelectSection(section)} className="p-2 rounded-lg shadow-lg transition-all duration-200 transform bg-white/90 border border-slate-200" title="Edit section">
            <Edit2 size={16} className="text-blue-600 dark:text-blue-400" />
          </button>
          
          <button onClick={() => onDeleteSection(section.id)} className="p-2 rounded-lg shadow-lg transition-all duration-200 transform bg-white/90 border border-slate-200"
          title="Delete section">
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </button>
        </div>

        <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg opacity-0 cursor-move transition-all
        duration-200 z-10">
          <GripVertical size={16} />
        </div>

        <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-200 z-10">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
            {section.type}
          </span>
        </div>

        <div className="p-6">
          {renderSectionPreview(section, theme)}
        </div>
      </div>
    </div>
  );
}

function renderSectionPreview(section: Section, theme: 'light' | 'dark') {

  switch (section.type) {
    case 'header':
      return (
        <nav className="flex justify-between items-center rounded-xl px-4 py-3" style={section.content.backgroundColor ? { backgroundColor: section.content.backgroundColor } : undefined}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg" />
            <span className={`text-xl font-bold bg-clip-text ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              {section.content.title || 'Brand'}
            </span>
          </div>
          <div className="grid md:flex space-x-6">
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer">
              {section.content.navHome || 'الرئيسية'}
            </span>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer">
              {section.content.navAbout || 'عن الشركة'}
            </span>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer">
              {section.content.navServices || 'الخدمات'}
            </span>
            <span className="text-gray-600 dark:text-gray-300 cursor-pointer">
              {section.content.navContact || 'اتصل بنا'}
            </span>
          </div>
          <button className="px-4 py-2 text-white rounded-lg hover:shadow-lg transition-shadow">
            {section.content.buttonText || 'ابدأ الآن'}
          </button>
        </nav>
      );
    
    case 'hero':
      return (
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot;
          xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Cpath
          d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]
          opacity-20" />
          
          <div className="relative z-10 text-center py-16 px-4">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              {section.content.title || 'ابني موقعك الخاص بك بسهولة'}
            </h1>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              {section.content.description || 'ابني موقعك الخاص بك بسهولة باستخدام البناء المباشر'}
            </p>
            {section.content.imageUrl && (
              <img src={section.content.imageUrl} alt="Hero" className="mx-auto max-h-48 object-cover rounded-lg shadow-2xl mb-8" />
            )}
            <button className={`px-8 py-3 rounded-full font-semibold transform transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-blue-950'}`}>
              {section.content.buttonText || 'ابدأ الآن'}
            </button>
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className={`rounded-xl px-6 py-8 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
          <h2 className="text-2xl font-bold mb-3">
            {section.content.title || 'هل أنت مستعد للبدء؟'}
          </h2>
          <p className={`mb-5 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
            {section.content.description || 'انضم إلى مئات العملاء السعداء اليوم.'}
          </p>
          <button className={`px-8 py-3 rounded-full font-semibold transform transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-blue-950'}`}>
            {section.content.buttonText || 'سجل الآن'}
          </button>
        </div>
      );

    case 'contact':
      return (
        <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
          <h2 className="text-2xl font-bold mb-2">
            {section.content.title || 'تواصل معنا'}
          </h2>
          <p className="mb-4 text-sm opacity-80">
            {section.content.description ||'يسعدنا سماع أسئلتك واقتراحاتك. املأ النموذج وسنعاود التواصل معك.'}
          </p>

          <form className="grid gap-3 mt-2">
            <div className="grid gap-1">
              <label className="text-xs font-medium opacity-80">الاسم</label>
              <input type="text" className={`rounded-lg px-3 py-2 text-sm outline-none ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-slate-100'
              : 'bg-gray-50 border border-slate-200 text-slate-900'}`} placeholder="اكتب اسمك الكامل" readOnly />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium opacity-80">البريد الإلكتروني</label>
              <input type="email" className={`rounded-lg px-3 py-2 text-sm outline-none ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-slate-100'
              : 'bg-gray-50 border border-slate-200 text-slate-900'}`} placeholder="you@example.com" readOnly />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium opacity-80">الرسالة</label>
              <textarea rows={3} className={`rounded-lg px-3 py-2 text-sm outline-none resize-none ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-slate-100'
              : 'bg-gray-50 border border-slate-200 text-slate-900'}`} placeholder="اكتب رسالتك هنا" readOnly />
            </div>
            <div className="pt-2 text-left">
            <button className={`px-8 py-3 rounded-full font-semibold transform transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-blue-950'}`}>
                {section.content.buttonText || 'إرسال الرسالة'}
              </button>
            </div>
          </form>
        </div>
      );

    case 'footer':
      return (
        <footer
          className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-slate-900 text-slate-100 border border-slate-700' : 'bg-slate-900 text-white'}`}
          style={ section.content.backgroundColor ? { backgroundColor: section.content.backgroundColor } : undefined}>
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">الشركة</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>عن الشركة</li>
                <li>الوظائف</li>
                <li>اتصل بنا</li>
              </ul>
            </div>
            <div>
                <h3 className="font-bold mb-4">الموارد</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>المدونة</li>
                <li>المستندات</li>
                <li>الدعم</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">القانوني</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>الخصوصية</li>
                <li>الشروط</li>
                <li>الأمان</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">المواقع الاجتماعية</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>التويتر</li>
                <li>اللينكدين</li>
                <li>جيتهب</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm opacity-80">
            {section.content.description || '© 2024 الشركة. جميع الحقوق محفوظة.'}
          </div>
        </footer>
      );
    
    default:
      return (
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
          <h3 className="text-xl font-bold mb-2">{section.content.title || 'عنوان القسم'}</h3>
          <p>{section.content.description || 'محتوى القسم هنا'}</p>
        </div>
      );
  }
}

export default function PreviewArea({ sections, onSelectSection, onDeleteSection }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && sections.length > 0) {
      gsap.from(previewRef.current, {
        scale: 0.99,
        opacity: 0.8,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [sections.length]);

  if (sections.length === 0) {
    return (
      <div className="preview-area glass-effect rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto">
          
          <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent">
            لا يوجد قسم مضاف بعد
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            ابدأ ببناء صفحتك بالنقر على القسم من المكتبة. يمكنك تخصيص كل قسم بشكل كامل!
          </p>
          
          <div className="flex justify-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>اضافة قسم</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>سحب لإعادة الترتيب</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span>تعديل المحتوى</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={previewRef} className="preview-area space-y-6">
      {sections.map((section) => (
        <SortableSection
          key={section.id}
          section={section}
          onSelectSection={onSelectSection}
          onDeleteSection={onDeleteSection}
        />
      ))}
    </div>
  );
}