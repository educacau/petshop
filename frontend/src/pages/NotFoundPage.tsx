import {Link} from 'react-router-dom';
import {Compass} from 'lucide-react';
import {motion} from 'framer-motion';

import {Surface} from '../ui/atoms/Surface';
import {buttonClasses} from '../ui/atoms/Button';
import {Text} from '../ui/atoms/Text';

/**
 * Página 404 acolhedora com retorno rápido ao dashboard.
 */
export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-muted via-surface to-primary-soft/20 px-4">
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
      className="w-full max-w-xl"
    >
      <Surface padding="lg" className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Compass className="h-8 w-8" />
        </div>
        <Text as="h1" size="lg" weight="medium" className="text-content-strong">
          Opa, rota não encontrada
        </Text>
        <Text tone="muted">
          A página que você procura pode ter sido movida ou não existe mais. Volte para o dashboard e continue a explorar.
        </Text>
        <Link to="/dashboard" className={buttonClasses('primary', 'md', 'justify-center')}>
          Voltar ao início
        </Link>
      </Surface>
    </motion.div>
  </div>
);
