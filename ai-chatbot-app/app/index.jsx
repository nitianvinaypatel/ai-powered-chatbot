import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import RenderHtml from "react-native-render-html";
import { InlineMath, BlockMath } from "react-native-katex";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 300); // Delay ensures UI updates first
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://10.0.2.2:8000/query", {
        question: input,
      });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="black" />
      <View style={styles.header}>
        <ImageBackground
          source={require("../assets/images/mzpolice.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Mizoram Police Ai-Chatbot</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={[
              styles.messageContainer,
              item.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            {item.text.includes("\\(") || item.text.includes("\\[") ? (
              <BlockMath math={item.text} />
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
          </MotiView>
        )}
        contentContainerStyle={styles.flatListContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading || !input.trim()}
            style={styles.sendButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
    padding: 15,
    height: 70,
    borderBlockEndColor: "white",
    gap: 6,
    marginTop: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  flatListContent: {
    paddingBottom: 90,
    paddingTop: 10,
  },
  messageContainer: {
    margin: 8,
    padding: 8,
    borderRadius: 20,
    maxWidth: "80%",
    elevation: 2,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "green",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
    color: "white",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 50,
    marginLeft: 8,
  },
});

export default ChatScreen;
