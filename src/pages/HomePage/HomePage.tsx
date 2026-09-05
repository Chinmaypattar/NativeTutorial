import { useState } from 'react';
import ChatScreen from '../../components/ChatScreen';
import FinancialDashboard from '../../components/FinancialDashboard';

function HomePage() {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <>
      <FinancialDashboard onOpenChat={() => setIsChatVisible(true)} />
      <ChatScreen
        onClose={() => setIsChatVisible(false)}
        visible={isChatVisible}
      />
    </>
  );
}

export default HomePage;
