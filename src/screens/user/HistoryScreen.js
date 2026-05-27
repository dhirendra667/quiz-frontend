import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HistoryCard = ({ item }) => {
  const { quiz, score, totalQuestions, percentage, timedOut, attemptedAt } = item;

  const getColor = () => {
    if (percentage >= 70) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <View className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white font-semibold text-base flex-1 mr-3" numberOfLines={2}>
          {quiz?.title || 'Deleted Quiz'}
        </Text>
        <Text className={`font-bold text-lg ${getColor()}`}>
          {percentage}%
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-slate-400 text-sm">
          {score} / {totalQuestions} correct
        </Text>
        <View className="flex-row items-center space-x-2">
          {timedOut && (
            <Text className="text-orange-400 text-xs">⏱ timed out</Text>
          )}
          <Text className="text-slate-500 text-xs">
            {new Date(attemptedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const HistoryScreen = () => {
  const { authFetch } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await authFetch('/attempts/my-history');

      if (data.success) {
        setHistory(data.history);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load history');
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

  // Simple stats
  const totalAttempts = history.length;
  const avgPercent =
    totalAttempts > 0
      ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalAttempts)
      : 0;

  return (
    <View className="flex-1 bg-slate-900">
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          totalAttempts > 0 ? (
            <View className="flex-row space-x-3 mb-6">
              <View className="flex-1 bg-slate-800 rounded-2xl p-4 items-center border border-slate-700">
                <Text className="text-slate-400 text-xs mb-1">Attempts</Text>
                <Text className="text-white font-bold text-2xl">{totalAttempts}</Text>
              </View>
              <View className="flex-1 bg-slate-800 rounded-2xl p-4 items-center border border-slate-700">
                <Text className="text-slate-400 text-xs mb-1">Avg Score</Text>
                <Text className="text-indigo-400 font-bold text-2xl">{avgPercent}%</Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-slate-500 text-base">No attempts yet</Text>
            <Text className="text-slate-600 text-sm mt-1">
              Go attempt a quiz to see your history here
            </Text>
          </View>
        }
        renderItem={({ item }) => <HistoryCard item={item} />}
      />
    </View>
  );
};

export default HistoryScreen;
