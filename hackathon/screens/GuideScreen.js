import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Animated,
  Dimensions 
} from "react-native";

const { width } = Dimensions.get('window');

const translations = {
  en: {
    title: "Cyber Safety Guides",
    subtitle: "Stay protected with these essential cybersecurity tips",
    categories: "Categories",
    tips: "Safety Tips",
    footer: "💡 Remember: When in doubt, don't click, don't share, don't pay!",
  },
  kn: {
    title: "ಸೈಬರ್ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿಗಳು",
    subtitle: "ಈ ಅತ್ಯಗತ್ಯ ಸೈಬರ್ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿರಿ",
    categories: "ವರ್ಗಗಳು",
    tips: "ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು",
    footer: "💡 ನೆನಪಿಡಿ: ಸಂದೇಹವಿದ್ದಾಗ, ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ, ಹಂಚಿಕೊಳ್ಳಬೇಡಿ, ಪಾವತಿಸಬೇಡಿ!",
  }
};

const guides = {
  en: {
    "UPI Safety": {
      icon: "💳",
      color: "#4CAF50",
      tips: [
        "Never share your UPI PIN with anyone",
        "Do not approve random collect requests on UPI apps",
        "Verify recipient details before sending money",
        "Use only official banking apps from app stores",
        "Enable app lock for additional security"
      ]
    },
    "Phishing Awareness": {
      icon: "🎣",
      color: "#FF5722",
      tips: [
        "Check the sender's email before clicking links",
        "Avoid downloading attachments from unknown emails",
        "Banks never ask for passwords or OTPs via email",
        "Look for spelling mistakes in fake emails",
        "Hover over links to see actual destination"
      ]
    },
    "Social Media Safety": {
      icon: "📱",
      color: "#2196F3",
      tips: [
        "Use strong passwords for your social accounts",
        "Do not overshare personal information",
        "Beware of fake friend requests",
        "Check privacy settings regularly",
        "Think before you post - it stays forever"
      ]
    },
    "OTP Scams": {
      icon: "🔐",
      color: "#9C27B0",
      tips: [
        "Never share OTPs received on your phone",
        "Legit companies never ask for OTP over calls",
        "Report suspicious calls to 1930 immediately",
        "OTPs are valid only for the person who requested them",
        "Banks will never call asking for OTP verification"
      ]
    },
    "Online Shopping Safety": {
      icon: "🛒",
      color: "#FF9800",
      tips: [
        "Shop only on secure websites (https://)",
        "Check seller ratings and reviews",
        "Use secure payment methods",
        "Avoid deals that seem too good to be true",
        "Keep receipts and transaction records"
      ]
    },
    "WiFi Security": {
      icon: "📶",
      color: "#607D8B",
      tips: [
        "Avoid public WiFi for sensitive activities",
        "Use strong passwords for home WiFi",
        "Turn off auto-connect to open networks",
        "Use VPN on public networks if necessary",
        "Forget unused WiFi networks from your device"
      ]
    }
  },
  kn: {
    "UPI ಸುರಕ್ಷತೆ": {
      icon: "💳",
      color: "#4CAF50",
      tips: [
        "ನಿಮ್ಮ UPI PIN ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
        "UPI ಅಪ್ಲಿಕೇಶನ್‌ಗಳಲ್ಲಿ ಅಜ್ಞಾತ collect ವಿನಂತಿಗಳನ್ನು ಅನುಮೋದಿಸಬೇಡಿ",
        "ಹಣ ಕಳುಹಿಸುವ ಮೊದಲು ಸ್ವೀಕರಿಸುವವರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
        "ಅಪ್ ಸ್ಟೋರ್‌ನಿಂದ ಮಾತ್ರ ಅಧಿಕೃತ ಬ್ಯಾಂಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಬಳಸಿ",
        "ಹೆಚ್ಚುವರಿ ಸುರಕ್ಷತೆಗಾಗಿ ಅಪ್ ಲಾಕ್ ಸಕ್ರಿಯಗೊಳಿಸಿ"
      ]
    },
    "ಫಿಶಿಂಗ್ ಅರಿವು": {
      icon: "🎣",
      color: "#FF5722",
      tips: [
        "ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವ ಮೊದಲು ಕಳುಹಿಸಿದವರ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ",
        "ಅಜ್ಞಾತ ಇಮೇಲ್‌ಗಳಿಂದ ಅಟ್ಯಾಚ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ",
        "ಬ್ಯಾಂಕುಗಳು ಇಮೇಲ್ ಮೂಲಕ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ OTP ಕೇಳುವುದಿಲ್ಲ",
        "ನಕಲಿ ಇಮೇಲ್‌ಗಳಲ್ಲಿನ ಕಾಗುಣಿತ ತಪ್ಪುಗಳನ್ನು ಗಮನಿಸಿ",
        "ನಿಜವಾದ ಗಮ್ಯಸ್ಥಾನವನ್ನು ನೋಡಲು ಲಿಂಕ್‌ಗಳ ಮೇಲೆ ಹೋವರ್ ಮಾಡಿ"
      ]
    },
    "ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಸುರಕ್ಷತೆ": {
      icon: "📱",
      color: "#2196F3",
      tips: [
        "ನಿಮ್ಮ ಸಾಮಾಜಿಕ ಖಾತೆಗಳಿಗೆ ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿ",
        "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಅತಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
        "ನಕಲಿ ಸ್ನೇಹಿತರ ವಿನಂತಿಗಳಿಗೆ ಜಾಗರೂಕರಾಗಿರಿ",
        "ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ",
        "ಪೋಸ್ಟ್ ಮಾಡುವ ಮೊದಲು ಯೋಚಿಸಿ - ಇದು ಶಾಶ್ವತವಾಗಿ ಉಳಿಯುತ್ತದೆ"
      ]
    },
    "OTP ವಂಚನೆಗಳು": {
      icon: "🔐",
      color: "#9C27B0",
      tips: [
        "ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಬರುವ OTP ಗಳನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
        "ನ್ಯಾಯಸಮ್ಮತ ಕಂಪನಿಗಳು ಕರೆ ಮೂಲಕ OTP ಕೇಳುವುದಿಲ್ಲ",
        "ಅನುಮಾನಾಸ್ಪದ ಕರೆಗಳನ್ನು ತಕ್ಷಣ 1930 ಗೆ ವರದಿ ಮಾಡಿ",
        "OTP ಗಳು ಅವುಗಳನ್ನು ಕೇಳಿದ ವ್ಯಕ್ತಿಗೆ ಮಾತ್ರ ಮಾನ್ಯ",
        "OTP ಪರಿಶೀಲನೆಗಾಗಿ ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ಕರೆ ಮಾಡುವುದಿಲ್ಲ"
      ]
    },
    "ಆನ್‌ಲೈನ್ ಶಾಪಿಂಗ್ ಸುರಕ್ಷತೆ": {
      icon: "🛒",
      color: "#FF9800",
      tips: [
        "ಸುರಕ್ಷಿತ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಮಾತ್ರ ಶಾಪಿಂಗ್ ಮಾಡಿ (https://)",
        "ಮಾರಾಟಗಾರರ ರೇಟಿಂಗ್ ಮತ್ತು ವಿಮರ್ಶೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
        "ಸುರಕ್ಷಿತ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಬಳಸಿ",
        "ತುಂಬಾ ಒಳ್ಳೆಯದಾಗಿ ತೋರುವ ಡೀಲ್‌ಗಳನ್ನು ತಪ್ಪಿಸಿ",
        "ರಶೀದಿಗಳು ಮತ್ತು ವ್ಯವಹಾರದ ದಾಖಲೆಗಳನ್ನು ಇರಿಸಿಕೊಳ್ಳಿ"
      ]
    },
    "ವೈಫೈ ಸುರಕ್ಷತೆ": {
      icon: "📶",
      color: "#607D8B",
      tips: [
        "ಸೂಕ್ಷ್ಮ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಾರ್ವಜನಿಕ ವೈಫೈ ತಪ್ಪಿಸಿ",
        "ಮನೆಯ ವೈಫೈಗೆ ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿ",
        "ತೆರೆದ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗೆ ಸ್ವಯಂ-ಸಂಪರ್ಕವನ್ನು ಆಫ್ ಮಾಡಿ",
        "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಸಾರ್ವಜನಿಕ ನೆಟ್‌ವರ್ಕ್‌ಗಳಲ್ಲಿ VPN ಬಳಸಿ",
        "ನಿಮ್ಮ ಸಾಧನದಿಂದ ಬಳಕೆಯಿಲ್ಲದ ವೈಫೈ ನೆಟ್‌ವರ್ಕ್‌ಗಳನ್ನು ಮರೆಯಿರಿ"
      ]
    }
  }
};

