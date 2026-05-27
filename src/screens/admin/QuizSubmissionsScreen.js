import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const SubmissionCard = ({ item, totalQuestions }) => {
  const percent = Math.round((item.score / item.totalQuestions) * 100);

  return (
    <View className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white font-semibold text-base">
          {item.userId?.name || 'Unknown'}
        </Text>
        <Text
          className={`font-bold text-base ${
            percent >= 70
              ? 'text-green-400'
              : percent >= 40
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}
        >
          {item.score}/{item.totalQuestions}
        </Text>
      </View>

      <Text className="text-slate-400 text-xs mb-2">
        {item.userId?.email}
      </Text>

      <View className="flex-row justify-between">
        <Text className="text-slate-400 text-xs">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.timedOut && (
          <Text className="text-orange-400 text-xs">⏱ Timed out</Text>
        )}
        <Text
          className={`text-xs font-medium ${
            percent >= 70
              ? 'text-green-400'
              : percent >= 40
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}
        >
          {percent}%
        </Text>
      </View>
    </View>
  );
};

const QuizSubmissionsScreen = ({ route }) => {
  const { quizId, quizTitle } = route.params;
  const { authFetch } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await authFetch(`/quizzes/${quizId}/submissions`);

      if (data.success) {
        setSubmissions(data.submissions);
        setQuizInfo(data.quiz);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
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
      <FlatList
        data={submissions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-white font-bold text-xl mb-1">
              {quizTitle}
            </Text>
            <Text className="text-slate-400 text-sm">
              {submissions.length} submission(s)
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Text className="text-slate-500 text-base">No submissions yet</Text>
          </View>
        }
        renderItem={({ item }) => <SubmissionCard item={item} />}
      />
    </View>
  );
};

export default QuizSubmissionsScreen;
