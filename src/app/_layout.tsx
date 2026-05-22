import { Tabs } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { useEffect } from 'react';

import { useStore } from '../stores/useStore';

export default function Layout() {
  const loadData = useStore(
    (s) => s.loadData
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:
          '#534AB7',
      }}
    >
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Pay',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="card"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="time"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="pie-chart"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}