export default function GuidesScreen() {
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState('en');
  const [animations] = useState(() => {
    const animValues = {};
    Object.keys(guides.en).forEach(key => {
      animValues[key] = new Animated.Value(0);
    });
    return animValues;
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
    setSelected(null); // Close any open sections when switching languages
  };

  const toggleGuide = (category) => {
    if (selected === category) {
      // Collapse
      Animated.timing(animations[Object.keys(guides.en)[Object.keys(guides[language]).indexOf(category)]], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setSelected(null);
    } else {
      // Collapse previous if exists
      if (selected) {
        const prevIndex = Object.keys(guides[language]).indexOf(selected);
        const prevKey = Object.keys(guides.en)[prevIndex];
        Animated.timing(animations[prevKey], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      
      // Expand new
      setSelected(category);
      const currentIndex = Object.keys(guides[language]).indexOf(category);
      const currentKey = Object.keys(guides.en)[currentIndex];
      Animated.timing(animations[currentKey], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const GuideCard = ({ category, data }) => {
    const isSelected = selected === category;
    const animationKey = Object.keys(guides.en)[Object.keys(guides[language]).indexOf(category)];
    const animatedHeight = animations[animationKey].interpolate({
      inputRange: [0, 1],
      outputRange: [0, data.tips.length * 70 + 40], // Increased height for Kannada text
    });

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { 
              backgroundColor: data.color,
              shadowColor: data.color,
            }
          ]}
          onPress={() => toggleGuide(category)}
          activeOpacity={0.8}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryLeft}>
              <Text style={styles.categoryIcon}>{data.icon}</Text>
              <Text style={styles.categoryTitle}>{category}</Text>
            </View>
            <Text style={[
              styles.expandIcon,
              { transform: [{ rotate: isSelected ? '180deg' : '0deg' }] }
            ]}>
              ▼
            </Text>
          </View>
        </TouchableOpacity>

        <Animated.View style={[
          styles.tipsContainer,
          { 
            height: animatedHeight,
            opacity: animations[animationKey]
          }
        ]}>
          <View style={styles.tipsContent}>
            {data.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={[styles.tipDot, { backgroundColor: data.color }]} />
                <Text style={[styles.tipText, language === 'kn' && styles.kannadaText]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  const currentGuides = guides[language];
  const currentTranslations = translations[language];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerIcon}>🛡️</Text>
            <Text style={[styles.title, language === 'kn' && styles.kannadaTitle]}>
              {currentTranslations.title}
            </Text>
          </View>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageButtonText}>
              {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, language === 'kn' && styles.kannadaText]}>
          {currentTranslations.subtitle}
        </Text>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Object.keys(currentGuides).length}</Text>
          <Text style={[styles.statLabel, language === 'kn' && styles.kannadaText]}>
            {currentTranslations.categories}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Object.values(currentGuides).reduce((sum, guide) => sum + guide.tips.length, 0)}
          </Text>
          <Text style={[styles.statLabel, language === 'kn' && styles.kannadaText]}>
            {currentTranslations.tips}
          </Text>
        </View>
      </View>

      <View style={styles.guidesContainer}>
        {Object.entries(currentGuides).map(([category, data]) => (
          <GuideCard key={category} category={category} data={data} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, language === 'kn' && styles.kannadaText]}>
          {currentTranslations.footer}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  kannadaTitle: {
    fontSize: 22,
    lineHeight: 30,
  },
  languageButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  kannadaText: {
    lineHeight: 26,
    fontSize: 15,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 20,
  },
  guidesContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryButton: {
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    lineHeight: 24,
  },
  expandIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  tipsContainer: {
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  tipsContent: {
    padding: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 9,
    marginRight: 16,
    minWidth: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  footer: {
    backgroundColor: '#e8f5e8',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    textAlign: 'center',
    lineHeight: 24,
  },
});