import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

// Small pill showing already-added questions
const QuestionPill = ({ index, text }) => (
  <View className="bg-slate-800 rounded-lg px-3 py-2 mb-2 flex-row items-center">
    <Text className="text-indigo-400 font-bold mr-2">Q{index + 1}.</Text>
    <Text className="text-slate-300 text-sm flex-1" numberOfLines={1}>
      {text}
    </Text>
  </View>
);

const AddQuestionScreen = ({ navigation, route }) => {
  const { quizId, quizTitle } = route.params;
  const { authFetch } = useAuth();

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [fetchingExisting, setFetchingExisting] = useState(true);

  // Load already-added questions on mount
  useEffect(() => {
    fetchExistingQuestions();
  }, []);

  const fetchExistingQuestions = async () => {
    try {
      const data = await authFetch(`/questions?quizId=${quizId}`);
      if (data.success) {
        setSavedQuestions(data.questions);
      }
    } catch (error) {
      // silently fail — not blocking
    } finally {
      setFetchingExisting(false);
    }
  };

  const updateOption = (text, index) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOption(null);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Error', 'Question text is required');
      return;
    }

    if (options.some((o) => !o.trim())) {
      Alert.alert('Error', 'All 4 options must be filled in');
      return;
    }

    if (correctOption === null) {
      Alert.alert('Error', 'Please select the correct answer');
      return;
    }

    try {
      setLoading(true);

      const data = await authFetch('/questions', {
        method: 'POST',
        body: JSON.stringify({
          quizId,
          questionText: questionText.trim(),
          options: options.map((o) => o.trim()),
          correctOption,
        }),
      });

      if (data.success) {
        setSavedQuestions((prev) => [...prev, data.question]);
        resetForm();
        Alert.alert('Added!', 'Question saved. Add another or go back.');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-4">
          {/* Quiz name */}
          <View className="bg-indigo-950 rounded-xl p-3 mb-6 border border-indigo-800">
            <Text className="text-indigo-300 text-xs mb-1">Adding to quiz</Text>
            <Text className="text-indigo-100 font-semibold">{quizTitle}</Text>
          </View>

          {/* Already saved questions */}
          {fetchingExisting ? (
            <ActivityIndicator size="small" color="#6366f1" className="mb-4" />
          ) : savedQuestions.length > 0 ? (
            <View className="mb-6">
              <Text className="text-slate-400 text-sm mb-2">
                {savedQuestions.length} question(s) saved
              </Text>
              {savedQuestions.map((q, i) => (
                <QuestionPill key={q._id} index={i} text={q.questionText} />
              ))}
            </View>
          ) : null}

          {/* Form */}
          <Text className="text-white font-bold text-base mb-4">
            New Question
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Question
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="Enter your question here..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={questionText}
                onChangeText={setQuestionText}
              />
            </View>

            {/* Options */}
            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Options{' '}
                <Text className="text-slate-500 text-xs">
                  (tap the correct one)
                </Text>
              </Text>

              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center mb-3 rounded-xl border px-4 py-3 ${
                    correctOption === index
                      ? 'bg-green-900 border-green-600'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                  onPress={() => setCorrectOption(index)}
                >
                  <Text
                    className={`font-bold mr-3 w-5 text-center ${
                      correctOption === index
                        ? 'text-green-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {optionLabels[index]}
                  </Text>
                  <TextInput
                    className={`flex-1 text-base ${
                      correctOption === index ? 'text-green-100' : 'text-white'
                    }`}
                    placeholder={`Option ${optionLabels[index]}`}
                    placeholderTextColor="#64748b"
                    value={option}
                    onChangeText={(text) => updateOption(text, index)}
                    // Stop pressing the option label from losing focus
                    onPressIn={() => setCorrectOption(index)}
                  />
                  {correctOption === index && (
                    <Text className="text-green-400 ml-2">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl py-4 mt-2 items-center"
              onPress={handleAddQuestion}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Save Question
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Text className="text-slate-400 text-sm">
                Done — Back to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddQuestionScreen;
