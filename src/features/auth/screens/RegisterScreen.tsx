import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';
import { authService } from '../../../services/authService';
import { setCredentials } from '../../../store/authSlice';
import { AuthStackParamList } from '../../../navigation/AuthStack';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();

    const [firmName, setFirmName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<{
        firmName?: string;
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        let isValid = true;
        const newErrors: typeof errors = {};

        if (!firmName.trim()) {
            newErrors.firmName = 'Firm Name is required';
            isValid = false;
        }

        if (!fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email adddress';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
            isValid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                firmName,
                fullName,
                email,
                password,
            };
            const response = await authService.register(payload);
            dispatch(setCredentials(response));
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../../assets/brand/logo-rectangle-300-mobile.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    {error && <Text style={styles.apiErrorText}>{error}</Text>}

                    <AuthInput
                        label="Firm Name"
                        value={firmName}
                        onChangeText={(text) => {
                            setFirmName(text);
                            if (errors.firmName) setErrors({ ...errors, firmName: undefined });
                        }}
                        error={errors.firmName}
                    />

                    <AuthInput
                        label="Full Name"
                        value={fullName}
                        onChangeText={(text) => {
                            setFullName(text);
                            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                        }}
                        error={errors.fullName}
                    />

                    <AuthInput
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <AuthInput
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        error={errors.password}
                        secureTextEntry
                    />

                    <AuthInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        error={errors.confirmPassword}
                        secureTextEntry
                    />

                    <AuthButton
                        title="Register"
                        onPress={handleRegister}
                        loading={isLoading}
                    />

                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? <Text style={styles.linkTextBold}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: 220,
        height: 70,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 24,
    },
    apiErrorText: {
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    linkContainer: {
        marginTop: 24,
        alignItems: 'center',
        marginBottom: 40,
    },
    linkText: {
        color: '#4b5563',
        fontSize: 14,
    },
    linkTextBold: {
        color: '#2563eb',
        fontWeight: '600',
    },
});
