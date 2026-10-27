import React, { useState, useEffect } from 'react';
import { User, Movie, Showtime, Ticket } from './types';
import { authService, getStoredUser } from './services/authService';
import { bookingService } from './services/bookingService';

import { MobileContainer } from './components/common/MobileContainer';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { ApiSettingsModal } from './components/common/ApiSettingsModal';
import { SpringBootCodeModal } from './components/common/SpringBootCodeModal';

import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';

import { MovieListScreen } from './components/movies/MovieListScreen';
import { MovieDetailsScreen } from './components/movies/MovieDetailsScreen';
import { ShowtimeSelection } from './components/showtimes/ShowtimeSelection';
import { SeatSelectionScreen } from './components/booking/SeatSelectionScreen';
import { MyTicketsScreen } from './components/tickets/MyTicketsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [authView, setAuthView] = useState<'login' | 'register' | null>(null);

  // Flow states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeBookingFlow, setActiveBookingFlow] = useState<{
    showtime: Showtime;
    movie: Movie;
  } | null>(null);

  // Modals
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isSpringBootDocsOpen, setIsSpringBootDocsOpen] = useState(false);

  // Tickets counter
  const [activeTicketsCount, setActiveTicketsCount] = useState<number>(0);

  const refreshUserTicketsCount = async () => {
    if (!currentUser) {
      setActiveTicketsCount(0);
      return;
    }
    try {
      const tickets = await bookingService.getUserTickets(currentUser.id);
      const active = tickets.filter((t) => t.status === 'ACTIVE');
      setActiveTicketsCount(active.length);
    } catch {
      setActiveTicketsCount(0);
    }
  };

  useEffect(() => {
    refreshUserTicketsCount();
  }, [currentUser]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSelectShowtime = (showtime: Showtime, movieOverride?: Movie) => {
    const movie = movieOverride || selectedMovie;
    if (movie) {
      setActiveBookingFlow({ showtime, movie });
    }
  };

  const handleBookingCreated = (ticketId: number) => {
    setActiveBookingFlow(null);
    setSelectedMovie(null);
    setActiveTab('tickets');
    refreshUserTicketsCount();
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView('login');
  };

  const renderMainContent = () => {
    // 1. Auth Flow Overlay
    if (authView === 'login') {
      return (
        <LoginScreen
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthView(null);
          }}
          onGoToRegister={() => setAuthView('register')}
          onSkip={() => setAuthView(null)}
        />
      );
    }

    if (authView === 'register') {
      return (
        <RegisterScreen
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthView(null);
          }}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }

    // 2. Active Seat Booking Flow
    if (activeBookingFlow) {
      return (
        <SeatSelectionScreen
          showtime={activeBookingFlow.showtime}
          movie={activeBookingFlow.movie}
          currentUser={currentUser}
          onBack={() => setActiveBookingFlow(null)}
          onBookingCreated={handleBookingCreated}
          onRequireLogin={() => setAuthView('login')}
        />
      );
    }

    // 3. Movie Details Screen
    if (selectedMovie) {
      return (
        <MovieDetailsScreen
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
          onSelectShowtime={(showtime) => handleSelectShowtime(showtime, selectedMovie)}
        />
      );
    }

    // 4. Tab Views
    switch (activeTab) {
      case 'movies':
        return <MovieListScreen onSelectMovie={handleSelectMovie} />;
      case 'showtimes':
        return (
          <ShowtimeSelection
            onSelectShowtime={(st, m) => {
              setSelectedMovie(m);
              setActiveBookingFlow({ showtime: st, movie: m });
            }}
          />
        );
      case 'tickets':
        return (
          <MyTicketsScreen
            currentUser={currentUser}
            onRequireLogin={() => setAuthView('login')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onRequireLogin={() => setAuthView('login')}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            onOpenSpringBootDocs={() => setIsSpringBootDocsOpen(true)}
          />
        );
      default:
        return <MovieListScreen onSelectMovie={handleSelectMovie} />;
    }
  };

  const showHeader = !authView;
  const showBottomNav = !authView && !activeBookingFlow && !selectedMovie;

  return (
    <MobileContainer
      onOpenApiSettings={() => setIsApiSettingsOpen(true)}
      onOpenSpringBootDocs={() => setIsSpringBootDocsOpen(true)}
    >
      {/* Top Mobile App Bar */}
      {showHeader && (
        <Header
          title={
            selectedMovie
              ? selectedMovie.title
              : activeBookingFlow
              ? 'Koltuk Seçimi'
              : undefined
          }
          showBack={!!selectedMovie || !!activeBookingFlow}
          onBack={() => {
            if (activeBookingFlow) setActiveBookingFlow(null);
            else if (selectedMovie) setSelectedMovie(null);
          }}
          currentUser={currentUser}
          onOpenApiSettings={() => setIsApiSettingsOpen(true)}
          activeTicketsCount={activeTicketsCount}
        />
      )}

      {/* Screen Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative">{renderMainContent()}</div>

      {/* Bottom Nav */}
      {showBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setSelectedMovie(null);
            setActiveBookingFlow(null);
            setActiveTab(tab);
          }}
          activeTicketsCount={activeTicketsCount}
        />
      )}

      {/* Modals */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onConfigUpdated={() => refreshUserTicketsCount()}
      />

      <SpringBootCodeModal
        isOpen={isSpringBootDocsOpen}
        onClose={() => setIsSpringBootDocsOpen(false)}
      />
    </MobileContainer>
  );
}
