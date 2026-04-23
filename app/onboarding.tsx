import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useAppSettings } from "@/context/AppSettingsContext";
import { SUPPORTED_LANGUAGES, UPCOMING_LANGUAGES, type Language } from "@/data/translations";
import { detectRegionFromCoords } from "@/data/offices";
import { saveRegionalOffices } from "@/utils/regionalOfficesCache";
import {
  downloadOfflineTiles,
  estimateDownloadBytes,
  estimateTileCount,
  getFreeDiskBytes,
} from "@/utils/tileCache";

/* ── Onboarding string translations for all 15 languages ──── */
const OB: Record<
  Language,
  {
    selectLanguage: string;
    comingSoon: string;
    continue: string;
    skip: string;
    next: string;
    getStarted: string;
    allowLocation: string;
    detectingRegion: string;
    yourRegion: string;
    regionDownload: string;
    slide1Title: string;
    slide1Desc: string;
    slide2Title: string;
    slide2Desc: string;
    slide3Title: string;
    slide3Desc: string;
    downloadMapTitle: string;
    downloadMapSub: string;
    downloadNow: string;
    notNow: string;
  }
> = {
  English: {
    selectLanguage: "Select Language",
    comingSoon: "Coming soon",
    continue: "Continue",
    skip: "Skip",
    next: "Next",
    getStarted: "Get Started",
    allowLocation: "Allow Location",
    detectingRegion: "Detecting your region…",
    yourRegion: "Your region",
    regionDownload: "Download only the government offices closest to you.",
    slide1Title: "Know Your Rights",
    slide1Desc:
      "50+ rights explained in plain language — constitutional, RTI, labour, consumer and more.",
    slide2Title: "Find Help Near You",
    slide2Desc: "Legal Aid centres, courts and police stations — one tap away.",
    slide3Title: "Always Offline",
    slide3Desc:
      "Everything works without internet. Your rights, your procedures, your emergency contacts.",
    downloadMapTitle: "Download Offline Map",
    downloadMapSub: "Navigate without internet. Works in remote villages too.",
    downloadNow: "Download",
    notNow: "Not Now",
  },
  Hindi: {
    selectLanguage: "भाषा चुनें",
    comingSoon: "जल्द आ रहे हैं",
    continue: "जारी रखें",
    skip: "छोड़ें",
    next: "अगला",
    getStarted: "शुरू करें",
    allowLocation: "स्थान अनुमति दें",
    detectingRegion: "आपका क्षेत्र खोजा जा रहा है…",
    yourRegion: "आपका क्षेत्र",
    regionDownload: "केवल आपके नजदीकी सरकारी कार्यालय डाउनलोड करें।",
    slide1Title: "अपने अधिकार जानें",
    slide1Desc: "50+ अधिकार सरल भाषा में — संवैधानिक, आरटीआई, श्रम, उपभोक्ता और अधिक।",
    slide2Title: "पास में मदद पाएं",
    slide2Desc: "कानूनी सहायता केंद्र, न्यायालय और पुलिस — एक टैप में।",
    slide3Title: "हमेशा ऑफलाइन",
    slide3Desc: "सब कुछ बिना इंटरनेट के। आपके अधिकार, प्रक्रियाएं, आपातकालीन संपर्क।",
    downloadMapTitle: "ऑफलाइन मैप डाउनलोड करें",
    downloadMapSub: "बिना इंटरनेट नेविगेट करें। दूरदराज गांवों में भी काम करता है।",
    downloadNow: "डाउनलोड करें",
    notNow: "अभी नहीं",
  },
  Marathi: {
    selectLanguage: "भाषा निवडा",
    comingSoon: "लवकरच येत आहे",
    continue: "पुढे जा",
    skip: "वगळा",
    next: "पुढे",
    getStarted: "सुरू करा",
    allowLocation: "स्थान परवानगी द्या",
    detectingRegion: "आपला प्रदेश शोधत आहे…",
    yourRegion: "आपला प्रदेश",
    regionDownload: "फक्त आपल्या जवळचे सरकारी कार्यालय डाउनलोड करा.",
    slide1Title: "आपले अधिकार जाणा",
    slide1Desc: "50+ अधिकार सोप्या भाषेत — संवैधानिक, आरटीआई, कामगार, ग्राहक आणि अधिक.",
    slide2Title: "जवळची मदत शोधा",
    slide2Desc: "कायदेशीर सहाय्य केंद्रे, न्यायालये आणि पोलीस — एका टॅपमध्ये.",
    slide3Title: "नेहमी ऑफलाइन",
    slide3Desc: "सर्व काही इंटरनेटशिवाय. आपले अधिकार, प्रक्रिया, आपत्कालीन संपर्क.",
    downloadMapTitle: "ऑफलाइन मॅप डाउनलोड करा",
    downloadMapSub: "इंटरनेटशिवाय नेव्हिगेट करा. दूरच्या गावांमध्येही काम करते.",
    downloadNow: "डाउनलोड करा",
    notNow: "आत्ता नाही",
  },
  Tamil: {
    selectLanguage: "மொழியை தேர்ந்தெடுக்கவும்",
    comingSoon: "விரைவில் வருகிறது",
    continue: "தொடரவும்",
    skip: "தவிர்க்கவும்",
    next: "அடுத்து",
    getStarted: "தொடங்குங்கள்",
    allowLocation: "இடத்தை அனுமதிக்கவும்",
    detectingRegion: "உங்கள் பகுதியைக் கண்டறிகிறோம்…",
    yourRegion: "உங்கள் பகுதி",
    regionDownload: "உங்களுக்கு அருகிலுள்ள அரசு அலுவலகங்களை மட்டும் பதிவிறக்கவும்.",
    slide1Title: "உங்கள் உரிமைகளை அறியுங்கள்",
    slide1Desc: "50+ உரிமைகள் எளிய மொழியில் — அரசியலமைப்பு, RTI, தொழிலாளர், நுகர்வோர் மற்றும் பல.",
    slide2Title: "அருகில் உதவி கண்டறியுங்கள்",
    slide2Desc: "சட்ட உதவி மையங்கள், நீதிமன்றங்கள் மற்றும் காவல் நிலையங்கள் — ஒரே தட்டில்.",
    slide3Title: "எப்போதும் ஆஃப்லைன்",
    slide3Desc:
      "இணையம் இல்லாமலும் அனைத்தும் செயல்படும். உங்கள் உரிமைகள், நடைமுறைகள், அவசர தொடர்புகள்.",
    downloadMapTitle: "ஆஃப்லைன் வரைபடம் பதிவிறக்கவும்",
    downloadMapSub: "இணையம் இல்லாமல் வழிசெல்லுங்கள். தொலை கிராமங்களிலும் செயல்படும்.",
    downloadNow: "பதிவிறக்கு",
    notNow: "இப்போது வேண்டாம்",
  },
  Telugu: {
    selectLanguage: "భాషను ఎంచుకోండి",
    comingSoon: "త్వరలో వస్తుంది",
    continue: "కొనసాగించు",
    skip: "దాటవేయి",
    next: "తదుపరి",
    getStarted: "ప్రారంభించండి",
    allowLocation: "స్థానానికి అనుమతించండి",
    detectingRegion: "మీ ప్రాంతాన్ని గుర్తిస్తున్నాం…",
    yourRegion: "మీ ప్రాంతం",
    regionDownload: "మీకు సమీపంలోని ప్రభుత్వ కార్యాలయాలను మాత్రమే డౌన్‌లోడ్ చేయండి.",
    slide1Title: "మీ హక్కులు తెలుసుకోండి",
    slide1Desc: "50+ హక్కులు సరళమైన భాషలో — రాజ్యాంగ, RTI, కార్మిక, వినియోగదారు మరియు మరిన్ని.",
    slide2Title: "సమీపంలో సహాయం కనుగొనండి",
    slide2Desc: "న్యాయ సహాయ కేంద్రాలు, న్యాయస్థానాలు మరియు పోలీస్ స్టేషన్లు — ఒక్క నొక్కుతో.",
    slide3Title: "ఎల్లప్పుడూ ఆఫ్‌లైన్",
    slide3Desc: "ఇంటర్నెట్ లేకుండా అన్నీ పని చేస్తాయి. మీ హక్కులు, విధానాలు, అత్యవసర పరిచయాలు.",
    downloadMapTitle: "ఆఫ్‌లైన్ మ్యాప్ డౌన్‌లోడ్ చేయండి",
    downloadMapSub: "ఇంటర్నెట్ లేకుండా నావిగేట్ చేయండి. మారుమూల గ్రామాల్లోనూ పనిచేస్తుంది.",
    downloadNow: "డౌన్‌లోడ్",
    notNow: "ఇప్పుడు వద్దు",
  },
  Bengali: {
    selectLanguage: "ভাষা বেছে নিন",
    comingSoon: "শীঘ্রই আসছে",
    continue: "চালিয়ে যান",
    skip: "এড়িয়ে যান",
    next: "পরবর্তী",
    getStarted: "শুরু করুন",
    allowLocation: "অবস্থানের অনুমতি দিন",
    detectingRegion: "আপনার অঞ্চল শনাক্ত করা হচ্ছে…",
    yourRegion: "আপনার অঞ্চল",
    regionDownload: "শুধুমাত্র আপনার কাছাকাছি সরকারি অফিসগুলি ডাউনলোড করুন।",
    slide1Title: "আপনার অধিকার জানুন",
    slide1Desc: "৫০+ অধিকার সহজ ভাষায় — সাংবিধানিক, RTI, শ্রম, ভোক্তা ও আরও।",
    slide2Title: "কাছাকাছি সাহায্য খুঁজুন",
    slide2Desc: "আইনি সহায়তা কেন্দ্র, আদালত ও থানা — একটি ট্যাপেই।",
    slide3Title: "সবসময় অফলাইন",
    slide3Desc: "ইন্টারনেট ছাড়াই সব কাজ করে। আপনার অধিকার, পদ্ধতি, জরুরি যোগাযোগ।",
    downloadMapTitle: "অফলাইন ম্যাপ ডাউনলোড করুন",
    downloadMapSub: "ইন্টারনেট ছাড়াই নেভিগেট করুন। প্রত্যন্ত গ্রামেও কাজ করে।",
    downloadNow: "ডাউনলোড করুন",
    notNow: "এখন নয়",
  },
  Gujarati: {
    selectLanguage: "ભાષા પસંદ કરો",
    comingSoon: "ટૂંક સમયમાં આવે છે",
    continue: "ચાલુ રાખો",
    skip: "છોડો",
    next: "આગળ",
    getStarted: "શરૂ કરો",
    allowLocation: "સ્થાનની પરવાનગી આપો",
    detectingRegion: "તમારો પ્રદેશ શોધી રહ્યા છીએ…",
    yourRegion: "તમારો પ્રદેશ",
    regionDownload: "ફક્ત તમારી નજીકની સરકારી ઑફિસ ડાઉનલોડ કરો.",
    slide1Title: "તમારા અધિકારો જાણો",
    slide1Desc: "50+ અધિકારો સરળ ભાષામાં — બંધારણીય, RTI, મજૂર, ગ્રાહક અને વધુ.",
    slide2Title: "નજીકમાં મદદ શોધો",
    slide2Desc: "કાનૂની સહાય કેન્દ્રો, અદાલતો અને પોલીસ સ્ટેશન — એક ટેપ પર.",
    slide3Title: "હંમેશા ઑફ્લાઇન",
    slide3Desc: "ઇન્ટરનેટ વિના બધું કાર્ય કરે છે. તમારા અધિકારો, પ્રક્રિયાઓ, કટોકટી સંપર્કો.",
    downloadMapTitle: "ઑફ્લાઇન મૅપ ડાઉનલોડ કરો",
    downloadMapSub: "ઇન્ટરનેટ વિના નેવિગેટ કરો. દૂરના ગામોમાં પણ કામ કરે છે.",
    downloadNow: "ડાઉનલોડ",
    notNow: "હમણાં નહીં",
  },
  Kannada: {
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    comingSoon: "ಶೀಘ್ರದಲ್ಲಿ ಬರುತ್ತಿದೆ",
    continue: "ಮುಂದುವರಿಸಿ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ",
    next: "ಮುಂದೆ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    allowLocation: "ಸ್ಥಳಕ್ಕೆ ಅನುಮತಿ ನೀಡಿ",
    detectingRegion: "ನಿಮ್ಮ ಪ್ರದೇಶ ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ…",
    yourRegion: "ನಿಮ್ಮ ಪ್ರದೇಶ",
    regionDownload: "ನಿಮ್ಮ ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಕಚೇರಿಗಳನ್ನು ಮಾತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    slide1Title: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
    slide1Desc: "50+ ಹಕ್ಕುಗಳು ಸರಳ ಭಾಷೆಯಲ್ಲಿ — ಸಾಂವಿಧಾನಿಕ, RTI, ಕಾರ್ಮಿಕ, ಗ್ರಾಹಕ ಮತ್ತು ಹೆಚ್ಚು.",
    slide2Title: "ಹತ್ತಿರ ಸಹಾಯ ಹುಡುಕಿ",
    slide2Desc: "ಕಾನೂನು ನೆರವು ಕೇಂದ್ರಗಳು, ನ್ಯಾಯಾಲಯಗಳು ಮತ್ತು ಪೊಲೀಸ್ ಠಾಣೆಗಳು — ಒಂದು ಟ್ಯಾಪ್‌ನಲ್ಲಿ.",
    slide3Title: "ಯಾವಾಗಲೂ ಆಫ್‌ಲೈನ್",
    slide3Desc:
      "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಎಲ್ಲವೂ ಕಾರ್ಯ ನಿರ್ವಹಿಸುತ್ತದೆ. ನಿಮ್ಮ ಹಕ್ಕುಗಳು, ಕಾರ್ಯವಿಧಾನಗಳು, ತುರ್ತು ಸಂಪರ್ಕಗಳು.",
    downloadMapTitle: "ಆಫ್‌ಲೈನ್ ನಕ್ಷೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    downloadMapSub: "ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ. ದೂರದ ಹಳ್ಳಿಗಳಲ್ಲೂ ಕಾರ್ಯ ನಿರ್ವಹಿಸುತ್ತದೆ.",
    downloadNow: "ಡೌನ್‌ಲೋಡ್",
    notNow: "ಈಗ ಬೇಡ",
  },
  Malayalam: {
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    comingSoon: "ഉടൻ വരുന്നു",
    continue: "തുടരുക",
    skip: "ഒഴിവാക്കുക",
    next: "അടുത്തത്",
    getStarted: "ആരംഭിക്കുക",
    allowLocation: "സ്ഥാനം അനുവദിക്കുക",
    detectingRegion: "നിങ്ങളുടെ പ്രദേശം കണ്ടെത്തുന്നു…",
    yourRegion: "നിങ്ങളുടെ പ്രദേശം",
    regionDownload: "നിങ്ങൾക്ക് ഏറ്റവും അടുത്തുള്ള സർക്കാർ ഓഫീസുകൾ മാത്രം ഡൗൺലോഡ് ചെയ്യുക.",
    slide1Title: "നിങ്ങളുടെ അവകാശങ്ങൾ അറിയൂ",
    slide1Desc: "50+ അവകാശങ്ങൾ ലളിത ഭാഷയിൽ — ഭരണഘടന, RTI, തൊഴിൽ, ഉപഭോക്താവ് എന്നിവ.",
    slide2Title: "സമീപത്ത് സഹായം കണ്ടെത്തുക",
    slide2Desc: "നിയമ സഹായ കേന്ദ്രങ്ങൾ, കോടതികൾ, പോലീസ് സ്റ്റേഷനുകൾ — ഒറ്റ ടാപ്പിൽ.",
    slide3Title: "എപ്പോഴും ഓഫ്‌ലൈൻ",
    slide3Desc:
      "ഇന്റർനെറ്റ് ഇല്ലാതെ എല്ലാം പ്രവർത്തിക്കും. നിങ്ങളുടെ അവകാശങ്ങൾ, നടപടിക്രമങ്ങൾ, അടിയന്തര ബന്ധങ്ങൾ.",
    downloadMapTitle: "ഓഫ്‌ലൈൻ മാപ്പ് ഡൗൺലോഡ് ചെയ്യുക",
    downloadMapSub: "ഇന്റർനെറ്റ് ഇല്ലാതെ നാവിഗേറ്റ് ചെയ്യുക. വിദൂര ഗ്രാമങ്ങളിലും പ്രവർത്തിക്കും.",
    downloadNow: "ഡൗൺലോഡ്",
    notNow: "ഇപ്പോൾ വേണ്ട",
  },
  Assamese: {
    selectLanguage: "ভাষা বাছনি কৰক",
    comingSoon: "সোনকালে আহিব",
    continue: "অব্যাহত ৰাখক",
    skip: "এৰি দিয়ক",
    next: "পৰৱৰ্তী",
    getStarted: "আৰম্ভ কৰক",
    allowLocation: "স্থানৰ অনুমতি দিয়ক",
    detectingRegion: "আপোনাৰ অঞ্চল চিনাক্ত কৰা হৈছে…",
    yourRegion: "আপোনাৰ অঞ্চল",
    regionDownload: "কেৱল আপোনাৰ ওচৰৰ চৰকাৰী কার্যালয় ডাউনলোড কৰক।",
    slide1Title: "আপোনাৰ অধিকাৰ জানক",
    slide1Desc: "50+ অধিকাৰ সহজ ভাষাত — সাংবিধানিক, RTI, শ্রম, উপভোক্তা আৰু অধিক।",
    slide2Title: "ওচৰতে সহায় বিচাৰক",
    slide2Desc: "আইনী সহায় কেন্দ্ৰ, ন্যায়ালয় আৰু আৰক্ষী থানা — এটা টেপতে।",
    slide3Title: "সদায় অফলাইন",
    slide3Desc: "ইন্টাৰনেট অবিহনে সকলো কাম কৰে। আপোনাৰ অধিকাৰ, পদ্ধতি, জৰুৰীকালীন যোগাযোগ।",
    downloadMapTitle: "অফলাইন মেপ ডাউনলোড কৰক",
    downloadMapSub: "ইন্টাৰনেট অবিহনে নেভিগেট কৰক। দূৰৱৰ্তী গাঁৱতো কাম কৰে।",
    downloadNow: "ডাউনলোড কৰক",
    notNow: "এতিয়া নহয়",
  },
  Odia: {
    selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
    comingSoon: "ଶୀଘ୍ର ଆସୁଛି",
    continue: "ଜାରି ରଖନ୍ତୁ",
    skip: "ଏଡ଼ାଇ ଦିଅନ୍ତୁ",
    next: "ପରବର୍ତ୍ତୀ",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
    allowLocation: "ସ୍ଥାନ ଅନୁମତି ଦିଅନ୍ତୁ",
    detectingRegion: "ଆପଣଙ୍କ ଅଞ୍ଚଳ ଚିହ୍ନଟ ହେଉଛି…",
    yourRegion: "ଆପଣଙ୍କ ଅଞ୍ଚଳ",
    regionDownload: "କେବଳ ଆପଣଙ୍କ ନିକଟତମ ସରକାରୀ କାର୍ଯ୍ୟାଳୟ ଡାଉନଲୋଡ କରନ୍ତୁ।",
    slide1Title: "ଆପଣଙ୍କ ଅଧିକାର ଜାଣନ୍ତୁ",
    slide1Desc: "50+ ଅଧିକାର ସରଳ ଭାଷାରେ — ସାଂବିଧାନିକ, RTI, ଶ୍ରମ, ଉପଭୋକ୍ତା ଓ ଆଉ ଅଧିକ।",
    slide2Title: "ନିକଟରେ ସାହାଯ୍ୟ ଖୋଜନ୍ତୁ",
    slide2Desc: "ଆଇନ ସହାୟତା କେନ୍ଦ୍ର, ନ୍ୟାୟାଳୟ ଓ ଥାନା — ଏକ ଟ୍ୟାପ୍‌ରେ।",
    slide3Title: "ସବୁବେଳେ ଅଫ୍‌ଲାଇନ୍",
    slide3Desc: "ଇଣ୍ଟରନେଟ୍ ବିନା ସବୁ କିଛି ଚାଲୁ ଅଛି। ଆପଣଙ୍କ ଅଧିକାର, ପ୍ରକ୍ରିୟା, ଜରୁରୀ ଯୋଗାଯୋଗ।",
    downloadMapTitle: "ଅଫ୍‌ଲାଇନ୍ ମ୍ୟାପ ଡାଉନଲୋଡ କରନ୍ତୁ",
    downloadMapSub: "ଇଣ୍ଟରନେଟ୍ ବିନା ନ୍ୟାଭିଗେଟ୍ କରନ୍ତୁ। ଦୂରବର୍ତ୍ତୀ ଗ୍ରାମରେ ମଧ୍ୟ କାର୍ଯ୍ୟ କରେ।",
    downloadNow: "ଡାଉନଲୋଡ",
    notNow: "ଏବେ ନୁହେଁ",
  },
  Punjabi: {
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    comingSoon: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    skip: "ਛੱਡੋ",
    next: "ਅਗਲਾ",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    allowLocation: "ਸਥਾਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
    detectingRegion: "ਤੁਹਾਡਾ ਖੇਤਰ ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ…",
    yourRegion: "ਤੁਹਾਡਾ ਖੇਤਰ",
    regionDownload: "ਸਿਰਫ਼ ਤੁਹਾਡੇ ਨਜ਼ਦੀਕੀ ਸਰਕਾਰੀ ਦਫ਼ਤਰ ਡਾਊਨਲੋਡ ਕਰੋ।",
    slide1Title: "ਆਪਣੇ ਅਧਿਕਾਰ ਜਾਣੋ",
    slide1Desc: "50+ ਅਧਿਕਾਰ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ — ਸੰਵਿਧਾਨਕ, RTI, ਕਿਰਤ, ਖਪਤਕਾਰ ਅਤੇ ਹੋਰ।",
    slide2Title: "ਨੇੜੇ ਮਦਦ ਲੱਭੋ",
    slide2Desc: "ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਕੇਂਦਰ, ਅਦਾਲਤਾਂ ਅਤੇ ਪੁਲਿਸ ਸਟੇਸ਼ਨ — ਇੱਕ ਟੈਪ ਵਿੱਚ।",
    slide3Title: "ਹਮੇਸ਼ਾ ਔਫਲਾਈਨ",
    slide3Desc:
      "ਇੰਟਰਨੈੱਟ ਤੋਂ ਬਿਨਾਂ ਸਭ ਕੁਝ ਕੰਮ ਕਰਦਾ ਹੈ। ਤੁਹਾਡੇ ਅਧਿਕਾਰ, ਪ੍ਰਕਿਰਿਆਵਾਂ, ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ।",
    downloadMapTitle: "ਔਫਲਾਈਨ ਮੈਪ ਡਾਊਨਲੋਡ ਕਰੋ",
    downloadMapSub: "ਇੰਟਰਨੈੱਟ ਤੋਂ ਬਿਨਾਂ ਨੈਵੀਗੇਟ ਕਰੋ। ਦੂਰ-ਦੁਰਾਡੇ ਪਿੰਡਾਂ ਵਿੱਚ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ।",
    downloadNow: "ਡਾਊਨਲੋਡ",
    notNow: "ਹੁਣ ਨਹੀਂ",
  },
  Urdu: {
    selectLanguage: "زبان منتخب کریں",
    comingSoon: "جلد آ رہا ہے",
    continue: "جاری رکھیں",
    skip: "چھوڑیں",
    next: "اگلا",
    getStarted: "شروع کریں",
    allowLocation: "مقام کی اجازت دیں",
    detectingRegion: "آپ کا علاقہ تلاش کیا جا رہا ہے…",
    yourRegion: "آپ کا علاقہ",
    regionDownload: "صرف آپ کے قریب ترین سرکاری دفاتر ڈاؤن لوڈ کریں۔",
    slide1Title: "اپنے حقوق جانیں",
    slide1Desc: "50+ حقوق آسان زبان میں — آئینی، RTI، مزدور، صارف اور مزید۔",
    slide2Title: "قریب میں مدد تلاش کریں",
    slide2Desc: "قانونی امداد مراکز، عدالتیں اور تھانے — ایک ٹیپ پر۔",
    slide3Title: "ہمیشہ آف لائن",
    slide3Desc: "انٹرنیٹ کے بغیر سب کچھ کام کرتا ہے۔ آپ کے حقوق، طریقہ کار، ہنگامی رابطے۔",
    downloadMapTitle: "آف لائن نقشہ ڈاؤن لوڈ کریں",
    downloadMapSub: "انٹرنیٹ کے بغیر نیویگیٹ کریں۔ دور دراز دیہاتوں میں بھی کام کرتا ہے۔",
    downloadNow: "ڈاؤن لوڈ",
    notNow: "ابھی نہیں",
  },
  Nepali: {
    selectLanguage: "भाषा छान्नुहोस्",
    comingSoon: "चाँडै आउँदैछ",
    continue: "जारी राख्नुहोस्",
    skip: "छोड्नुहोस्",
    next: "अर्को",
    getStarted: "सुरु गर्नुहोस्",
    allowLocation: "स्थानको अनुमति दिनुहोस्",
    detectingRegion: "तपाईंको क्षेत्र पत्ता लगाउँदैछौं…",
    yourRegion: "तपाईंको क्षेत्र",
    regionDownload: "केवल तपाईंको नजिकका सरकारी कार्यालयहरू डाउनलोड गर्नुहोस्।",
    slide1Title: "आफ्नो अधिकार जान्नुस्",
    slide1Desc: "50+ अधिकारहरू सरल भाषामा — संवैधानिक, RTI, श्रम, उपभोक्ता र थप।",
    slide2Title: "नजिकमा सहायता खोज्नुस्",
    slide2Desc: "कानुनी सहायता केन्द्र, अदालत र प्रहरी चौकी — एक ट्यापमा।",
    slide3Title: "सधैं अफलाइन",
    slide3Desc: "इन्टरनेट बिना सबै काम गर्छ। तपाईंका अधिकार, प्रक्रिया, आपत्कालीन सम्पर्क।",
    downloadMapTitle: "अफलाइन म्याप डाउनलोड गर्नुहोस्",
    downloadMapSub: "इन्टरनेट बिना नेभिगेट गर्नुहोस्। टाढाका गाउँमा पनि काम गर्छ।",
    downloadNow: "डाउनलोड",
    notNow: "अहिले होइन",
  },
  Kashmiri: {
    selectLanguage: "زبان چُنو",
    comingSoon: "جلد آنہٕ والہٕ چھُہ",
    continue: "جاری رکھو",
    skip: "چھوڈو",
    next: "اگلو",
    getStarted: "شروع کرو",
    allowLocation: "جایہٕ اجازت دیو",
    detectingRegion: "تہٕندس علاقس پتہ لگاونہٕ آمت چھُہ…",
    yourRegion: "تہٕند علاقہٕ",
    regionDownload: "صرف تہٕندس نیریس سرکاری دفترہٕ ڈاؤنلوڈ کرو۔",
    slide1Title: "اپنہٕ حق جانو",
    slide1Desc: "50+ حق آسان زبانس — آئینی، RTI، مزدور، خریدار تہ مزید۔",
    slide2Title: "نیریس مدد لبو",
    slide2Desc: "قانونی مدد مرکز، عدالت تہ تھانہٕ — اکھ ٹیپس مہٕنز۔",
    slide3Title: "ہمیشہٕ آف لائن",
    slide3Desc: "انٹرنیٹ بغیر سب کیاہ کام کرتھ چھُہ۔ تہٕند حق، طریقہٕ کار، ہنگامی رابطہٕ۔",
    downloadMapTitle: "آف لائن نقشہٕ ڈاؤن لوڈ کرو",
    downloadMapSub: "انٹرنیٹ بغیر نیویگیٹ کرو۔ دُوہ دُور گاؤں مَنز بہٕ کام کرتھ چھُہ۔",
    downloadNow: "ڈاؤن لوڈ",
    notNow: "ابھی نہ",
  },
};

