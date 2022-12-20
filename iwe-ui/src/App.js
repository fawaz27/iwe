import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#DB1C23',
      },
    }}
  >
  </ConfigProvider>
  );
}

export default App;
