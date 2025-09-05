import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../app/_layout';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/Profile/Navbar';
import { BASE_URL } from '../../config/config';
import { useUser } from '@clerk/clerk-expo';
const EventDetails = () => {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = `${BASE_URL}/api/event/${id}`;
    const { user } = useUser();
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch event');
                const data = await response.json();
                setEventDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);
    const markAsRegistered = async (eventId, collegeEmail) => {
        console.log("Sending this to backend:", { eventId, collegeEmail });
    
        try {
            const res = await fetch(`${BASE_URL}/api/myRegisterations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId,
                    collegeEmail,
                }),
            });
    
            if (res.ok) {
                console.log("✅ Registered successfully");
            } else {
                const errorText = await res.text(); // optional
                // console.error("❌ Server error:", res.status, errorText);
            }
        } catch (err) {
            // console.error("❌ Registration failed", err);
        }
    };
    
    
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={theme.secondary} />
                <Text style={styles.loadingText}>Fetching event details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container,{backgroundColor:theme.background}]}>
            <Navbar />

            <View style={[styles.imageContainer]}>
                <Image
                    source={{ uri: `${BASE_URL}/api/event/${id}/image?t=${new Date().getTime()}` }}
                    style={styles.coverImage}
                />
            </View>

            <View style={[styles.contentContainer,{backgroundColor:theme.container}]}>
                <Text style={[styles.eventName, { color: theme.text }]}>{eventDetails.eventName}</Text>
                <Text style={[styles.subText, { color: theme.text }]}>Hosted by {eventDetails.universityName}</Text>

                <View style={styles.descriptionContainer}>
                    <Text style={[styles.descriptionTitle,{color:theme.text}]}>About the Event</Text>
                    <Text style={[styles.descriptionText, { color: theme.text }]}>
                        {eventDetails.description}
                    </Text>
                </View>

                <View style={[styles.infoContainer,{backgroundColor:theme.container}]}>
                    <InfoRow icon="school-outline" label="University" value={eventDetails.universityName} />
                    <InfoRow icon="calendar-outline" label="Date" value={eventDetails.eventDate} />
                    <InfoRow icon="person-outline" label="Coordinator" value={eventDetails.creatorName} />
                    <InfoRow icon="call-outline" label="Contact" value={eventDetails.contactNumber} />
                </View>

                <TouchableOpacity style={[styles.registerBtn,{backgroundColor:theme.primary}]}
                    onPress={() => {
                       const email_Id=user.emailAddresses[0].emailAddress;
                       const event_id=id;
                       if(email_Id && event_id){
                        markAsRegistered(event_id,email_Id);
                       }

                        if (eventDetails?.registerLink) {
                            Linking.openURL(eventDetails.registerLink);
                        } else {
                            alert('Registration link not available');
                        }
                    }}
                >
                    <Text style={styles.registerText}>Register Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


const InfoRow = ({ icon, label, value }) => {
    const handlePress = () => {
        if (label === "Contact") {
            Linking.openURL(`tel:${value}`);
        }
    };

    return (
        <View style={styles.rowContainer}>
            <Ionicons name={icon} size={20} color="#333" />
            <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{label}</Text>
                {label === "Contact" ? (
                    <TouchableOpacity onPress={handlePress}>
                        <Text style={[styles.rowValue, { color: '#007AFF' }]}>{value}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.rowValue}>{value}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 300,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#f9f9f9',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    eventName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'outfit',
    },
    subText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 15,
        fontFamily: 'outfit',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
        fontFamily: 'outfit',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'outfit',
    },
    infoContainer: {
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
    },
    rowContent: {
        marginLeft: 10,
        flex: 1,
    },
    rowLabel: {
        color: '#333',
        fontWeight: 'bold',
        fontFamily: 'outfit',
    },
    rowValue: {
        color: '#555',
        fontSize: 14,
        fontFamily: 'outfit',
    },
    registerBtn: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff6a00',
        marginTop: 10,
        marginBottom: 20,
    },
    registerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'outfit',
    },
});

export default EventDetails;
