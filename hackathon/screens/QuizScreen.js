import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Comprehensive quiz questions for different demographics
const QUIZ_QUESTIONS = {
  student: [
    {
      id: 1,
      question: "Your friend sends you a link to 'download free textbooks' via WhatsApp. What should you do?",
      options: [
        "Click immediately - free textbooks!",
        "Check if the website is legitimate first",
        "Share it with other friends",
        "Download without thinking"
      ],
      correct: 1,
      explanation: "Always verify links before clicking. Scammers often use attractive offers like 'free textbooks' to trick students.",
      tip: "Use official educational websites and libraries for legitimate resources."
    },
    {
      id: 2,
      question: "You're using public Wi-Fi at your college cafe. Which activity is SAFE?",
      options: [
        "Online banking",
        "Checking social media",
        "Shopping with credit card",
        "Accessing email with passwords"
      ],
      correct: 1,
      explanation: "Public Wi-Fi is not secure. Only browse non-sensitive content. Avoid banking, shopping, or accessing accounts with personal data.",
      tip: "Use your mobile data or a VPN for sensitive activities on public networks."
    }
  ],
  professional: [
    {
      id: 1,
      question: "You receive an urgent email from 'IT Support' asking for your login credentials to fix a security issue. What do you do?",
      options: [
        "Reply with username and password immediately",
        "Call IT department to verify the request",
        "Forward the email to colleagues",
        "Ignore the email completely"
      ],
      correct: 1,
      explanation: "Legitimate IT departments never ask for passwords via email. Always verify such requests through official channels.",
      tip: "When in doubt, call your IT department using the official number, not the one in the suspicious email."
    },
    {
      id: 2,
      question: "Your company allows personal devices for work (BYOD). What's the most important security measure?",
      options: [
        "Using the same password for work and personal apps",
        "Installing a mobile device management (MDM) solution",
        "Connecting to any available Wi-Fi",
        "Sharing work files via personal cloud storage"
      ],
      correct: 1,
      explanation: "MDM solutions help separate work and personal data, ensuring company data remains secure on personal devices.",
      tip: "Always follow your company's BYOD policy and keep work and personal data separate."
    }
  ],
  homemaker: [
    {
      id: 1,
      question: "You see an ad on Facebook offering a 'work from home' opportunity requiring a small registration fee. What's your best response?",
      options: [
        "Pay immediately to secure the opportunity",
        "Research the company thoroughly first",
        "Share it with friends and family",
        "Provide personal information to learn more"
      ],
      correct: 1,
      explanation: "Legitimate employers never ask for upfront fees. This is a common scam targeting people looking for flexible work.",
      tip: "Research companies through official websites, check reviews, and never pay fees to get a job."
    },
    {
      id: 2,
      question: "Your child wants to download a new game app. What should you check first?",
      options: [
        "If the app is free",
        "App permissions and reviews",
        "If friends are playing it",
        "The app's graphics quality"
      ],
      correct: 1,
      explanation: "Always check what permissions an app requests and read reviews. Some apps collect unnecessary personal data.",
      tip: "Use parental controls and teach children about digital privacy from an early age."
    }
  ],
  rural: [
    {
      id: 1,
      question: "You receive a call claiming to be from your bank, asking to verify your PIN for a 'security update'. What should you do?",
      options: [
        "Provide the PIN since they called from the bank",
        "Hang up and call your bank directly",
        "Ask them to call back later",
        "Give partial information to be safe"
      ],
      correct: 1,
      explanation: "Banks never ask for PINs or passwords over the phone. Scammers often target rural areas with such calls.",
      tip: "Always hang up and call your bank using the official number on your bank card or statement."
    },
    {
      id: 2,
      question: "Someone offers to help you set up mobile banking and asks for your phone to 'make it easier'. What do you do?",
      options: [
        "Hand over your phone - they're being helpful",
        "Politely decline and visit the bank branch instead",
        "Let them help but watch closely",
        "Ask them to explain verbally while you do it"
      ],
      correct: 1,
      explanation: "Never let others handle your phone for financial apps. Visit your bank branch for official assistance with mobile banking setup.",
      tip: "Bank staff can guide you through mobile banking setup at the branch safely."
    }
  ],
  senior: [
    {
      id: 1,
      question: "You receive a pop-up on your computer saying 'Your computer is infected! Call this number immediately!' What should you do?",
      options: [
        "Call the number immediately",
        "Close the pop-up and run your antivirus",
        "Click to scan your computer",
        "Pay for the 'urgent' fix"
      ],
      correct: 1,
      explanation: "These are fake security warnings designed to scare you. Close the pop-up and use your legitimate antivirus software.",
      tip: "Real security software doesn't use scary pop-ups or ask you to call phone numbers."
    },
    {
      id: 2,
      question: "Your grandchild calls urgently needing money wired for an 'emergency'. They sound different and won't video call. What do you do?",
      options: [
        "Send money immediately - family emergency!",
        "Call your grandchild's parents to verify",
        "Ask for more details over the phone",
        "Send a smaller amount to be safe"
      ],
      correct: 1,
      explanation: "This is a common 'grandparent scam'. Scammers research families and pretend to be relatives in distress.",
      tip: "Always verify by calling other family members or asking questions only your real grandchild would know."
    }
  ]
};

