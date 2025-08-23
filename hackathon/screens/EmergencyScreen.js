import React, { useState } from "react";
import { 
  View, 
  Text, 
  Linking, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Dimensions 
} from "react-native";

const { width } = Dimensions.get('window');

const translations = {
  en: {
    title: "EMERGENCY HELP",
    subtitle: "Cyber fraud victim? Act immediately to minimize damage",
    urgencyText: "⏰ Report within 24 hours for better recovery chances",
    callCyberTitle: "CALL CYBER HELPLINE",
    callCyberSubtitle: "1930 - Free & Available 24/7",
    reportOnlineTitle: "REPORT ONLINE",
    reportOnlineSubtitle: "cybercrime.gov.in Portal",
    callPoliceTitle: "CALL POLICE",
    callPoliceSubtitle: "100 - Emergency Services",
    emailTitle: "EMAIL COMPLAINT",
    emailSubtitle: "complaints@cybercrime.gov.in",
    immediateActions: "IMMEDIATE ACTIONS",
    tips: [
      "Stop any ongoing transactions immediately",
      "Take screenshots of fraud messages/calls",
      "Change all passwords and PINs now",
      "Call your bank's fraud helpline",
      "Note down transaction IDs and amounts"
    ],
    footer: "Remember: Never share OTP, passwords, or card details with anyone",
    alertTitles: {
      callCyber: "Call Cyber Helpline",
      callPolice: "Call Police"
    },
    alertMessages: {
      callCyber: "This will call the Indian Cybercrime Helpline (1930)",
      callPolice: "This will call emergency services (100)"
    },
    alertButtons: {
      cancel: "Cancel",
      callNow: "Call Now"
    }
  },
  kn: {
    title: "ತುರ್ತು ಸಹಾಯ",
    subtitle: "ಸೈಬರ್ ವಂಚನೆಯ ಬಲಿಪಾಲು? ಹಾನಿ ಕಡಿಮೆ ಮಾಡಲು ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ",
    urgencyText: "⏰ ಉತ್ತಮ ಮರುಪ್ರಾಪ್ತಿ ಅವಕಾಶಗಳಿಗಾಗಿ 24 ಗಂಟೆಗಳೊಳಗೆ ವರದಿ ಮಾಡಿ",
    callCyberTitle: "ಸೈಬರ್ ಹೆಲ್ಪ್‌ಲೈನ್ ಗೆ ಕರೆ ಮಾಡಿ",
    callCyberSubtitle: "1930 - ಉಚಿತ ಮತ್ತು 24/7 ಲಭ್ಯ",
    reportOnlineTitle: "ಆನ್‌ಲೈನ್ ವರದಿ ಮಾಡಿ",
    reportOnlineSubtitle: "cybercrime.gov.in ಪೋರ್ಟಲ್",
    callPoliceTitle: "ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ",
    callPoliceSubtitle: "100 - ತುರ್ತು ಸೇವೆಗಳು",
    emailTitle: "ಇಮೇಲ್ ದೂರು",
    emailSubtitle: "complaints@cybercrime.gov.in",
    immediateActions: "ತುರ್ತು ಕ್ರಮಗಳು",
    tips: [
      "ನಡೆಯುತ್ತಿರುವ ಯಾವುದೇ ವ್ಯವಹಾರಗಳನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ",
      "ವಂಚನೆಯ ಸಂದೇಶಗಳು/ಕರೆಗಳ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ತೆಗೆಯಿರಿ",
      "ಎಲ್ಲಾ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಮತ್ತು PIN ಗಳನ್ನು ಈಗಲೇ ಬದಲಾಯಿಸಿ",
      "ನಿಮ್ಮ ಬ್ಯಾಂಕಿನ ವಂಚನೆ ಹೆಲ್ಪ್‌ಲೈನ್ ಗೆ ಕರೆ ಮಾಡಿ",
      "ವ್ಯವಹಾರ ID ಗಳು ಮತ್ತು ಮೊತ್ತಗಳನ್ನು ಗಮನಿಸಿ"
    ],
    footer: "ನೆನಪಿಡಿ: OTP, ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಅಥವಾ ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
    alertTitles: {
      callCyber: "ಸೈಬರ್ ಹೆಲ್ಪ್‌ಲೈನ್ ಗೆ ಕರೆ ಮಾಡಿ",
      callPolice: "ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ"
    },
    alertMessages: {
      callCyber: "ಇದು ಭಾರತೀಯ ಸೈಬರ್‌ಕ್ರೈಮ್ ಹೆಲ್ಪ್‌ಲೈನ್ (1930) ಗೆ ಕರೆ ಮಾಡುತ್ತದೆ",
      callPolice: "ಇದು ತುರ್ತು ಸೇವೆಗಳಿಗೆ (100) ಕರೆ ಮಾಡುತ್ತದೆ"
    },
    alertButtons: {
      cancel: "ರದ್ದುಮಾಡಿ",
      callNow: "ಈಗಲೇ ಕರೆ ಮಾಡಿ"
    }
  }
};

