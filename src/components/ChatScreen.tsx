import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatScreenProps = {
  visible: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

const assistantReply = (question: string) => {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes('balance')) {
    return 'Your total available balance is ₹2,45,680.50.';
  }

  if (normalizedQuestion.includes('spend') || normalizedQuestion.includes('expense')) {
    return 'I can help you review your spending. Try asking about a specific account or category.';
  }

  return 'I can help with balances, expenses, transfers, bills, and account activity. What would you like to know?';
};

const BACKEND_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/v1/chat/message'
    : 'http://localhost:8000/api/v1/chat/message';

function ChatScreen({visible, onClose}: ChatScreenProps) {
  const [draft, setDraft] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi Pranita! I\'m your financial assistant. How can I help today?',
      fromUser: false,
    },
  ]);

  const sendMessage = async () => {
    const text = draft.trim();

    if (!text || isLoading) {
      return;
    }

    const userMessageId = `${Date.now()}-user`;
    setMessages(currentMessages => [
      ...currentMessages,
      {id: userMessageId, text, fromUser: true},
    ]);
    setDraft('');
    setIsLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session_id) {
          setSessionId(data.session_id);
        }
        setMessages(current => [
          ...current,
          {
            id: `${Date.now()}-assistant`,
            text: data.reply || assistantReply(text),
            fromUser: false,
          },
        ]);
      } else {
        // Fallback to local logic if backend returns error
        setMessages(current => [
          ...current,
          {id: `${Date.now()}-assistant`, text: assistantReply(text), fromUser: false},
        ]);
      }
    } catch {
      // Offline fallback
      setMessages(current => [
        ...current,
        {id: `${Date.now()}-assistant`, text: assistantReply(text), fromUser: false},
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} visible={visible}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={styles.keyboardView}>
          <View style={styles.header}>
            <View style={styles.profileBlock}>
              <View style={styles.profileAvatar}>
                <View style={styles.chatIcon}>
                  <View style={styles.chatIconDots}>
                    <View style={styles.chatIconDot} />
                    <View style={styles.chatIconDot} />
                    <View style={styles.chatIconDot} />
                  </View>
                </View>
              </View>
              <View>
              <Text style={styles.headerTitle}>Financial AI Assistant</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.headerSubtitle}>Online and ready to help</Text>
                </View>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Close chat"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.closeButton}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.messages}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.fromUser ? styles.userBubble : styles.assistantBubble,
                ]}>
                <Text
                  style={[
                    styles.messageText,
                    message.fromUser && styles.userMessageText,
                  ]}>
                  {message.text}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text style={styles.messageText}>Analyzing banking data...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              onChangeText={setDraft}
              onSubmitEditing={sendMessage}
              placeholder="Ask about your finances..."
              placeholderTextColor="#8a96a5"
              returnKeyType="send"
              style={styles.input}
              value={draft}
            />
            <Pressable
              accessibilityLabel="Send message"
              accessibilityRole="button"
              onPress={sendMessage}
              style={({pressed}) => [styles.sendButton, pressed && styles.sendPressed]}>
              <Text style={styles.sendIcon}>↑</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#08244b',
    flex: 1,
  },
  keyboardView: {
    backgroundColor: '#f5f8fc',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#08244b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  profileBlock: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileAvatar: {
    alignItems: 'center',
    backgroundColor: '#126acb',
    borderColor: '#76b9ff',
    borderRadius: 23,
    borderWidth: 2,
    height: 46,
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#2489ff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.45,
    shadowRadius: 6,
    width: 46,
  },
  chatIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 22,
    justifyContent: 'center',
    position: 'relative',
    width: 28,
  },
  chatIconDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  chatIconDot: {
    backgroundColor: '#126acb',
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  onlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  onlineDot: {
    backgroundColor: '#53e09b',
    borderRadius: 4,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  headerSubtitle: {
    color: '#a7c8eb',
    fontSize: 11,
  },
  closeButton: {
    alignItems: 'center',
    borderColor: '#6d99c9',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
  },
  messages: {
    gap: 12,
    padding: 20,
  },
  messageBubble: {
    borderRadius: 16,
    maxWidth: '84%',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#126acb',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: '#344252',
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#e3e9f0',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    backgroundColor: '#f0f4f8',
    borderRadius: 22,
    color: '#273648',
    flex: 1,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 17,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#126acb',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sendPressed: {
    opacity: 0.75,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 25,
  },
});

export default ChatScreen;
