import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../screens/admin/AdminDashboard';
import CreateQuizScreen from '../screens/admin/CreateQuizScreen';
import AddQuestionScreen from '../screens/admin/AddQuestionScreen';
import QuizSubmissionsScreen from '../screens/admin/QuizSubmissionsScreen';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#a5b4fc',
        headerTitleStyle: { fontWeight: 'bold', color: '#f1f5f9' },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuizScreen}
        options={{ title: 'Create Quiz' }}
      />
      <Stack.Screen
        name="AddQuestion"
        component={AddQuestionScreen}
        options={{ title: 'Add Questions' }}
      />
      <Stack.Screen
        name="QuizSubmissions"
        component={QuizSubmissionsScreen}
        options={{ title: 'Submissions' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