const DEMOGRAPHIC_CONFIG = {
  student: { color: "#3B82F6", icon: "school-outline" },
  professional: { color: "#10B981", icon: "briefcase-outline" },
  homemaker: { color: "#F59E0B", icon: "home-outline" },
  rural: { color: "#8B5CF6", icon: "leaf-outline" },
  senior: { color: "#EF4444", icon: "people-outline" }
};

export default function QuizScreen({ navigation, route }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [demographic, setDemographic] = useState('student');
  const [questions, setQuestions] = useState([]);
  const [progressAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Get demographic from route params or default to student
    const userDemo = route?.params?.demographic || 'student';
    setDemographic(userDemo);
    setQuestions(QUIZ_QUESTIONS[userDemo] || QUIZ_QUESTIONS.student);
  }, [route]);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, questions.length]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);

    setShowExplanation(true);
  };

  const proceedToNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    progressAnim.setValue(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You're a cybersecurity expert! 🛡️";
    if (percentage >= 80) return "Great job! You're well-prepared for cyber threats! 🎉";
    if (percentage >= 60) return "Good work! Keep learning to stay safer online 📚";
    return "Keep practicing! Cybersecurity awareness is crucial 💪";
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "#10B981";
    if (percentage >= 60) return "#F59E0B";
    return "#EF4444";
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz questions...</Text>
      </SafeAreaView>
    );
  }

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Complete!</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <View style={[styles.resultIcon, { backgroundColor: getScoreColor() + '20' }]}>
              <Ionicons 
                name={score === questions.length ? "trophy" : score >= questions.length * 0.6 ? "medal" : "ribbon"} 
                size={50} 
                color={getScoreColor()} 
              />
            </View>
            
            <Text style={styles.resultTitle}>Your Score</Text>
            <Text style={[styles.resultScore, { color: getScoreColor() }]}>
              {score}/{questions.length}
            </Text>
            <Text style={styles.resultPercentage}>
              {Math.round((score / questions.length) * 100)}% Correct
            </Text>
            
            <View style={styles.messageCard}>
              <Text style={styles.resultMessage}>{getScoreMessage()}</Text>
            </View>

            <View style={styles.improvementSection}>
              <Text style={styles.improvementTitle}>Key Takeaways:</Text>
              <View style={styles.takeawayItem}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.takeawayText}>Always verify before you trust</Text>
              </View>
              <View style={styles.takeawayItem}>
                <Ionicons name="lock-closed" size={20} color="#10B981" />
                <Text style={styles.takeawayText}>Keep personal information private</Text>
              </View>
              <View style={styles.takeawayItem}>
                <Ionicons name="call" size={20} color="#10B981" />
                <Text style={styles.takeawayText}>When in doubt, call official numbers</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.retryButton} onPress={restartQuiz}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => Alert.alert("Share", "Challenge your friends to take the quiz!")}
              >
                <Ionicons name="share-social" size={20} color="#6366F1" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];
  const demoConfig = DEMOGRAPHIC_CONFIG[demographic];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cyber Safety Quiz</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.quizCard, { opacity: fadeAnim }]}>
          {/* Demographic Badge */}
          <View style={styles.demographicBadge}>
            <Ionicons name={demoConfig.icon} size={16} color={demoConfig.color} />
            <Text style={[styles.demographicText, { color: demoConfig.color }]}>
              {demographic.charAt(0).toUpperCase() + demographic.slice(1)} Focus
            </Text>
          </View>

          {/* Question */}
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showExplanation && index === currentQ.correct && styles.correctOption,
                  showExplanation && selectedAnswer === index && index !== currentQ.correct && styles.wrongOption
                ]}
                onPress={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                    showExplanation && index === currentQ.correct && styles.correctOptionText
                  ]}>
                    {option}
                  </Text>
                  {showExplanation && index === currentQ.correct && (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== currentQ.correct && (
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationContainer}>
              <View style={styles.explanationHeader}>
                <Ionicons 
                  name={selectedAnswer === currentQ.correct ? "checkmark-circle" : "information-circle"} 
                  size={24} 
                  color={selectedAnswer === currentQ.correct ? "#10B981" : "#6366F1"} 
                />
                <Text style={styles.explanationTitle}>
                  {selectedAnswer === currentQ.correct ? "Correct!" : "Learn More"}
                </Text>
              </View>
              
              <Text style={styles.explanationText}>{currentQ.explanation}</Text>
              
              <View style={styles.tipContainer}>
                <Ionicons name="lightbulb" size={16} color="#F59E0B" />
                <Text style={styles.tipText}>{currentQ.tip}</Text>
              </View>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedAnswer === null && !showExplanation && styles.disabledButton
            ]}
            onPress={showExplanation ? proceedToNext : handleNextQuestion}
            disabled={selectedAnswer === null && !showExplanation}
          >
            <Text style={styles.actionButtonText}>
              {showExplanation 
                ? (currentQuestion + 1 === questions.length ? "See Results" : "Next Question")
                : "Submit Answer"
              }
            </Text>
            <Ionicons 
              name={showExplanation ? "arrow-forward" : "checkmark"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#6366F1",
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  placeholder: {
    width: 40,
    height: 40,
  },
  
  progressContainer: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  progressBackground: {
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 4,
    marginBottom: 8,
  },
  
  progressFill: {
    height: 8,
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  quizCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    marginBottom: 40,
  },
  
  demographicBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  
  demographicText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  
  questionText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 28,
    marginBottom: 24,
  },
  
  optionsContainer: {
    marginBottom: 24,
  },
  
  optionButton: {
    backgroundColor: "#334155",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#334155",
  },
  
  selectedOption: {
    borderColor: "#6366F1",
    backgroundColor: "#1E293B",
  },
  
  correctOption: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  
  wrongOption: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  
  optionLetter: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366F1",
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: "center",
    lineHeight: 32,
    marginRight: 12,
  },
  
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#94A3B8",
    lineHeight: 22,
  },
  
  selectedOptionText: {
    color: "#FFFFFF",
  },
  
  correctOptionText: {
    color: "#10B981",
  },
  
  explanationContainer: {
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  explanationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  
  explanationText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 22,
    marginBottom: 12,
  },
  
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  
  tipText: {
    fontSize: 14,
    color: "#F59E0B",
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  
  actionButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  
  disabledButton: {
    backgroundColor: "#475569",
  },
  
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  
  loadingText: {
    color: "#94A3B8",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  resultCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  
  resultIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  
  resultScore: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  
  resultPercentage: {
    fontSize: 18,
    color: "#94A3B8",
    marginBottom: 24,
  },
  
  messageCard: {
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  
  resultMessage: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
  },
  
  improvementSection: {
    width: "100%",
    marginBottom: 32,
  },
  
  improvementTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  
  takeawayItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  
  takeawayText: {
    fontSize: 14,
    color: "#94A3B8",
    marginLeft: 12,
    flex: 1,
  },
  
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  
  retryButton: {
    flex: 1,
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  
  shareButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  
  shareButtonText: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});