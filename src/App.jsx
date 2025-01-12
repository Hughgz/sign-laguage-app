import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CanvasCursor from './component/cursor/CanvasCursor';
import Auth from './component/Authenticate';
import LetterDisplay from './component/SignLanguage';
import Header from './component/Header';
import HomePage from './component/Home';
function App() {
  return (
    <>

      <CanvasCursor />
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/translate" element={<LetterDisplay />} />
          <Route path="/" element={<HomePage></HomePage>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
