import {createContext} from 'react';

const CompletedLevelsContext = createContext({
  completedAttackerLevels: [],
  completedDefenderLevels: [],
});

export default CompletedLevelsContext;
