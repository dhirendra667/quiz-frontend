import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const ResultScreen = ({ navigation, route }) => {
  const { result, quizTitle, timedOut } = route.params;
  const { score, totalQuestions, percentage } = result;

  const getGrade = () => {
    if (percentage >= 80) return { label: 'Excellent!', color: 'text-green-400', emoji: '🏆' };
    if (percentage >= 60) return { label: 'Good Job!', color: 'text-blue-400', emoji: '👍' };
    if (percentage >= 40) return { label: 'Not Bad', color: 'text-yellow-400', emoji: '📚' };
    return { label: 'Keep Practicing', color: 'text-red-400', emoji: '💪' };
  };

  const grade = getGrade();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center px-6">
        {/* Timed out banner */}
        {timedOut && (
          <View className="bg-orange-900 rounded-xl px-4 py-2 mb-6 border border-orange-700">
            <Text className="text-orange-300 text-sm font-medium text-center">
              ⏱ Time ran out — your answers were auto-submitted
            </Text>
          </View>
        )}

        {/* Emoji */}
        <Text className="text-6xl mb-4">{grade.emoji}</Text>

        <Text className={`text-3xl font-bold mb-2 ${grade.color}`}>
          {grade.label}
        </Text>

        <Text className="text-slate-400 text-base text-center mb-8">
          {quizTitle}
        </Text>

        {/* Score card */}
        <View className="bg-slate-800 rounded-3xl p-8 w-full border border-slate-700 items-center mb-8">
          <Text className="text-slate-400 text-sm mb-2">Your Score</Text>
          <Text className="text-white text-6xl font-bold mb-1">
            {score}
            <Text className="text-slate-500 text-3xl">/{totalQuestions}</Text>
          </Text>
          <Text className={`text-2xl font-bold mt-2 ${grade.color}`}>
            {percentage}%
          </Text>
        </View>

        {/* Actions */}
        <View className="w-full space-y-3">
          <TouchableOpacity
            className="bg-indigo-600 rounded-xl py-4 items-center"
            onPress={() => navigation.navigate('QuizList')}
          >
            <Text className="text-white font-bold text-base">
              Back to Quizzes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-800 rounded-xl py-4 items-center border border-slate-700"
            onPress={() => navigation.navigate('History')}
          >
            <Text className="text-slate-300 font-medium text-base">
              View My History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;
