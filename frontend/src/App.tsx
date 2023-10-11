import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/navigation/navigation.component';
import MainPage from './components/main-page/main-page';
import ErrorPage from './components/error-page/error-page';
import AuthComponent from './components/auth/auth';

function App(): JSX.Element {

  const isAuthenticated = () => {
    return false;
  }

  return (
    <Routes>
      <Route path='/' element={<Navigation />} > 
        <Route index={true} element={<MainPage />} />
        <Route path='auth/' element={ <AuthComponent /> } />
        <Route element={<ErrorPage />} path='*' />
      </Route>
    </Routes>
  );
}

export default App;