const ONBOARDED_KEY = "nyaya_onboarded";

export async function markOnboarded() {
  await AsyncStorage.setItem(ONBOARDED_KEY, "1");
}

export async function hasOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDED_KEY);
  return val === "1";
}

type Step = "language" | "slides" | "location" | "mapDownload";
type SlideIndex = 0 | 1 | 2;

const STD_MIN_ZOOM = 5;
const STD_MAX_ZOOM = 10;

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setSettings } = useAppSettings();

  const [step, setStep] = useState<Step>("language");
  const [slide, setSlide] = useState<SlideIndex>(0);
  const [selectedLang, setSelectedLang] = useState<Language>("English");
  const [locLoading, setLocLoading] = useState(false);
  const [detectedRegion, setDetectedRegion] = useState("India");
  const [detectedRegionKey, setDetectedRegionKey] = useState<string>("All");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    downloaded: number;
    total: number;
    failed: number;
  } | null>(null);
  const cancelRef = useRef({ cancelled: false });
  const downloadStartedRef = useRef(false);

  const stdTileCount = useMemo(
    () => estimateTileCount(STD_MIN_ZOOM, STD_MAX_ZOOM, detectedRegionKey),
    [detectedRegionKey],
  );
  const stdSizeMb = Math.max(1, Math.round((stdTileCount * 25) / 1024));

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const s = OB[selectedLang];

  const fade = (cb: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setTimeout(cb, 120);
  };

  const confirmLanguage = () => {
    setSettings({ language: selectedLang });
    fade(() => setStep("slides"));
  };

  const goNext = () => {
    if (slide < 2) {
      fade(() => setSlide((prev) => (prev + 1) as SlideIndex));
    } else {
      fade(() => setStep("location"));
    }
  };

  const goToMapDownload = async (
    regionKey: string,
    coords?: { latitude: number; longitude: number },
  ) => {
    let displayName = regionKey !== "All" ? regionKey : "India";
    if (coords) {
      try {
        const results = await Location.reverseGeocodeAsync(coords);
        if (results.length > 0) {
          const r = results[0];
          const state = r.region ?? r.subregion ?? r.city;
          if (state) displayName = state;
        }
      } catch {}
    }
    setDetectedRegion(displayName);
    setDetectedRegionKey(regionKey);
    setLocLoading(false);
    fade(() => setStep("mapDownload"));
  };

  const handleLocation = async () => {
    setLocLoading(true);
    let region = "All";
    let coords: { latitude: number; longitude: number } | undefined;
    try {
      if (Platform.OS === "web") {
        if (navigator.geolocation) {
          await new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                region = detectRegionFromCoords(pos.coords.latitude, pos.coords.longitude);
                resolve();
              },
              () => resolve(),
              { timeout: 5000, maximumAge: 0 },
            );
          });
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          region = detectRegionFromCoords(loc.coords.latitude, loc.coords.longitude);
        }
      }
    } catch {}
    setSettings({ region });
    await saveRegionalOffices(region);
    await goToMapDownload(region, coords);
  };

  const handleMapDownload = async (regionKey: string) => {
    if (isDownloading) return;
    const total = estimateTileCount(STD_MIN_ZOOM, STD_MAX_ZOOM, regionKey);
    const free = await getFreeDiskBytes();
    const needed = estimateDownloadBytes(total);
    if (free != null && free < Math.ceil(needed * 1.2)) {
      const proceed = await new Promise<boolean>((resolve) => {
        const mb = (n: number) => `${Math.max(1, Math.round(n / (1024 * 1024)))} MB`;
        Alert.alert(
          "Low storage",
          `The offline map needs about ${mb(needed)} but only ${mb(
            free,
          )} is free. You can skip the download and add it later from the Map screen.`,
          [
            { text: "Skip", style: "cancel", onPress: () => resolve(false) },
            { text: "Download anyway", onPress: () => resolve(true) },
          ],
          { cancelable: false },
        );
      });
      if (!proceed) {
        await finish();
        return;
      }
    }
    cancelRef.current = { cancelled: false };
    setIsDownloading(true);
    setDownloadProgress({ downloaded: 0, total, failed: 0 });
    try {
      await downloadOfflineTiles(
        STD_MIN_ZOOM,
        STD_MAX_ZOOM,
        (downloaded, t, failed) => {
          setDownloadProgress({ downloaded, total: t, failed });
        },
        cancelRef.current,
        regionKey,
      );
      if (!cancelRef.current.cancelled) {
        setDownloadDone(true);
      }
    } catch {}
    setIsDownloading(false);
    await finish();
  };

  // Auto-start the regional OSM tile download as soon as we land on the
  // mapDownload step (i.e. immediately after the user's region is detected).
  useEffect(() => {
    if (step === "mapDownload" && !downloadStartedRef.current && Platform.OS !== "web") {
      downloadStartedRef.current = true;
      handleMapDownload(detectedRegionKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, detectedRegionKey]);

  const finish = async () => {
    await markOnboarded();
    router.replace("/(tabs)");
  };

  const topPad = (Platform.OS === "web" ? 56 : insets.top) + 16;
  const botPad = insets.bottom + 24;

  const SLIDES_DATA = [
    { icon: "⚖️", title: s.slide1Title, desc: s.slide1Desc },
    { icon: "🗺️", title: s.slide2Title, desc: s.slide2Desc },
    { icon: "🛡️", title: s.slide3Title, desc: s.slide3Desc },
  ] as const;

  return (
    <LinearGradient
      colors={["#1b2c3e", "#0f1d2b"]}
      style={[styles.root, { paddingTop: topPad, paddingBottom: botPad }]}
    >
      <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
        {step === "language" && (
          <LangStep selected={selectedLang} onSelect={setSelectedLang} colors={colors} s={s} />
        )}
        {step === "slides" && <SlideStep slide={SLIDES_DATA[slide]} />}
        {step === "location" && <LocStep s={s} loading={locLoading} />}
        {step === "mapDownload" && (
          <MapDownloadStep
            s={s}
            regionName={detectedRegion}
            sizeMb={stdSizeMb}
            isDownloading={isDownloading}
            downloadDone={downloadDone}
            downloadProgress={downloadProgress}
          />
        )}
      </Animated.View>

      <View style={styles.footer}>
        {/* step dots */}
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map((i) => {
            const cur = step === "language" ? 0 : step === "slides" ? slide + 1 : 4;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === cur
                    ? { width: 18, backgroundColor: "#d4af37" }
                    : { width: 6, backgroundColor: "rgba(255,255,255,0.22)" },
                ]}
              />
            );
          })}
        </View>

        {step === "language" && (
          <Pressable
            onPress={confirmLanguage}
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.82 : 1 }]}
          >
            <Text style={styles.btnText}>{s.continue}</Text>
          </Pressable>
        )}

        {step === "slides" && (
          <View style={styles.slideFooterRow}>
            {slide < 2 ? (
              <Pressable onPress={() => fade(() => setStep("location"))} style={styles.ghostBtn}>
                <Text style={styles.ghostBtnText}>{s.skip}</Text>
              </Pressable>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <Pressable
              onPress={goNext}
              style={({ pressed }) => [
                styles.btn,
                styles.btnShort,
                { opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Text style={styles.btnText}>{slide < 2 ? s.next : s.getStarted}</Text>
            </Pressable>
          </View>
        )}

        {step === "location" && !locLoading && (
          <View style={styles.locFooter}>
            <Pressable
              onPress={handleLocation}
              style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.82 : 1 }]}
            >
              <Text style={styles.btnText}>{s.allowLocation}</Text>
            </Pressable>
          </View>
        )}

        {step === "location" && locLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#d4af37" size="small" />
            <Text style={styles.loadingText}>{s.detectingRegion}</Text>
          </View>
        )}

        {step === "mapDownload" && !isDownloading && !downloadDone && (
          <View style={styles.locFooter}>
            <Pressable
              onPress={() => handleMapDownload(detectedRegionKey)}
              style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.82 : 1 }]}
            >
              <Text style={styles.btnText}>{s.downloadNow}</Text>
            </Pressable>
            <Pressable onPress={finish} style={styles.ghostBtn}>
              <Text style={styles.ghostBtnText}>{s.notNow}</Text>
            </Pressable>
          </View>
        )}

        {step === "mapDownload" && isDownloading && downloadProgress && (
          <View style={styles.downloadingRow}>
            <ActivityIndicator color="#d4af37" size="small" />
            <Text style={styles.loadingText}>
              {downloadProgress.downloaded}/{downloadProgress.total} tiles
            </Text>
            <Pressable
              onPress={() => {
                cancelRef.current.cancelled = true;
              }}
              hitSlop={10}
            >
              <Text style={styles.cancelText}>✕</Text>
            </Pressable>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

function LangStep({
  selected,
  onSelect,
  colors,
  s,
}: {
  selected: Language;
  onSelect: (l: Language) => void;
  colors: ReturnType<typeof useColors>;
  s: (typeof OB)[Language];
}) {
  return (
    <View style={ls.wrap}>
      <Text style={ls.heading}>{s.selectLanguage}</Text>
      <Text style={ls.sub}>{selected === "English" ? "भाषा चुनें" : "Select Language"}</Text>

      <ScrollView
        style={ls.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ls.list}
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = selected === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => onSelect(lang.code)}
              style={({ pressed }) => [
                ls.row,
                active && ls.rowActive,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View>
                <Text style={ls.langName}>{lang.nativeLabel}</Text>
                {lang.nativeLabel !== lang.label && <Text style={ls.langSub}>{lang.label}</Text>}
              </View>
              <View style={[ls.radio, active && ls.radioActive]}>
                {active && <View style={ls.radioDot} />}
              </View>
            </Pressable>
          );
        })}

        <Text style={ls.sectionLabel}>{s.comingSoon}</Text>

        {UPCOMING_LANGUAGES.map((lang) => (
          <View key={lang} style={[ls.row, ls.rowDisabled]}>
            <Text style={ls.langDisabled}>{lang}</Text>
            <View style={ls.badge}>
              <Text style={ls.badgeText}>{s.comingSoon}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SlideStep({ slide }: { slide: { icon: string; title: string; desc: string } }) {
  return (
    <View style={ss.wrap}>
      <Text style={ss.icon}>{slide.icon}</Text>
      <Text style={ss.title}>{slide.title}</Text>
      <Text style={ss.desc}>{slide.desc}</Text>
    </View>
  );
}

function LocStep({ s, loading }: { s: (typeof OB)[Language]; loading: boolean }) {
  return (
    <View style={ls2.wrap}>
      <Text style={ls2.icon}>📍</Text>
      <Text style={ls2.title}>{s.yourRegion}</Text>
      <Text style={ls2.desc}>{s.regionDownload}</Text>
      {loading && <ActivityIndicator color="#d4af37" size="large" style={{ marginTop: 24 }} />}
    </View>
  );
}

function MapDownloadStep({
  s,
  regionName,
  sizeMb,
  isDownloading,
  downloadDone,
  downloadProgress,
}: {
  s: (typeof OB)[Language];
  regionName: string;
  sizeMb: number;
  isDownloading: boolean;
  downloadDone: boolean;
  downloadProgress: { downloaded: number; total: number; failed: number } | null;
}) {
  const progressPct =
    downloadProgress && downloadProgress.total > 0
      ? Math.round((downloadProgress.downloaded / downloadProgress.total) * 100)
      : 0;

  return (
    <View style={mds.wrap}>
      <Text style={mds.icon}>🗺️</Text>
      <Text style={mds.title}>{s.downloadMapTitle}</Text>
      <Text style={mds.desc}>{s.downloadMapSub}</Text>

      <View style={mds.pill}>
        <Text style={mds.pillText}>
          {regionName} • ~{sizeMb} MB
        </Text>
      </View>

      {isDownloading && downloadProgress ? (
        <View style={mds.progressWrap}>
          <View style={mds.progressBar}>
            <View style={[mds.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={mds.progressLabel}>{progressPct}%</Text>
        </View>
      ) : null}

      {downloadDone ? <Text style={mds.doneText}>✓ Map saved to device</Text> : null}
    </View>
  );
}

/* ── Shared styles ─────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    gap: 12,
    paddingTop: 8,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  btn: {
    backgroundColor: "#d4af37",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnShort: {
    flex: 1,
    paddingVertical: 13,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#0f1d2b",
    letterSpacing: 0.2,
  },
  ghostBtn: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  ghostBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.4)",
  },
  slideFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locFooter: {
    gap: 2,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  downloadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
  },
  cancelText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 6,
  },
});

/* ── Language step ──────────────────────────────── */
const ls = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 8,
  },
  heading: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.38)",
    marginTop: 2,
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  list: {
    gap: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  rowActive: {
    borderColor: "#d4af37",
    backgroundColor: "rgba(212,175,55,0.12)",
  },
  rowDisabled: {
    opacity: 0.42,
  },
  langName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  langSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.42)",
    marginTop: 1,
  },
  langDisabled: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.55)",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#d4af37",
    backgroundColor: "#d4af37",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0f1d2b",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.28)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.38)",
  },
});

/* ── Slide step ──────────────────────────────────── */
const ss = StyleSheet.create({
  wrap: {
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 52,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  desc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 23,
  },
});

/* ── Location step ───────────────────────────────── */
const ls2 = StyleSheet.create({
  wrap: {
    gap: 14,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.6,
  },
  desc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 23,
  },
});

/* ── Map download step ───────────────────────────── */
const mds = StyleSheet.create({
  wrap: {
    gap: 16,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 52,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  desc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 23,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,175,55,0.16)",
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#d4af37",
  },
  progressWrap: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#d4af37",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.5)",
    textAlign: "right",
  },
  doneText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#4ade80",
  },
});
