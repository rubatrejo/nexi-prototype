"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import type { ScreenId } from "./navigation";
import { hotelConfig } from "./hotel-config";
import type { FlowData } from "./flow-types";

// Configuration
const INACTIVITY_WARNING_MS = hotelConfig.inactivity.warningAfterMs;
const INACTIVITY_RESET_MS = hotelConfig.inactivity.resetAfterMs;

interface KioskState {
  currentScreen: ScreenId;
  previousScreen: ScreenId;
  history: ScreenId[];
  theme: "light" | "dark";
  navOpen: boolean;
  // Guest session data
  guestName: string;
  roomNumber: string;
  reservationId: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  // Modal state
  activeModal: string | null;
  modalData: Record<string, unknown>;
  // Demo mode
  guestMode: boolean;
  // Flow data (persists across navigation)
  flowData: FlowData;
  inactivityVisible: boolean;
}

interface KioskContextType extends KioskState {
  navigate: (screen: ScreenId) => void;
  goBack: () => void;
  goHome: () => void;
  toggleTheme: () => void;
  setNavOpen: (open: boolean) => void;
  setGuestData: (data: Partial<KioskState>) => void;
  openModal: (id: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  toggleGuestMode: () => void;
  setFlowData: (data: Partial<FlowData>) => void;
  setInactivityVisible: (v: boolean) => void;
  // Inactivity actions
  dismissInactivityWarning: () => void;
  resetSession: () => void;
}

const KioskContext = createContext<KioskContextType | null>(null);

function getInitialScreen(): ScreenId {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("screen");
    if (s) return s as ScreenId;
  }
  return "IDL-01";
}

export function KioskProvider({
  children,
  guestNameOverride,
}: {
  children: ReactNode;
  guestNameOverride?: string;
}) {
  const [state, setState] = useState<KioskState>({
    currentScreen: getInitialScreen(),
    previousScreen: getInitialScreen(),
    history: [],
    theme: "light",
    navOpen: false,
    guestName: guestNameOverride || hotelConfig.guestDefaults.demoName,
    roomNumber: hotelConfig.guestDefaults.demoRoom,
    reservationId: hotelConfig.guestDefaults.demoReservationId,
    checkInDate: hotelConfig.guestDefaults.demoCheckIn,
    checkOutDate: hotelConfig.guestDefaults.demoCheckOut,
    roomType: hotelConfig.guestDefaults.demoRoomType,
    guestMode: false,
    flowData: {},
    inactivityVisible: false,
    activeModal: null,
    modalData: {},
  });

  // Inactivity timer refs
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const navigate = useCallback((screen: ScreenId) => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: screen,
      history: [...prev.history, prev.currentScreen],
      activeModal: null,
      modalData: {},
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const prevScreen = newHistory.pop()!;
      return {
        ...prev,
        previousScreen: prev.currentScreen,
        currentScreen: prevScreen,
        history: newHistory,
        activeModal: null,
        modalData: {},
      };
    });
  }, []);

  const goHome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previousScreen: prev.currentScreen,
      currentScreen: "DSH-01",
      history: [],
      activeModal: null,
      modalData: {},
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const setNavOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, navOpen: open }));
  }, []);

  const setGuestData = useCallback((data: Partial<KioskState>) => {
    setState((prev) => ({ ...prev, ...data }));
  }, []);

  const openModal = useCallback(
    (id: string, data?: Record<string, unknown>) => {
      setState((prev) => ({
        ...prev,
        activeModal: id,
        modalData: data || {},
      }));
    },
    []
  );

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, activeModal: null, modalData: {} }));
  }, []);

  const toggleGuestMode = useCallback(() => {
    setState((prev) => ({ ...prev, guestMode: !prev.guestMode }));
  }, []);

  const setFlowData = useCallback((data: Partial<FlowData>) => {
    setState((prev) => ({
      ...prev,
      flowData: { ...prev.flowData, ...data },
    }));
  }, []);

  const setInactivityVisible = useCallback((v: boolean) => {
    setState((prev) => ({ ...prev, inactivityVisible: v }));
  }, []);

  // Reset entire session to idle screen
  const resetSession = useCallback(() => {
    setState({
      currentScreen: "IDL-01",
      previousScreen: "IDL-01",
      history: [],
      theme: state.theme,
      navOpen: false,
      guestName: guestNameOverride || hotelConfig.guestDefaults.demoName,
      roomNumber: hotelConfig.guestDefaults.demoRoom,
      reservationId: hotelConfig.guestDefaults.demoReservationId,
      checkInDate: hotelConfig.guestDefaults.demoCheckIn,
      checkOutDate: hotelConfig.guestDefaults.demoCheckOut,
      roomType: hotelConfig.guestDefaults.demoRoomType,
      guestMode: false,
      flowData: {},
      inactivityVisible: false,
      activeModal: null,
      modalData: {},
    });
  }, [guestNameOverride, state.theme]);

  // Dismiss warning and reset timers
  const dismissInactivityWarning = useCallback(() => {
    setInactivityVisible(false);
    lastActivityRef.current = Date.now();

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  // Inactivity detection
  useEffect(() => {
    if (state.currentScreen === "IDL-01" && state.history.length === 0) {
      return;
    }

    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        setInactivityVisible(false);
      }

      inactivityTimerRef.current = setTimeout(() => {
        setInactivityVisible(true);

        resetTimerRef.current = setTimeout(() => {
          resetSession();
        }, INACTIVITY_RESET_MS);
      }, INACTIVITY_WARNING_MS);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    const handleActivity = () => {
      if (state.inactivityVisible) {
        dismissInactivityWarning();
      }
      resetInactivityTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [
    state.currentScreen,
    state.history.length,
    state.inactivityVisible,
    resetSession,
    dismissInactivityWarning,
    setInactivityVisible,
  ]);

  return (
    <KioskContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        goHome,
        toggleTheme,
        setNavOpen,
        setGuestData,
        openModal,
        closeModal,
        toggleGuestMode,
        setFlowData,
        setInactivityVisible,
        dismissInactivityWarning,
        resetSession,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used within KioskProvider");
return ctx;
}
