import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

const initialState = {
  timers: [] as Timer[],
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      console.log('ADD TIMER ', action);
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      console.log('DELETE TIMER ', action);

      state.timers = state.timers.filter(timer => timer.id !== action.payload);
    },
    toggleTimer: (state, action) => {
      console.log('TOGGLE TIMER ', action);
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    updateTimer: (state) => {
      // console.log('UPDATE STATE---', Array.from(state.timers), action);
      // const timer = state.timers.find(timer => timer.id === action.payload);
      // // console.log('FIND TIMER RES---', timer);
      // if (timer && timer.isRunning) {
      //   timer.remainingTime -= 1;
      //   timer.isRunning = timer.remainingTime > 0;
      // }
      state.timers.forEach((timer) => {
        if (timer.isRunning && timer.remainingTime > 0) {
          timer.remainingTime -= 1;
    
          if (timer.remainingTime <= 0) {
            timer.isRunning = false; // Automatically stop the timer when it ends
            console.log(`Timer "${timer.title}" has ended.`);
          }
        }
      });
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: () => dispatch(updateTimer()),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};