import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* Background decoration */}
      <View className="absolute top-0 right-0 w-64 h-64 bg-indigo-900 rounded-full opacity-20"
        style={{ transform: [{ translateX: 80 }, { translateY: -80 }] }}
      />
      <View className="absolute top-20 right-10 w-32 h-32 bg-indigo-600 rounded-full opacity-10" />

      {/* Main content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* App icon */}
        <View className="w-24 h-24 rounded-3xl bg-indigo-950 border border-indigo-700 items-center justify-center mb-8">
          <Text style={{ fontSize: 48 }}>🧠</Text>
        </View>

        <Text className="text-5xl font-bold text-white mb-3 tracking-tight">
          QuizMaster
        </Text>

        <Text className="text-slate-400 text-lg text-center leading-7 mb-10">
          Test your knowledge.{'\n'}Challenge your limits.
        </Text>

        {/* Feature pills */}
        <View className="flex-row flex-wrap justify-center gap-2 mb-12">
          {['⏱ Timed Quizzes', '📊 Track Progress', '🏆 Instant Score'].map((item) => (
            <View key={item} className="bg-slate-800 border border-slate-700 rounded-full px-4 py-2">
              <Text className="text-slate-400 text-sm font-medium">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom buttons */}
      <View className="px-6 pb-10 gap-3">
        <TouchableOpacity
          className="bg-indigo-600 rounded-2xl py-4 items-center"
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
          style={{
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-white font-bold text-base">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-2xl py-4 items-center border border-slate-700"
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text className="text-slate-400 font-medium text-base">
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;