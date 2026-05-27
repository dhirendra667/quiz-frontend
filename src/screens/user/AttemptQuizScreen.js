import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const AttemptQuizScreen = ({ navigation, route }) => {
  const { quizId, quizTitle, timeLimitMinutes } = route.params;
  const { authFetch } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60); // seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const answersRef = useRef(answers); // keep latest answers in ref for timer callback

  // Keep answersRef in sync
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await authFetch(`/quizzes/${quizId}`);

      if (!data.success) {
        Alert.alert('Error', data.message || 'Failed to load quiz');
        navigation.goBack();
        return;
      }

      // Check if user already attempted
      if (data.message === 'You have already attempted this quiz') {
        Alert.alert('Already Attempted', 'You can only attempt each quiz once.');
        navigation.goBack();
        return;
      }

      setQuestions(data.questions);
      setLoading(false);
      startTimer();
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz');
      navigation.goBack();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    // Save current answer
    const currentQuestion = questions[currentIndex];
    const updated = {
      ...answers,
      [currentQuestion._id]: selectedOption !== null ? selectedOption : -1,
    };
    setAnswers(updated);
    answersRef.current = updated;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Restore previously selected option for next question if any
      const nextQId = questions[currentIndex + 1]._id;
      setSelectedOption(updated[nextQId] !== undefined ? updated[nextQId] : null);
    }
  };

  const handleSubmit = () => {
    // Save current question's answer before submitting
    const currentQuestion = questions[currentIndex];
    const finalAnswers = {
      ...answers,
      [currentQuestion._id]: selectedOption !== null ? selectedOption : -1,
    };

    Alert.alert('Submit Quiz?', 'Are you sure you want to submit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => submitAnswers(finalAnswers, false),
      },
    ]);
  };

  const handleAutoSubmit = () => {
    submitAnswers(answersRef.current, true);
  };

  const submitAnswers = async (finalAnswers, timedOut) => {
    if (submitting) return;

    clearInterval(timerRef.current);
    setSubmitting(true);

    // Build answers array — any unanswered question gets -1
    const answersArray = questions.map((q) => ({
      questionId: q._id,
      selectedOption:
        finalAnswers[q._id] !== undefined ? finalAnswers[q._id] : -1,
    }));

    try {
      const data = await authFetch('/attempts', {
        method: 'POST',
        body: JSON.stringify({ quizId, answers: answersArray, timedOut }),
      });

      if (data.success) {
        navigation.replace('Result', {
          result: data.result,
          quizTitle,
          timedOut,
        });
      } else {
        // Handle already-attempted case gracefully
        if (data.message?.includes('already attempted')) {
          Alert.alert('Already Attempted', data.message);
          navigation.navigate('QuizList');
        } else {
          Alert.alert('Error', data.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Submission failed. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-slate-400 mt-3">Loading quiz...</Text>
      </View>
    );
  }

  if (submitting) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-slate-400 mt-3">Submitting your answers...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const optionLabels = ['A', 'B', 'C', 'D'];
  const timerDanger = timeLeft <= 60;

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* Header */}
      <View className="px-4 pt-4 pb-3 border-b border-slate-800">
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-400 text-sm" numberOfLines={1} style={{ flex: 1 }}>
            {quizTitle}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ml-3 ${
              timerDanger ? 'bg-red-900' : 'bg-slate-800'
            }`}
          >
            <Text
              className={`font-bold text-sm ${
                timerDanger ? 'text-red-300' : 'text-indigo-300'
              }`}
            >
              ⏱ {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View className="mt-3 bg-slate-800 rounded-full h-1.5">
          <View
            className="bg-indigo-500 h-1.5 rounded-full"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </View>

        <Text className="text-slate-500 text-xs mt-1">
          Question {currentIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Question */}
      <View className="flex-1 px-4 py-6">
        <Text className="text-white text-xl font-semibold mb-8 leading-7">
          {currentQuestion.questionText}
        </Text>

        {/* Options */}
        <View className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center rounded-2xl px-4 py-4 border ${
                selectedOption === index
                  ? 'bg-indigo-700 border-indigo-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
              onPress={() => handleSelectOption(index)}
            >
              <View
                className={`w-8 h-8 rounded-full mr-3 items-center justify-center ${
                  selectedOption === index ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedOption === index ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {optionLabels[index]}
                </Text>
              </View>
              <Text
                className={`flex-1 text-base ${
                  selectedOption === index ? 'text-white' : 'text-slate-300'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom nav */}
      <View className="px-4 pb-8 pt-2 border-t border-slate-800">
        {isLastQuestion ? (
          <TouchableOpacity
            className="bg-green-600 rounded-2xl py-4 items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold text-base">
              Submit Quiz
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-indigo-600 rounded-2xl py-4 items-center"
            onPress={handleNext}
          >
            <Text className="text-white font-bold text-base">
              Next Question →
            </Text>
          </TouchableOpacity>
        )}

        {/* Skip hint */}
        <Text className="text-slate-600 text-xs text-center mt-2">
          You can skip — unanswered questions won't count
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AttemptQuizScreen;
