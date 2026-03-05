import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '../features/auth/components/AuthButton';
import { authService } from '../services/authService';
import { clearCredentials } from '../store/authSlice';

export type AppStackParamList = {
    Dashboard: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const DashboardPlaceholder = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.log('Logout API failed, continuing local logout');
        } finally {
            dispatch(clearCredentials());
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header with brand logo */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/brand/logo-rectangle-300-mobile.png')}
                    style={styles.headerLogo}
                    resizeMode="contain"
                />
            </View>

            {/* Body */}
            <View style={styles.body}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>You are successfully logged in!</Text>
                <View style={styles.buttonContainer}>
                    <AuthButton title="Log Out" onPress={handleLogout} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardPlaceholder} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    headerLogo: {
        width: 160,
        height: 44,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
    },
});
