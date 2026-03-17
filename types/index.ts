export interface Section {
    id: string;
    type: 'header' | 'hero' | 'cta' | 'footer' | 'contact' | 'about';
    content: {
      title?: string;
      description?: string;
      imageUrl?: string;
      buttonText?: string;
      backgroundColor?: string;
      navHome?: string;
      navAbout?: string;
      navServices?: string;
      navContact?: string;
    };
    order: number;
}
  
export interface WebsiteConfig {
    sections: Section[];
    theme?: {
      primaryColor: string;
      fontFamily: string;
    };
}