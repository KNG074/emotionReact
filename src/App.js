import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import axios from 'axios';

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [emotionData, setEmotionData] = useState([]);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} April ${currentDate.getFullYear()} at ${String(
        currentDate.getHours()
    ).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}`;

    useEffect(() => {
        const fetchEmotionData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/emotions');
                if (response.data && typeof response.data === 'object') {
                    const formattedData = Object.entries(response.data).map(([name, value]) => ({
                        name,
                        value,
                        color: getColorForEmotion(name),
                    }));
                    setEmotionData(formattedData);
                } else {
                    console.error('Invalid data format from backend:', response.data);
                }
            } catch (error) {
                console.error('Error fetching emotion data:', error);
            }
        };

        fetchEmotionData();

        const interval = setInterval(fetchEmotionData, 5000);

        return () => clearInterval(interval);
    }, []);

    const getColorForEmotion = (emotionName) => {
        switch (emotionName) {
            case "Neutral": return "#78909C";
            case "Happy": return "#FFEB3B";
            case "Sad": return "#1E88E5";
            case "Fear": return "#4CAF50";
            case "Disgust": return "#FF9800";
            case "Angry": return "#E53935";
            case "Surprise": return "#9C27B0";
            default: return "#CCCCCC";
        }
    };

    const totalPeople = emotionData.reduce(
        (sum, emotion) => sum + emotion.value,
        0
    );

    const chartData = emotionData.filter((item) => item.value > 0);

    return (
        <div style={{ ...styles.fullscreen, backgroundColor: isDarkMode ? "#121212" : "#F5F5F5" }}>
            <div style={{ ...styles.header, backgroundColor: isDarkMode ? "#1E88E5" : "#2196F3" }}>
                <h2 style={{ ...styles.headerText, color: isDarkMode ? "#FFFFFF" : "#FFFFFF" }}>
                    Emotion Dashboard
                </h2>
                <button style={styles.darkModeButton} onClick={() => setIsDarkMode(!isDarkMode)}>
                    <span style={{ color: "white" }}>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
            </div>

            <div style={styles.content}>
                <p style={{ ...styles.date, color: isDarkMode ? "#BDBDBD" : "#757575" }}>
                    {formattedDate}
                </p>

                <div style={styles.topSection}>
                    <div style={{ ...styles.totalBox, backgroundColor: isDarkMode ? "#673AB7" : "#673AB7" }}>
                        <div style={styles.totalLabel}>
                            <span style={{ ...styles.totalLabelText, color: "#FFFFFF" }}>
                                Total People
                            </span>
                        </div>
                        <span style={{ ...styles.totalCount, color: "#FFFFFF" }}>
                            {totalPeople}
                        </span>
                    </div>
                </div>

                <div style={{ ...styles.chartSection, backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" }}>
                    <h3 style={{ ...styles.sectionTitle, color: isDarkMode ? "#BB86FC" : "#3F51B5" }}>
                        Emotion Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={3}
                                labelLine={false}
                                label={false}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ marginTop: 20 }}
                                formatter={(value, entry) => (
                                    <span style={{ ...styles.legendText, color: isDarkMode ? "#BDBDBD" : "#757575" }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ ...styles.emotionsSection, backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" }}>
                    <h3 style={{ ...styles.sectionTitle, color: isDarkMode ? "#BB86FC" : "#3F51B5" }}>
                        Emotion Breakdown
                    </h3>
                    <div style={styles.emotionGrid}>
                        {emotionData.map((emotion) => (
                            <div key={emotion.name} style={{ ...styles.emotionBlock, backgroundColor: emotion.color }}>
                                <span style={{ ...styles.emotionName, color: "#FFFFFF" }}>
                                    {emotion.name}
                                </span>
                                <span style={{ ...styles.emotionCount, color: "#FFFFFF" }}>
                                    {emotion.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    fullscreen: {
        flex: 1,
    },
    header: {
        padding: "20px",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerText: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    content: {
        padding: "20px",
    },
    date: {
        fontSize: "14px",
        marginBottom: "20px",
        textAlign: "center",
    },
    topSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: "20px",
    },
    totalBox: {
        padding: "15px",
        borderRadius: "8px",
        alignItems: "center",
    },
    totalLabel: {
        marginBottom: "5px",
    },
    totalLabelText: {
        fontSize: "16px",
    },
    totalCount: {
        fontSize: "36px",
        fontWeight: "bold",
    },
    chartSection: {
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        elevation: "3",
    },
    emotionsSection: {
        padding: "20px",
        borderRadius: "8px",
        elevation: "3",
    },
    emotionGrid: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: "15px",
    },
    emotionBlock: {
        borderRadius: "8px",
        padding: "15px",
        width: "45%",
        alignItems: "center",
        justifyContent: "center",
        elevation: "2",
    },
    emotionName: {
        fontSize: "16px",
        marginBottom: "10px",
        fontWeight: "600",
    },
    emotionCount: {
        fontSize: "30px",
        fontWeight: "bold",
    },
    legendText: {},
    darkModeButton: {
        backgroundColor: "#333",
        padding: "8px",
        borderRadius: "5px",
    },
};

export default App;