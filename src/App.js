import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/sign-up/SignUp';
import Protected from './components/protected/Protected';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Kaikais from './components/kaikais/Kaikais'
import { AuthProvider } from './components/auth/Auth';
import NotFound from './components/notfound/NotFound';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/login" element ={<Login/>}/>
          <Route path="/sign-up" element ={<SignUp/>}/>
          <Route path="/" element={<Protected/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="/kaikais" element={<Kaikais/>}/>
          </Route>
          <Route path="*" element = {<NotFound/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
