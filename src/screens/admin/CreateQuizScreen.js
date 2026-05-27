import React, { useState } from 'react';
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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const CreateQuizScreen = ({ navigation }) => {
  const { authFetch } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !timeLimit.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const minutes = parseInt(timeLimit, 10);

    if (isNaN(minutes) || minutes < 1) {
      Alert.alert('Error', 'Time limit must be a positive number');
      return;
    }

    try {
      setLoading(true);

      const data = await authFetch('/quizzes', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          timeLimitMinutes: minutes,
        }),
      });

      if (data.success) {
        Alert.alert('Quiz Created!', 'Now add some questions to it.', [
          {
            text: 'Add Questions',
            onPress: () =>
              navigation.replace('AddQuestion', {
                quizId: data.quiz._id,
                quizTitle: data.quiz.title,
              }),
          },
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.navigate('AdminDashboard'),
          },
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          <Text className="text-slate-400 text-base mb-8">
            Fill in the details below to create a new quiz.
          </Text>

          <View className="space-y-5">
            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Quiz Title
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="e.g. JavaScript Basics"
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Description
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="What is this quiz about?"
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Time Limit (minutes)
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="e.g. 15"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                value={timeLimit}
                onChangeText={setTimeLimit}
              />
            </View>

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl py-4 mt-4 items-center"
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Create Quiz
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateQuizScreen;
