import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, auth } from '../firebase'; // Adjust path to your Firebase config

const ReportFraudScreen = ({ navigation }) => {
  const [fraudType, setFraudType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [location, setLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [priority, setPriority] = useState('medium');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const fraudTypes = [
    { id: 'phishing', title: 'Phishing Email/SMS', icon: 'mail', color: '#FF3B30' },
    { id: 'fake_website', title: 'Fake Website', icon: 'globe', color: '#FF9500' },
    { id: 'identity_theft', title: 'Identity Theft', icon: 'person', color: '#5856D6' },
    { id: 'financial_fraud', title: 'Financial Fraud', icon: 'card', color: '#34C759' },
    { id: 'social_engineering', title: 'Social Engineering', icon: 'people', color: '#007AFF' },
    { id: 'malware', title: 'Malware/Virus', icon: 'bug', color: '#FF2D92' },
    { id: 'ransomware', title: 'Ransomware', icon: 'lock-closed', color: '#8E8E93' },
    { id: 'data_breach', title: 'Data Breach', icon: 'shield-outline', color: '#FF6B35' },
    { id: 'crypto_scam', title: 'Cryptocurrency Scam', icon: 'logo-bitcoin', color: '#F7931E' },
    { id: 'other', title: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  const priorityLevels = [
    { id: 'low', title: 'Low Priority', color: '#34C759', description: 'Minor issue, can wait' },
    { id: 'medium', title: 'Medium Priority', color: '#FF9500', description: 'Moderate concern' },
    { id: 'high', title: 'High Priority', color: '#FF3B30', description: 'Urgent attention needed' },
    { id: 'critical', title: 'Critical', color: '#8B0000', description: 'Immediate action required' },
  ];

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to add evidence.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newEvidence = result.assets.map(asset => ({
          id: Date.now() + Math.random(),
          type: 'image',
          uri: asset.uri,
          name: `evidence_${Date.now()}.jpg`,
        }));
        setEvidence([...evidence, ...newEvidence]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/msword'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        const newEvidence = result.assets.map(asset => ({
          id: Date.now() + Math.random(),
          type: 'document',
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
        }));
        setEvidence([...evidence, ...newEvidence]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeEvidence = (id) => {
    setEvidence(evidence.filter(item => item.id !== id));
  };

  const uploadEvidence = async (evidenceItem) => {
    try {
      const response = await fetch(evidenceItem.uri);
      const blob = await response.blob();
      
      const fileName = `evidence/${Date.now()}_${evidenceItem.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        ...evidenceItem,
        downloadURL,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }
  };

  const validateForm = () => {
    if (!fraudType) {
      Alert.alert('Missing Information', 'Please select a fraud type');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description');
      return false;
    }
    return true;
  };

  const handleSubmitReport = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email;
      
      // Upload evidence files
      let uploadedEvidence = [];
      if (evidence.length > 0) {
        uploadedEvidence = await Promise.all(
          evidence.map(item => uploadEvidence(item))
        );
      }

      // Create report document
      const reportData = {
        fraudType,
        title: title.trim(),
        description: description.trim(),
        contactInfo: contactInfo.trim(),
        location: location.trim(),
        dateOccurred: dateOccurred.trim(),
        priority,
        anonymous,
        evidence: uploadedEvidence,
        reporterId: anonymous ? null : userId,
        reporterEmail: anonymous ? null : userEmail,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        reviewedBy: null,
        resolution: null,
      };

      const docRef = await addDoc(collection(db, 'fraudReports'), reportData);
      
      Alert.alert(
        'Report Submitted',
        `Your fraud report has been submitted successfully. Report ID: ${docRef.id.slice(-6)}. We will review it within 24-48 hours.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFraudType('');
              setTitle('');
              setDescription('');
              setContactInfo('');
              setLocation('');
              setDateOccurred('');
              setEvidence([]);
              setPriority('medium');
              setAnonymous(false);
              setStep(1);
              navigation?.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Submission Failed', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 1 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Type</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 2 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Details</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 3 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 3 && styles.activeStepText]}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Evidence</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 4 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 4 && styles.activeStepText]}>4</Text>
        </View>
        <Text style={styles.stepLabel}>Submit</Text>
      </View>
    </View>
  );

  const renderFraudTypeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>What type of fraud are you reporting?</Text>
      <View style={styles.fraudTypeGrid}>
        {fraudTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.fraudTypeCard,
              fraudType === type.id && styles.selectedFraudType
            ]}
            onPress={() => setFraudType(type.id)}
          >
            <View style={[styles.fraudTypeIcon, { backgroundColor: type.color + '20' }]}>
              <Ionicons name={type.icon} size={24} color={type.color} />
            </View>
            <Text style={styles.fraudTypeTitle}>{type.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDetailsForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Provide Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Title *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Brief description of the incident"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Provide detailed information about what happened..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Contact Information</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Phone number, email, or other contact info"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Where did this occur? (Optional)"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date Occurred</Text>
        <TextInput
          style={styles.textInput}
          placeholder="When did this happen? (e.g., Dec 15, 2024)"
          value={dateOccurred}
          onChangeText={setDateOccurred}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {priorityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.priorityOption,
                priority === level.id && { backgroundColor: level.color + '20', borderColor: level.color }
              ]}
              onPress={() => setPriority(level.id)}
            >
              <View style={styles.priorityHeader}>
                <Text style={[
                  styles.priorityTitle,
                  priority === level.id && { color: level.color }
                ]}>
                  {level.title}
                </Text>
              </View>
              <Text style={styles.priorityDescription}>{level.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEvidenceSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Add Evidence (Optional)</Text>
      <Text style={styles.sectionDescription}>
        Screenshots, emails, documents, or other proof can help us investigate faster.
      </Text>

      <View style={styles.evidenceActions}>
        <TouchableOpacity style={styles.evidenceBtn} onPress={handleImagePicker}>
          <Ionicons name="camera" size={20} color="#007AFF" />
          <Text style={styles.evidenceBtnText}>Add Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.evidenceBtn} onPress={handleDocumentPicker}>
          <Ionicons name="document" size={20} color="#007AFF" />
          <Text style={styles.evidenceBtnText}>Add Documents</Text>
        </TouchableOpacity>
      </View>

      {evidence.length > 0 && (
        <View style={styles.evidenceList}>
          <Text style={styles.evidenceListTitle}>Added Evidence:</Text>
          {evidence.map((item) => (
            <View key={item.id} style={styles.evidenceItem}>
              <View style={styles.evidenceInfo}>
                <Ionicons 
                  name={item.type === 'image' ? 'image' : 'document'} 
                  size={20} 
                  color="#007AFF" 
                />
                <Text style={styles.evidenceName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.size && (
                  <Text style={styles.evidenceSize}>
                    {(item.size / 1024 / 1024).toFixed(1)} MB
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeEvidence(item.id)}
              >
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderReviewSection = () => {
    const selectedFraudType = fraudTypes.find(type => type.id === fraudType);
    const selectedPriority = priorityLevels.find(level => level.id === priority);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review Your Report</Text>
        
        <View style={styles.reviewCard}>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Fraud Type:</Text>
            <Text style={styles.reviewValue}>{selectedFraudType?.title}</Text>
          </View>
          
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Title:</Text>
            <Text style={styles.reviewValue}>{title}</Text>
          </View>
          
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Priority:</Text>
            <Text style={[styles.reviewValue, { color: selectedPriority?.color }]}>
              {selectedPriority?.title}
            </Text>
          </View>
          
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Evidence:</Text>
            <Text style={styles.reviewValue}>
              {evidence.length} file{evidence.length !== 1 ? 's' : ''} attached
            </Text>
          </View>
        </View>

        <View style={styles.anonymousContainer}>
          <TouchableOpacity
            style={styles.anonymousOption}
            onPress={() => setAnonymous(!anonymous)}
          >
            <Ionicons 
              name={anonymous ? "checkbox" : "square-outline"} 
              size={24} 
              color="#007AFF" 
            />
            <Text style={styles.anonymousText}>Submit anonymously</Text>
          </TouchableOpacity>
          <Text style={styles.anonymousDescription}>
            Your identity will not be shared with anyone reviewing this report
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Fraud</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && renderFraudTypeSelection()}
          {step === 2 && renderDetailsForm()}
          {step === 3 && renderEvidenceSection()}
          {step === 4 && renderReviewSection()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.navBtn, styles.backBtn]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {step < 4 ? (
            <TouchableOpacity
              style={[styles.navBtn, styles.nextBtn, !fraudType && step === 1 && styles.disabledBtn]}
              onPress={() => {
                if (step === 1 && !fraudType) return;
                if (step === 2 && (!title.trim() || !description.trim())) {
                  Alert.alert('Missing Information', 'Please fill in required fields');
                  return;
                }
                setStep(step + 1);
              }}
              disabled={step === 1 && !fraudType}
            >
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, styles.submitBtn]}
              onPress={handleSubmitReport}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  stepLine: {
    width: 40,
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  fraudTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fraudTypeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedFraudType: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  fraudTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fraudTypeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginTop: 8,
  },
  priorityOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 8,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  priorityDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  evidenceActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  evidenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  evidenceBtnText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  evidenceList: {
    marginTop: 16,
  },
  evidenceListTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  evidenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  evidenceName: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  evidenceSize: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  removeBtn: {
    padding: 4,
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  anonymousContainer: {
    marginTop: 16,
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  anonymousText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  anonymousDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 36,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  nextBtn: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#34C759',
    marginLeft: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledBtn: {
    backgroundColor: '#E5E5EA',
  },
});

export default ReportFraudScreen;