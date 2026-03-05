import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacityProps,
} from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    title,
    loading = false,
    disabled,
    ...props
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.title}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2563eb', // Example blue
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#93c5fd',
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
