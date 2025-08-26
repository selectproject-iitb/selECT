import { createContext, useContext, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

const initialState = {
  numVideosToEvaluate: 3,
  currentVideoIndex: 0,
  videos: [],
  globalContextSelections: {
    subject: "",
    grade: "",
    language: "",
    technology: "",
    infrastructure: "",
  },
  globalContextCompleted: false,
  overallScores: {
    average: 0,
  },
};

function makeNewVideos(count, globalContext) {
  return Array.from({ length: count }, (_, i) => ({
    id: `video-${i + 1}`,
    name: `Video ${i + 1}`,
    userSelections: { ...globalContext },
    assessmentData: {
      content: { answers: {}, score: 0 },
    },
    score: 0,
    completedSteps: { assessment: false },
  }));
}

function computeOverall(videos) {
  const done = videos.filter((v) => v.score > 0);
  if (done.length === 0) return { average: 0 };
  const avg = Math.round(done.reduce((s, v) => s + v.score, 0) / done.length);
  return { average: avg };
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      const hydratedState = { ...state, ...action.payload };
      if (hydratedState.videos.length !== hydratedState.numVideosToEvaluate) {
        const existing = hydratedState.videos;
        const next = makeNewVideos(
          hydratedState.numVideosToEvaluate,
          hydratedState.globalContextSelections
        ).map((nv, i) => (existing[i] ? { ...nv, ...existing[i] } : nv));
        hydratedState.videos = next.slice(0, hydratedState.numVideosToEvaluate);
      }
      return hydratedState;
    case "SET_NUM_VIDEOS": {
      const count = Math.max(3, action.count || 3);
      const existing = state.videos;
      const next = makeNewVideos(count, state.globalContextSelections).map(
        (nv, i) => (existing[i] ? { ...nv, ...existing[i] } : nv)
      );
      return {
        ...state,
        numVideosToEvaluate: count,
        videos: next.slice(0, count),
      };
    }
    case "SET_VIDEO_NAME":
      return {
        ...state,
        videos: state.videos.map((v, i) =>
          i === action.index ? { ...v, name: action.name } : v
        ),
      };
    case "SET_CURRENT_VIDEO_INDEX":
      return { ...state, currentVideoIndex: action.index };
    case "SET_GLOBAL_SELECTION": {
      const newGlobalContextSelections = {
        ...state.globalContextSelections,
        [action.category]: action.value,
      };
      return {
        ...state,
        globalContextSelections: newGlobalContextSelections,
        videos: state.videos.map((v) => ({
          ...v,
          userSelections: {
            ...v.userSelections,
            [action.category]: action.value,
          },
        })),
      };
    }
    case "SET_CONTENT_DATA": {
      const i = state.currentVideoIndex;
      return {
        ...state,
        videos: state.videos.map((v, idx) =>
          idx === i
            ? {
                ...v,
                assessmentData: { ...v.assessmentData, content: action.data },
              }
            : v
        ),
      };
    }
    case "UPDATE_VIDEO_SCORES": {
      const i = state.currentVideoIndex;
      const videos = state.videos.map((v, idx) =>
        idx === i
          ? {
              ...v,
              score: action.score,
              completedSteps: { ...v.completedSteps, assessment: true },
            }
          : v
      );
      return { ...state, videos };
    }
    case "MARK_GLOBAL_CONTEXT_COMPLETE": {
      return { ...state, globalContextCompleted: true };
    }
    case "UPDATE_OVERALL":
      return { ...state, overallScores: computeOverall(state.videos) };
    case "RESET":
      return {
        ...initialState,
        videos: makeNewVideos(
          initialState.numVideosToEvaluate,
          initialState.globalContextSelections
        ),
      };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    videos: makeNewVideos(
      initialState.numVideosToEvaluate,
      initialState.globalContextSelections
    ),
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    try {
      const raw = localStorage.getItem("select-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch (e) {
      console.error("Failed to hydrate state from localStorage", e);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return; // Don't persist if not authenticated

    try {
      localStorage.setItem("select-state", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist state to localStorage", e);
    }
  }, [state, user]);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "RESET" });
    }
  }, [user]);

  const setNumVideos = (count) => dispatch({ type: "SET_NUM_VIDEOS", count });
  const setVideoName = (index, name) =>
    dispatch({ type: "SET_VIDEO_NAME", index, name });
  const setCurrentVideoIndex = (index) =>
    dispatch({ type: "SET_CURRENT_VIDEO_INDEX", index });
  const setGlobalSelection = (category, value) =>
    dispatch({ type: "SET_GLOBAL_SELECTION", category, value });
  const markGlobalContextComplete = () =>
    dispatch({ type: "MARK_GLOBAL_CONTEXT_COMPLETE" });
  const setContentData = (data) => dispatch({ type: "SET_CONTENT_DATA", data });
  const updateVideoScores = (score) =>
    dispatch({ type: "UPDATE_VIDEO_SCORES", score });
  const updateOverall = () => dispatch({ type: "UPDATE_OVERALL" });
  const reset = () => {
    localStorage.removeItem("select-state");
    dispatch({ type: "RESET" });
    toast.success("Assessment reset");
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setNumVideos,
        setVideoName,
        setCurrentVideoIndex,
        setGlobalSelection,
        markGlobalContextComplete,
        setContentData,
        updateVideoScores,
        updateOverall,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
};