export default function EmergencyScreen() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const currentTranslations = translations[language];

  const callHelpline = () => {
    Alert.alert(
      currentTranslations.alertTitles.callCyber,
      currentTranslations.alertMessages.callCyber,
      [
        { text: currentTranslations.alertButtons.cancel, style: "cancel" },
        { text: currentTranslations.alertButtons.callNow, onPress: () => Linking.openURL("tel:1930") }
      ]
    );
  };

  const reportOnline = () => {
    Linking.openURL("https://www.cybercrime.gov.in/");
  };

  const callPolice = () => {
    Alert.alert(
      currentTranslations.alertTitles.callPolice,
      currentTranslations.alertMessages.callPolice,
      [
        { text: currentTranslations.alertButtons.cancel, style: "cancel" },
        { text: currentTranslations.alertButtons.callNow, onPress: () => Linking.openURL("tel:100") }
      ]
    );
  };

  const sendEmail = () => {
    Linking.openURL("mailto:complaints@cybercrime.gov.in");
  };

  const EmergencyButton = ({ title, subtitle, onPress, backgroundColor, icon }) => (
    <TouchableOpacity 
      style={[styles.emergencyButton, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonIcon}>{icon}</Text>
      <Text style={[styles.buttonTitle, language === 'kn' && styles.kannadaButtonTitle]}>
        {title}
      </Text>
      <Text style={[styles.buttonSubtitle, language === 'kn' && styles.kannadaText]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  const QuickTip = ({ icon, text }) => (
    <View style={styles.tipContainer}>
      <Text style={styles.tipIcon}>{icon}</Text>
      <Text style={[styles.tipText, language === 'kn' && styles.kannadaText]}>
        {text}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.alertBadge}>
            <Text style={styles.alertIcon}>🚨</Text>
          </View>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageButtonText}>
              {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.title, language === 'kn' && styles.kannadaTitle]}>
          {currentTranslations.title}
        </Text>
        <Text style={[styles.subtitle, language === 'kn' && styles.kannadaText]}>
          {currentTranslations.subtitle}
        </Text>
      </View>

      <View style={styles.urgencyBanner}>
        <Text style={[styles.urgencyText, language === 'kn' && styles.kannadaText]}>
          {currentTranslations.urgencyText}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <EmergencyButton
          title={currentTranslations.callCyberTitle}
          subtitle={currentTranslations.callCyberSubtitle}
          onPress={callHelpline}
          backgroundColor="#FF4444"
          icon="📞"
        />
        
        <EmergencyButton
          title={currentTranslations.reportOnlineTitle}
          subtitle={currentTranslations.reportOnlineSubtitle}
          onPress={reportOnline}
          backgroundColor="#FF6B35"
          icon="🌐"
        />
        
        <EmergencyButton
          title={currentTranslations.callPoliceTitle}
          subtitle={currentTranslations.callPoliceSubtitle}
          onPress={callPolice}
          backgroundColor="#DC143C"
          icon="🚔"
        />
        
        <EmergencyButton
          title={currentTranslations.emailTitle}
          subtitle={currentTranslations.emailSubtitle}
          onPress={sendEmail}
          backgroundColor="#FF8C42"
          icon="✉️"
        />
      </View>

      <View style={styles.tipsSection}>
        <Text style={[styles.tipsTitle, language === 'kn' && styles.kannadaTitle]}>
          {currentTranslations.immediateActions}
        </Text>
        
        {currentTranslations.tips.map((tip, index) => {
          const icons = ["🛑", "📱", "🔒", "🏦", "📝"];
          return (
            <QuickTip 
              key={index}
              icon={icons[index]} 
              text={tip}
            />
          );
        })}
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  alertBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIcon: {
    fontSize: 40,
  },
  languageButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  kannadaTitle: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
  },
  kannadaText: {
    lineHeight: 26,
    fontSize: 15,
  },
  urgencyBanner: {
    backgroundColor: '#FFE4B5',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  emergencyButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  kannadaButtonTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  tipsSection: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  footer: {
    backgroundColor: '#FF4444',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
});