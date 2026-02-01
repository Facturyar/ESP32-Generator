
export interface ProjectConfig {
  board: string;
  customBoardConfig: string;
  goal: string;
  modules: string[];
  communication: string[];
  language: 'Arduino C++' | 'MicroPython';
  power: string;
  customDescription: string;
}
