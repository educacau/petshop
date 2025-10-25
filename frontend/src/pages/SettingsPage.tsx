import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Settings as SettingsIcon, Save} from 'lucide-react';

import {useBusinessSetting} from '../features/settings/hooks/useBusinessSetting';
import {PageHeader} from '../ui/molecules/PageHeader';
import {Surface} from '../ui/atoms/Surface';
import {FormField} from '../ui/molecules/FormField';
import {Input} from '../ui/atoms/FormControls';
import {Button} from '../ui/atoms/Button';
import {Text} from '../ui/atoms/Text';

const schema = z
  .object({
    openingTime: z.coerce.number().min(0).max(23),
    closingTime: z.coerce.number().min(0).max(23),
    slotDuration: z.coerce.number().min(15).max(180)
  })
  .refine(data => data.closingTime > data.openingTime, {
    message: 'Horário de fechamento deve ser maior que o de abertura'
  });

type SettingsForm = z.infer<typeof schema>;

/**
 * Configurações de horário com validação clara e feedback imediato.
 */
export const SettingsPage = () => {
  const {query, mutation} = useBusinessSetting();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<SettingsForm>({resolver: zodResolver(schema)});

  const setting = query.data;

  useEffect(() => {
    if (!setting) return;
    reset({
      openingTime: setting.openingTime,
      closingTime: setting.closingTime,
      slotDuration: setting.slotDuration
    });
  }, [setting, reset]);

  const onSubmit = async (values: SettingsForm) => {
    await mutation.mutateAsync(values);
  };

  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Ajuste rapidamente os horários de atendimento e a duração dos serviços."
        icon={<SettingsIcon className="h-6 w-6" />}
      />

      <Surface padding="lg" className="max-w-2xl space-y-6">
        {query.isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Text tone="muted" size="sm">
              Defina um intervalo confortável para os profissionais e evite sobreposições de agenda.
            </Text>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Abertura (hora)" required error={errors.openingTime?.message}>
                <Input type="number" min={0} max={23} {...register('openingTime')} />
              </FormField>

              <FormField label="Fechamento (hora)" required error={errors.closingTime?.message}>
                <Input type="number" min={0} max={23} {...register('closingTime')} />
              </FormField>

              <FormField
                className="md:col-span-2"
                label="Duração de cada slot (minutos)"
                required
                error={errors.slotDuration?.message}
                helper="Use múltiplos de 15 para otimizar encaixes."
              >
                <Input type="number" min={15} max={180} step={15} {...register('slotDuration')} />
              </FormField>
            </div>

            {errors?.root && (
              <Text tone="default" className="text-danger">
                {errors.root.message}
              </Text>
            )}

            <div className="flex justify-end">
              <Button type="submit" icon={<Save className="h-4 w-4" />} disabled={isSubmitting || mutation.isPending}>
                {isSubmitting || mutation.isPending ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        )}
      </Surface>
    </>
  );
};
