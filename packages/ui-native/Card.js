import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Card = ({
    children,
    title,
    padding = "medium",
    shadow = true,
    style,
}) => {
    return (
        <View style={[styles.card, shadow && styles.shadow, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={[styles.content, styles[`${padding}Padding`]]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        color: "#333",
    },
    content: {
        paddingBottom: 16,
    },
    smallPadding: {
        paddingHorizontal: 8,
    },
    mediumPadding: {
        paddingHorizontal: 16,
    },
    largePadding: {
        paddingHorizontal: 24,
    },
});