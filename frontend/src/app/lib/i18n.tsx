import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "hi";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = "signal-sprint-language";

const translations: Record<Language, Record<string, string>> = {
  en: {
    "brand.name": "DMC Smart Monitor",
    "brand.subtitle": "Dustbin Management System",
    "nav.home": "Home",
    "nav.upload": "Upload",
    "nav.history": "History",
    "nav.guidelines": "Guidelines",
    "nav.lang": "हिं",
    "home.title": "Smart Dustbin Monitoring System",
    "home.subtitle": "AI-powered detection of overflow and spill conditions across campus zones.",
    "home.uploadImage": "Upload Image",
    "home.recentActivityButton": "See Recent Activity",
    "home.howItWorks": "How It Works",
    "home.howItWorksSub": "Simple, fast, and accurate in three steps",
    "home.step.upload": "Upload Image",
    "home.step.uploadDesc": "Capture or upload dustbin photo",
    "home.step.ai": "AI Analysis",
    "home.step.aiDesc": "Advanced overflow detection",
    "home.step.decision": "Get Decision",
    "home.step.decisionDesc": "Instant action verdict",
    "home.seeInAction": "See It In Action",
    "home.seeInActionSub": "Real-time AI decision-making preview",
    "home.startNow": "Start Monitoring Now",
    "home.startNowSub": "Upload your first image and get instant AI-powered analysis",
    "home.uploadNow": "Upload Image Now",
    "home.recentActivity": "Recent Activity",
    "home.viewAll": "View All",
    "upload.title": "Upload Dustbin Image",
    "upload.description": "Drag and drop your image here, or use one of the options below",
    "upload.browseFiles": "Browse Files",
    "upload.useCamera": "Use Camera",
    "upload.imagePreview": "Image Preview",
    "upload.removeImage": "Remove Image",
    "upload.analyzeImage": "Analyze Image",
    "upload.analyzing": "Analyzing...",
    "history.title": "Analysis History",
    "history.subtitle": "Review previous dustbin monitoring results",
    "history.filter.all": "All",
    "history.filter.required": "Action Required",
    "history.filter.noAction": "No Action",
    "history.wardTable": "Ward Summary Table",
    "history.hotspots": "Top Hotspots (Predicted Next Overflow Zones)",
    "history.hotspotsSub": "Based on recent action-required trend and ward frequency",
    "history.mapsHint": "Paste coordinates in maps to get to the location.",
    "history.predictedRisk": "Predicted risk",
    "history.noHotspots": "Not enough data yet for hotspot prediction.",
    "result.binaryLabel": "Binary Output",
    "guidelines.title": "Detection Guidelines",
  },
  hi: {
    "brand.name": "डीएमसी स्मार्ट मॉनिटर",
    "brand.subtitle": "डस्टबिन प्रबंधन प्रणाली",
    "nav.home": "होम",
    "nav.upload": "अपलोड",
    "nav.history": "इतिहास",
    "nav.guidelines": "दिशानिर्देश",
    "nav.lang": "EN",
    "home.title": "स्मार्ट डस्टबिन मॉनिटरिंग सिस्टम",
    "home.subtitle": "कैंपस में ओवरफ्लो और कचरा फैलाव की एआई आधारित पहचान।",
    "home.uploadImage": "छवि अपलोड करें",
    "home.recentActivityButton": "हाल की गतिविधि देखें",
    "home.howItWorks": "यह कैसे काम करता है",
    "home.howItWorksSub": "तीन चरणों में सरल, तेज और सटीक प्रक्रिया",
    "home.step.upload": "छवि अपलोड",
    "home.step.uploadDesc": "डस्टबिन की फोटो लें या अपलोड करें",
    "home.step.ai": "एआई विश्लेषण",
    "home.step.aiDesc": "उन्नत ओवरफ्लो पहचान",
    "home.step.decision": "निर्णय प्राप्त करें",
    "home.step.decisionDesc": "तुरंत कार्रवाई निर्णय",
    "home.seeInAction": "लाइव डेमो देखें",
    "home.seeInActionSub": "रीयल-टाइम एआई निर्णय पूर्वावलोकन",
    "home.startNow": "अभी मॉनिटरिंग शुरू करें",
    "home.startNowSub": "पहली छवि अपलोड करें और तुरंत एआई विश्लेषण पाएं",
    "home.uploadNow": "अभी छवि अपलोड करें",
    "home.recentActivity": "हाल की गतिविधि",
    "home.viewAll": "सभी देखें",
    "upload.title": "डस्टबिन छवि अपलोड करें",
    "upload.description": "छवि यहाँ ड्रैग-ड्रॉप करें या नीचे दिए विकल्प चुनें",
    "upload.browseFiles": "फाइल चुनें",
    "upload.useCamera": "कैमरा उपयोग करें",
    "upload.imagePreview": "छवि पूर्वावलोकन",
    "upload.removeImage": "छवि हटाएं",
    "upload.analyzeImage": "छवि विश्लेषण करें",
    "upload.analyzing": "विश्लेषण हो रहा है...",
    "history.title": "विश्लेषण इतिहास",
    "history.subtitle": "डस्टबिन मॉनिटरिंग के पिछले परिणाम देखें",
    "history.filter.all": "सभी",
    "history.filter.required": "कार्रवाई आवश्यक",
    "history.filter.noAction": "कोई कार्रवाई नहीं",
    "history.wardTable": "वार्ड सारांश तालिका",
    "history.hotspots": "शीर्ष हॉटस्पॉट (संभावित अगला ओवरफ्लो क्षेत्र)",
    "history.hotspotsSub": "हाल की कार्रवाई-आवश्यक प्रवृत्ति और वार्ड आवृत्ति पर आधारित",
    "history.mapsHint": "लोकेशन तक पहुंचने के लिए निर्देशांक मैप्स में पेस्ट करें।",
    "history.predictedRisk": "अनुमानित जोखिम",
    "history.noHotspots": "हॉटस्पॉट अनुमान के लिए अभी पर्याप्त डेटा नहीं है।",
    "result.binaryLabel": "बाइनरी आउटपुट",
    "guidelines.title": "पहचान दिशानिर्देश",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "hi" ? "hi" : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translations[language][key] ?? key,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
