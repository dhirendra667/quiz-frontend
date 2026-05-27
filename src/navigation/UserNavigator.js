import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import QuizListScreen from '../screens/user/QuizListScreen';
import AttemptQuizScreen from '../screens/user/AttemptQuizScreen';
import ResultScreen from '../screens/user/ResultScreen';
import HistoryScreen from '../screens/user/HistoryScreen';

const Stack = createNativeStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#a5b4fc',
        headerTitleStyle: { fontWeight: 'bold', color: '#f1f5f9' },
      }}
    >
      <Stack.Screen
        name="QuizList"
        component={QuizListScreen}
        options={{ title: 'Available Quizzes' }}
      />
      <Stack.Screen
        name="AttemptQuiz"
        component={AttemptQuizScreen}
        options={{ title: 'Quiz', headerShown: false }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Your Result', headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'My History' }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
