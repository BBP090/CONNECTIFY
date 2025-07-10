import { useColorScheme } from 'react-native';
import { DarkColors, LightColors } from '../constants/theme';

const useThemeColors=()=> {
  const scheme = useColorScheme(); // 'light' or 'dark'
  return scheme === 'dark' ? DarkColors : LightColors;
};
export default useThemeColors;
