import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const QuizCard = ({ quiz, onPress }) => (
  <TouchableOpacity
    className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700 active:opacity-80"
    onPress={onPress}
  >
    <Text className="text-white font-bold text-lg mb-2">{quiz.title}</Text>
    <Text className="text-slate-400 text-sm mb-3" numberOfLines={2}>
      {quiz.description}
    </Text>

    <View className="flex-row justify-between items-center">
      <View className="flex-row space-x-4">
        <Text className="text-indigo-400 text-sm"> {quiz.timeLimitMinutes} min</Text>
        <Text className="text-indigo-400 text-sm"> {quiz.questionCount} questions</Text>
      </View>
      <Text className="text-slate-500 text-sm">Start →</Text>
    </View>
  </TouchableOpacity>
);

const QuizListScreen = ({ navigation }) => {
  const { authFetch, user, logout } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const data = await authFetch('/quizzes');
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load quizzes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuizzes();
    }, [])
  );

  const handleStartQuiz = (quiz) => {
    if (quiz.questionCount === 0) {
      Alert.alert('Not Available', 'This quiz has no questions yet.');
      return;
    }

    navigation.navigate('AttemptQuiz', {
      quizId: quiz._id,
      quizTitle: quiz.title,
      timeLimitMinutes: quiz.timeLimitMinutes,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* Top bar */}
      <View className="px-4 pt-12 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white font-bold text-xl">Available Quizzes</Text>
          <Text className="text-slate-400 text-sm">Hey, {user?.name} </Text>
        </View>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
            onPress={() => navigation.navigate('History')}
          >
            <Text className="text-indigo-400 text-sm font-medium">History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
            onPress={logout}
          >
            <Text className="text-red-400 text-sm font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchQuizzes();
            }}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-slate-500 text-base">No quizzes available</Text>
            <Text className="text-slate-600 text-sm mt-1">Check back later!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <QuizCard quiz={item} onPress={() => handleStartQuiz(item)} />
        )}
      />
    </View>
  );
};

export default QuizListScreen;
