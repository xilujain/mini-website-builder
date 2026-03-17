import { Section } from '@/types';

export const preMadeSections = {
  header: {
    title: 'My Website',
    backgroundColor: '#ffffff',
    navHome: 'الرئيسية',
    navAbout: 'عن الشركة',
    navServices: 'الخدمات',
    navContact: 'اتصل بنا',
  },
  hero: {
    title: 'Welcome to Our Website',
    description: 'We build amazing digital experiences',
    buttonText: 'Learn More',
    backgroundColor: '#f3f4f6',
    imageUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  cta: {
    title: 'Ready to get started?',
    description: 'Join thousands of satisfied customers',
    buttonText: 'Sign Up Now',
    backgroundColor: '#2563eb',
  },
  footer: {
    description: '© 2024 Your Company. All rights reserved.',
    backgroundColor: '#1f2937',
  },
  contact: {},
  about: {}
} satisfies Record<Section['type'], Section['content']>;