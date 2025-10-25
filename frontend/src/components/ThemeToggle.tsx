import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {MoonStar, Sun} from 'lucide-react';
import {IconButton} from '../ui/atoms/IconButton';

const THEME_KEY = 'petshop:theme';
type Theme = 'light' | 'dark';

/**
 * Persisted light/dark toggle with animated icon swap.
 */
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_KEY) as Theme) ?? 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const Icon = theme === 'light' ? MoonStar : Sun;

  return (
    <IconButton
      variant="soft"
      size="sm"
      label="Alternar tema"
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            transition={{duration: 0.2}}
            className="flex items-center justify-center"
          >
            <Icon className="h-4 w-4" />
          </motion.span>
        </AnimatePresence>
      }
      onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
    />
  );
};
