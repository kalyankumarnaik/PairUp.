import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#6B6684',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E7EF',
          height: 60,
          paddingBottom: 8
        },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>✨</Text>
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📍</Text>
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💖</Text>
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💬</Text>
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Voice Rooms',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🎧</Text>
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🛡️</Text>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>
        }}
      />
    </Tabs>
  );
}
