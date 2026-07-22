import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import WelcomeScreen from '../screens/landing/WelcomeScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import LoadingScreen from '../screens/loading/LoadingScreen';
import ResultScreen from '../screens/result/ResultScreen';
import MbtiQuizScreen from '../screens/quiz/MbtiQuizScreen';
import MbtiResultScreen from '../screens/result/MbtiResultScreen';
import ShareScreen from '../screens/share/ShareScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import HomeScreen from '../screens/home/HomeScreen';
import TestsScreen from '../screens/tests/TestsScreen';
import WrappedScreen from '../screens/wrapped/WrappedScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import RecommendationDetailScreen from '../screens/recommendation/RecommendationDetailScreen';
import RecommendationsLoadingScreen from '../screens/loading/RecommendationsLoadingScreen';
import AstralCompatibilityTest from '../screens/tests/AstralCompatibilityTest';
import AestheticTasteTest from '../screens/tests/AestheticTasteTest';
import EnneagramTest from '../screens/tests/EnneagramTest';
import TemperamentsTest from '../screens/tests/TemperamentsTest';
import MobileContainer from '../components/layout/MobileContainer';
import { BottomNav } from '../components/layout/BottomNav';
import { useVibe } from '../context/VibeContext';

// Layout wrapper for authenticated screens that require the bottom navigation bar
function MainLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex-grow overflow-hidden h-full">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated, user } = useVibe();
  const isProfileCompleted = user?.profileCompleted;
  const authRedirect = isProfileCompleted ? "/profile" : "/quiz";

  return (
    <BrowserRouter>
      <MobileContainer>
        <Routes>
          {/* Public / Onboarding Flow */}
          <Route path="/" element={isAuthenticated ? <Navigate to={authRedirect} replace /> : <Navigate to="/landing" replace />} />
          <Route path="/landing" element={isAuthenticated ? <Navigate to={authRedirect} replace /> : <WelcomeScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          
          {/* Optional MBTI Routes (Guarded: must be logged in & VIBE onboarding complete) */}
          <Route 
            path="/mbti-quiz" 
            element={isAuthenticated ? (isProfileCompleted ? <MbtiQuizScreen /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />
          <Route 
            path="/mbti-result" 
            element={isAuthenticated ? (isProfileCompleted ? <MbtiResultScreen /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />
          <Route 
            path="/astral-quiz" 
            element={isAuthenticated ? (isProfileCompleted ? <AstralCompatibilityTest /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />
          <Route 
            path="/aesthetic-quiz" 
            element={isAuthenticated ? (isProfileCompleted ? <AestheticTasteTest /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />
          <Route 
            path="/enneagram-quiz" 
            element={isAuthenticated ? (isProfileCompleted ? <EnneagramTest /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />
          <Route 
            path="/temperament-quiz" 
            element={isAuthenticated ? (isProfileCompleted ? <TemperamentsTest /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} 
          />

          <Route path="/share" element={<ShareScreen />} />
          <Route 
            path="/loading-recommendations" 
            element={isAuthenticated ? <RecommendationsLoadingScreen /> : <Navigate to="/landing" replace />} 
          />
          
          {/* Authentication Routes */}
          <Route path="/register" element={isAuthenticated ? <Navigate to={authRedirect} replace /> : <AuthScreen />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={authRedirect} replace /> : <AuthScreen />} />

          {/* Authenticated Flow (Flat Paths with bottom nav) */}
          <Route element={isAuthenticated ? (isProfileCompleted ? <MainLayout /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />}>
            <Route 
              path="/home" 
              element={
                !user?.recommendationPool && !sessionStorage.getItem('vibe_loading_shown') ? (
                  <Navigate to="/loading-recommendations" replace />
                ) : (
                  <HomeScreen />
                )
              } 
            />
            <Route path="/tests" element={<TestsScreen />} />
            <Route path="/wrapped" element={<WrappedScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/profile/edit" element={<EditProfileScreen />} />
          </Route>

          <Route path="/recommendation/:id" element={isAuthenticated ? (isProfileCompleted ? <RecommendationDetailScreen /> : <Navigate to="/quiz" replace />) : <Navigate to="/landing" replace />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={isAuthenticated ? <Navigate to={authRedirect} replace /> : <Navigate to="/landing" replace />} />
        </Routes>
      </MobileContainer>
    </BrowserRouter>
  );
}
