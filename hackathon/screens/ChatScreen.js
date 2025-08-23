import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import api from "../services/api";

const { width, height } = Dimensions.get('window');

// Predefined quick actions for cybersecurity topics
const QUICK_ACTIONS = [
  {
    id: 1,
    text: "What is phishing?",
    kannada: "ಫಿಶಿಂಗ್ ಎಂದರೇನು?",
    icon: "mail-outline",
    category: "phishing"
  },
  {
    id: 2,
    text: "How to create strong passwords?",
    kannada: "ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್ ಹೇಗೆ ರಚಿಸುವುದು?",
    icon: "lock-closed-outline",
    category: "passwords"
  },
  {
    id: 3,
    text: "Safe online shopping tips",
    kannada: "ಸುರಕ್ಷಿತ ಆನ್‌ಲೈನ್ ಶಾಪಿಂಗ್ ಸಲಹೆಗಳು",
    icon: "card-outline",
    category: "shopping"
  },
  {
    id: 4,
    text: "Social media safety",
    kannada: "ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಸುರಕ್ಷತೆ",
    icon: "people-outline",
    category: "social"
  }
];

// Welcome messages
const WELCOME_MESSAGES = {
  english: "👋 Hello! I'm your Cyber Safety Assistant. I can help you learn about online security in English and Kannada. What would you like to know?",
  kannada: "👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸೈಬರ್ ಸುರಕ್ಷತಾ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಆನ್‌ಲೈನ್ ಸುರಕ್ಷತೆಯ ಬಗ್ಗೆ ಕಲಿಸಲು ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?"
};

export default function ChatbotScreen({ navigation }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollViewRef = useRef();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: Date.now(),
      from: "bot",
      text: WELCOME_MESSAGES[language],
      timestamp: new Date(),
      type: "welcome"
    };
    setMessages([welcomeMessage]);

    // Animate welcome message
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, [language]);

  const sendMessage = async (messageText = input, isQuickAction = false) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setShowQuickActions(false);

    // Enhanced prompt for cybersecurity education
    const enhancedPrompt = `
    You are a cybersecurity education assistant for people in Karnataka, India. 
    User's preferred language: ${language}
    
    Guidelines:
    1. If user writes in Kannada or asks for Kannada, respond in Kannada
    2. If user writes in English, respond in English
    3. Focus on practical cybersecurity advice
    4. Use simple, easy-to-understand language
    5. Give examples relevant to Indian context (UPI, Aadhaar, etc.)
    6. Be encouraging and supportive
    7. Add emojis to make it friendly
    8. Keep responses concise but informative
    
    User message: "${messageText}"
    
    Provide helpful cybersecurity education and awareness.
    `;

    try {
      const res = await api.post("/chat", { 
        message: enhancedPrompt,
        context: "cybersecurity_education",
        language: language 
      });
      
      const botMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: res.data.reply || "I'm here to help with cybersecurity questions!",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = language === "kannada" 
        ? "ಕ್ಷಮಿಸಿ, ತಾಂತ್ರಿಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. 🔄"
        : "Sorry, there was a technical error. Please try again. 🔄";
        
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        from: "bot",
        text: errorMessage,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "english" ? "kannada" : "english";
    setLanguage(newLang);
    setShowQuickActions(true);
  };

  const handleQuickAction = (action) => {
    const message = language === "english" ? action.text : action.kannada;
    sendMessage(message, true);
  };

  const clearChat = () => {
    Alert.alert(
      language === "english" ? "Clear Chat" : "ಚಾಟ್ ಕ್ಲಿಯರ್ ಮಾಡಿ",
      language === "english" 
        ? "Are you sure you want to clear the chat history?" 
        : "ನೀವು ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಕ್ಲಿಯರ್ ಮಾಡಲು ಖಚಿತವಾಗಿ ಬಯಸುತ್ತೀರಾ?",
      [
        { text: language === "english" ? "Cancel" : "ರದ್ದು", style: "cancel" },
        { 
          text: language === "english" ? "Clear" : "ಕ್ಲಿಯರ್", 
          style: "destructive",
          onPress: () => {
            setMessages([{
              id: Date.now(),
              from: "bot",
              text: WELCOME_MESSAGES[language],
              timestamp: new Date(),
              type: "welcome"
            }]);
            setShowQuickActions(true);
          }
        }
      ]
    );
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message, index) => {
    const isUser = message.from === "user";
    const isError = message.isError;
    
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
          { opacity: fadeAnim }
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.botMessage,
          isError && styles.errorMessage
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.botMessageText,
            isError && styles.errorMessageText
          ]}>
            {message.text}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {language === "english" ? "Cyber Safety Assistant" : "ಸೈಬರ್ ಸುರಕ್ಷತಾ ಸಹಾಯಕ"}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.statusText}>
              {language === "english" ? "Online" : "ಆನ್‌ಲೈನ್"}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageText}>
              {language === "english" ? "ಕನ್ನಡ" : "EN"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.typingIndicator}>
                <View style={styles.botAvatar}>
                  <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        {showQuickActions && !isLoading && (
          <Animated.View style={[
            styles.quickActionsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Text style={styles.quickActionsTitle}>
              {language === "english" ? "Quick Topics:" : "ತ್ವರಿತ ವಿಷಯಗಳು:"}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickActions}>
                {QUICK_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction(action)}
                  >
                    <Ionicons name={action.icon} size={20} color="#6366F1" />
                    <Text style={styles.quickActionText}>
                      {language === "english" ? action.text : action.kannada}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder={
                language === "english" 
                  ? "Ask me about cybersecurity..." 
                  : "ಸೈಬರ್ ಸುರಕ್ಷತೆಯ ಬಗ್ಗೆ ಕೇಳಿ..."
              }
              placeholderTextColor="#64748B"
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage()}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons 
                name={isLoading ? "hourglass" : "send"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#6366F1",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  
  statusText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  languageButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  
  languageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  keyboardView: {
    flex: 1,
  },
  
  messagesContainer: {
    flex: 1,
  },
  
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  userMessage: {
    backgroundColor: "#6366F1",
    borderBottomRightRadius: 4,
  },
  
  botMessage: {
    backgroundColor: "#1E293B",
    borderBottomLeftRadius: 4,
  },
  
  errorMessage: {
    backgroundColor: "#7F1D1D",
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
  },
  
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  
  userMessageText: {
    color: "#FFFFFF",
  },
  
  botMessageText: {
    color: "#FFFFFF",
  },
  
  errorMessageText: {
    color: "#FCA5A5",
  },
  
  timestamp: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    alignSelf: "flex-end",
  },
  
  loadingContainer: {
    marginVertical: 8,
  },
  
  typingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  
  typingBubble: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  typingDots: {
    flexDirection: "row",
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#64748B",
    marginHorizontal: 2,
  },
  
  quickActionsContainer: {
    backgroundColor: "#1E293B",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 12,
  },
  
  quickActions: {
    flexDirection: "row",
  },
  
  quickActionButton: {
    backgroundColor: "#334155",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
  },
  
  quickActionText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    flex: 1,
  },
  
  inputContainer: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#334155",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  
  sendButtonDisabled: {
    backgroundColor: "#475569",
  },
});