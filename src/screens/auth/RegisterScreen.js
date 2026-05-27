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

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, role);
      // navigation handled automatically by AppNavigator
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
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
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-white mb-2">
              Create account
            </Text>
            <Text className="text-slate-400 text-base">
              Join the quiz platform
            </Text>
          </View>

          {/* Role selector */}
          <View className="mb-6">
            <Text className="text-slate-300 text-sm mb-2 font-medium">
              I am a
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  role === 'USER'
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-slate-800 border-slate-700'
                }`}
                onPress={() => setRole('USER')}
              >
                <Text
                  className={`font-semibold ${
                    role === 'USER' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  role === 'ADMIN'
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-slate-800 border-slate-700'
                }`}
                onPress={() => setRole('ADMIN')}
              >
                <Text
                  className={`font-semibold ${
                    role === 'ADMIN' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Full Name
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="John Doe"
                placeholderTextColor="#64748b"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Email
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="you@example.com"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm mb-2 font-medium">
                Password
              </Text>
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-4 border border-slate-700 text-base"
                placeholder="Min. 6 characters"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl py-4 mt-2 items-center"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-indigo-400 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
