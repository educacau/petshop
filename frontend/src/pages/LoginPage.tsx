import {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {motion} from 'framer-motion';

import {useAuth} from '../hooks/useAuth';
import {Surface} from '../ui/atoms/Surface';
import {FormField} from '../ui/molecules/FormField';
import {Input} from '../ui/atoms/FormControls';
import {Button} from '../ui/atoms/Button';
import {Text} from '../ui/atoms/Text';
import logoPetBrucky from '../assets/pet-brucky-logo.svg';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginForm = z.infer<typeof schema>;

type DemoUser = {
  label: string;
  email: string;
  password: string;
};

const demoUsers: DemoUser[] = [
  {label: 'Administrador', email: 'admin@petshop.com', password: 'Admin@123'},
  {label: 'Colaborador', email: 'maria.staff@petshop.com', password: 'Staff@123'},
  {label: 'Cliente', email: 'joao.cliente@petshop.com', password: 'Cliente@123'}
];

/**
 * Tela de login inspirada em Material 3 com acesso rápido via usuários demo.
 */
export const LoginPage = () => {
  const {login} = useAuth();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue
  } = useForm<LoginForm>({resolver: zodResolver(schema)});

  const demoButtons = useMemo(
    () =>
      demoUsers.map(user => (
        <Button
          key={user.email}
          type="button"
          size="sm"
          variant="soft"
          onClick={() => {
            setValue('email', user.email, {shouldValidate: true});
            setValue('password', user.password, {shouldValidate: true});
          }}
        >
          {user.label}
        </Button>
      )),
    [setValue]
  );

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-surface to-primary-soft">
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
        className="relative z-10 w-full max-w-lg px-4 sm:px-0"
      >
        <Surface padding="lg" className="space-y-6 shadow-soft">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-surface">
              <img src={logoPetBrucky} alt="Pet Brucky" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <Text as="h1" size="lg" weight="medium" className="text-content-strong">
              PetCare Suite
            </Text>
            <Text tone="muted" size="sm">
              Centralize agendas, clientes e relatórios em uma experiência moderna.
            </Text>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-surface-muted/60 p-4 text-xs text-primary">
            <Text tone="muted" size="sm" className="font-medium uppercase">
              Acessos de demonstração
            </Text>
            {demoButtons}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="E-mail" required error={errors.email?.message}>
              <Input type="email" autoComplete="email" {...register('email')} placeholder="seu@email.com" />
            </FormField>

            <FormField label="Senha" required error={errors.password?.message}>
              <Input type="password" autoComplete="current-password" {...register('password')} placeholder="••••••" />
            </FormField>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Text size="sm" tone="soft" className="text-center">
            Dica: utilize os perfis de demonstração para testar fluxos diferentes.
          </Text>
        </Surface>
      </motion.div>

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 0.4}}
        transition={{duration: 0.8}}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25),transparent_60%)]"
      />
    </div>
  );
};
