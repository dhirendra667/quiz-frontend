import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const QuizCard = ({ quiz, onToggle, onDelete, onViewSubmissions, onAddQuestion, navigation }) => {
  return (
    <View className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
      {/* Title row */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white font-bold text-lg flex-1 mr-2" numberOfLines={2}>
          {quiz.title}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            quiz.isActive ? 'bg-green-900' : 'bg-red-900'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              quiz.isActive ? 'text-green-300' : 'text-red-300'
            }`}
          >
            {quiz.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <Text className="text-slate-400 text-sm mb-3" numberOfLines={2}>
        {quiz.description}
      </Text>

      <View className="flex-row space-x-4 mb-3">
        <Text className="text-indigo-400 text-sm">
          ⏱ {quiz.timeLimitMinutes} min
        </Text>
        <Text className="text-indigo-400 text-sm">
           {quiz.questionCount} questions
        </Text>
      </View>

      {/* Action buttons */}
      <View className="flex-row flex-wrap gap-2">
        <TouchableOpacity
          className="bg-indigo-700 rounded-lg px-3 py-2"
          onPress={() =>
            navigation.navigate('AddQuestion', { quizId: quiz._id, quizTitle: quiz.title })
          }
        >
          <Text className="text-white text-xs font-medium">+ Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-700 rounded-lg px-3 py-2"
          onPress={() => onViewSubmissions(quiz._id, quiz.title)}
        >
          <Text className="text-white text-xs font-medium">Submissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-lg px-3 py-2 ${
            quiz.isActive ? 'bg-yellow-800' : 'bg-green-800'
          }`}
          onPress={() => onToggle(quiz._id, quiz.isActive, quiz.questionCount)}
        >
          <Text className="text-white text-xs font-medium">
            {quiz.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-900 rounded-lg px-3 py-2"
          onPress={() => onDelete(quiz._id, quiz.title)}
        >
          <Text className="text-red-300 text-xs font-medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdminDashboard = ({ navigation }) => {
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

  // Refresh whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchQuizzes();
    }, [])
  );

  const handleToggle = async (quizId, currentStatus, questionCount) => {
    // Client-side guard for empty quiz activation
    if (!currentStatus && questionCount === 0) {
      Alert.alert(
        'Cannot Activate',
        'Add at least one question before activating this quiz.'
      );
      return;
    }

    try {
      const data = await authFetch(`/quizzes/${quizId}/toggle`, {
        method: 'PATCH',
      });

      if (data.success) {
        setQuizzes((prev) =>
          prev.map((q) =>
            q._id === quizId ? { ...q, isActive: !currentStatus } : q
          )
        );
        Alert.alert('Done', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleDelete = (quizId, title) => {
    Alert.alert(
      'Delete Quiz',
      `Delete "${title}"? If it has submissions, it will be deactivated instead.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const data = await authFetch(`/quizzes/${quizId}`, {
                method: 'DELETE',
              });

              if (data.success) {
                Alert.alert('Done', data.message);
                fetchQuizzes();
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };

  const handleViewSubmissions = (quizId, title) => {
    navigation.navigate('QuizSubmissions', { quizId, quizTitle: title });
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
          <Text className="text-white font-bold text-xl">Admin Dashboard</Text>
          <Text className="text-slate-400 text-sm">Hey, {user?.name}</Text>
        </View>
        <TouchableOpacity
          className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
          onPress={logout}
        >
          <Text className="text-red-400 text-sm font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz list */}
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
            <Text className="text-slate-500 text-base">No quizzes yet.</Text>
            <Text className="text-slate-600 text-sm mt-1">
              Tap + to create your first quiz.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <QuizCard
            quiz={item}
            navigation={navigation}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onViewSubmissions={handleViewSubmissions}
          />
        )}
      />

      {/* FAB — Create Quiz */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('CreateQuiz')}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboard;
