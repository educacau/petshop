import {useEffect, useMemo, useState, type ComponentProps} from 'react';
import {useForm} from 'react-hook-form';
import dayjs from 'dayjs';
import {AnimatePresence, motion} from 'framer-motion';
import {CalendarClock, CalendarDays, ChevronLeft, ChevronRight, Clock, List, PlusCircle, Search} from 'lucide-react';

import {useAuth} from '../hooks/useAuth';
import {useSchedules} from '../features/schedules/hooks/useSchedules';
import {useScheduleActions} from '../features/schedules/mutations/useScheduleActions';
import {useCreateSchedule} from '../features/schedules/mutations/useCreateSchedule';
import {useUsers} from '../features/users/hooks/useUsers';
import {usePetsByCustomer} from '../features/pets/hooks/usePetsByCustomer';
import type {CreateScheduleDTO, ServiceType} from '../types';
import {ScheduleCalendar} from '../features/schedules/components/ScheduleCalendar';
import {MiniCalendar} from '../features/schedules/components/MiniCalendar';
import {PageHeader} from '../ui/molecules/PageHeader';
import {Surface} from '../ui/atoms/Surface';
import {FormField} from '../ui/molecules/FormField';
import {Input, Select, Textarea} from '../ui/atoms/FormControls';
import {Button} from '../ui/atoms/Button';
import {Badge} from '../ui/atoms/Badge';
import {Text} from '../ui/atoms/Text';
import {DataTable} from '../ui/molecules/DataTable';
import {TableHeadCell, TableCell, TableRow} from '../ui/molecules/TableCells';
import {EmptyState} from '../ui/molecules/EmptyState';

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'ConcluÃ­do',
  CANCELLED: 'Cancelado'
};

const statusTone: Record<string, ComponentProps<typeof Badge>['tone']> = {
  SCHEDULED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger'
};

type ScheduleForm = {
  serviceType: ServiceType;
  scheduledAt: string;
  notes?: string;
  price?: string;
  customerId: string;
  petId: string;
  staffId?: string;
};

const serviceOptions = [
  {value: 'BATH', label: 'Banho'},
  {value: 'GROOMING', label: 'Tosa'},
  {value: 'BATH_GROOMING', label: 'Banho + Tosa'}
] satisfies Array<{value: ServiceType; label: string}>;

/**
 * Agenda com foco em produtividade, formulÃ¡rios responsivos e animaÃ§Ãµes sutis.
 */
export const SchedulesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const {data, isLoading} = useSchedules();
  const {user} = useAuth();
  const {cancel, reschedule, updateStatus} = useScheduleActions();
  const createSchedule = useCreateSchedule();

  const isStaff = user?.role === 'STAFF';
  const isAdmin = user?.role === 'ADMIN';
  const canManageSchedules = isStaff || isAdmin;
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');

  const customersQuery = useUsers({role: 'CUSTOMER', enabled: canManageSchedules});
  const staffQuery = useUsers({role: 'STAFF', enabled: isAdmin});

  const sortedSchedules = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf()
      ),
    [data]
  );

  const hasSchedules = sortedSchedules.length > 0;
  const calendarViewMode: 'week' | 'day' = viewMode === 'list' ? 'week' : viewMode;
  const shouldShowForm = canManageSchedules && showForm;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors, isSubmitting}
  } = useForm<ScheduleForm>({
    defaultValues: {
      serviceType: 'BATH',
      scheduledAt: '',
      notes: '',
      price: '',
      customerId: '',
      petId: '',
      staffId: isStaff ? user?.id : ''
    }
  });

  const selectedCustomerId = watch('customerId');
  const customerPets = usePetsByCustomer(selectedCustomerId, canManageSchedules);

  useEffect(() => {
    if (isStaff && user?.id) {
      setValue('staffId', user.id);
    }
  }, [isStaff, setValue, user?.id]);

  const rangeLabel = useMemo(() => {
    if (viewMode === 'day') {
      return currentDate.format('DD/MM/YYYY');
    }

    const start = currentDate.startOf('week');
    const end = start.add(6, 'day');

    return `${start.format('DD/MM')} - ${end.format('DD/MM/YYYY')}`;
  }, [currentDate, viewMode]);

  const handlePrevRange = () => {
    const unit = viewMode === 'day' ? 'day' : 'week';
    setCurrentDate(prev => prev.subtract(1, unit));
  };

  const handleNextRange = () => {
    const unit = viewMode === 'day' ? 'day' : 'week';
    setCurrentDate(prev => prev.add(1, unit));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const headerActions = (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-border-muted bg-surface p-1 shadow-inner">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          icon={<ChevronLeft className="h-4 w-4" />}
          aria-label={viewMode === 'day' ? 'Dia anterior' : 'Semana anterior'}
          onClick={handlePrevRange}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          icon={<CalendarDays className="h-4 w-4" />}
          onClick={handleToday}
        >
          Hoje
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          icon={<ChevronRight className="h-4 w-4" />}
          aria-label={viewMode === 'day' ? 'PrÃ³ximo dia' : 'PrÃ³xima semana'}
          onClick={handleNextRange}
        />
      </div>

      <Text tone="muted" size="sm" className="text-center md:text-left">
        {rangeLabel}
      </Text>

      <div className="flex items-center gap-1 rounded-2xl border border-border-muted bg-surface p-1 shadow-inner">
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'day' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('day')}
        >
          Dia
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'week' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('week')}
        >
          Semana
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'list' ? 'primary' : 'ghost'}
          icon={<List className="h-4 w-4" />}
          onClick={() => setViewMode('list')}
        >
          Lista
        </Button>
      </div>

      {canManageSchedules && (
        <Button
          variant="primary"
          size="sm"
          icon={<PlusCircle className="h-4 w-4" />}
          className="xl:hidden"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Ocultar formulÃ¡rio' : 'Novo agendamento'}
        </Button>
      )}
    </div>
  );

  const onSubmit = async (values: ScheduleForm) => {
    const payload: CreateScheduleDTO = {
      serviceType: values.serviceType,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      notes: values.notes?.trim() || undefined,
      price: values.price ? Number(values.price) : undefined,
      customerId: values.customerId,
      petId: values.petId,
      staffId: isAdmin ? values.staffId || undefined : user?.id
    };

    await createSchedule.mutateAsync(payload);
    reset({
      serviceType: 'BATH',
      scheduledAt: '',
      notes: '',
      price: '',
      customerId: '',
      petId: '',
      staffId: isStaff ? user?.id : ''
    });
  };

  const handleCancel = (id: string) => {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      cancel.mutate(id);
    }
  };

  const handleReschedule = (id: string) => {
    const current = new Date().toISOString().slice(0, 16);
    const response = prompt('Nova data e hora (YYYY-MM-DDTHH:MM)', current);
    if (!response) return;
    reschedule.mutate({scheduleId: id, date: response});
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({scheduleId: id, status});
  };

  if (isLoading) {
    return (
      <Surface padding="lg" className="grid gap-4 md:grid-cols-2">
        <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
      </Surface>
    );
  }

  return (
    <>
      <PageHeader
        title="Agendamentos"
        subtitle="Visualize e gerencie a agenda do dia em uma timeline unificada."
        icon={<CalendarClock className="h-6 w-6" />}
        actions={headerActions}
      />

      <div className="mt-6 flex flex-col gap-6 xl:grid xl:grid-cols-[280px,1fr] xl:items-start">
        <aside className="xl:col-span-1">
          <div className="space-y-4 xl:sticky xl:top-24">
            <Surface
              padding="lg"
              className="space-y-6 border border-border/60 bg-surface shadow-none ring-0"
              elevation="none"
            >
              <Button
                type="button"
                size="lg"
                variant="primary"
                icon={<PlusCircle className="h-5 w-5" />}
                className="w-full justify-center rounded-2xl text-base font-semibold shadow-soft"
                onClick={() => setShowForm(true)}
              >
                Criar
              </Button>

              <div className="space-y-3">
                <Text tone="muted" size="sm" className="font-medium uppercase tracking-wide">
                  Calendario
                </Text>
                <MiniCalendar currentDate={currentDate} onSelectDate={setCurrentDate} />
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                icon={<Search className="h-4 w-4" />}
                className="w-full justify-start rounded-xl border-border-muted text-content-muted hover:border-border"
              >
                Pesquisar clientes
              </Button>
            </Surface>

            <Surface
              padding="lg"
              className="space-y-4 border border-border/60 bg-surface shadow-none ring-0"
              elevation="none"
            >
              <div>
                <Text tone="muted" size="sm" className="font-medium uppercase tracking-wide">
                  Minhas agendas
                </Text>
                <Text size="sm" tone="muted" className="text-xs">
                  Controle quais agendas aparecem na visualizacao principal.
                </Text>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-content">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary-soft bg-primary-soft/40">
                    <span className="h-2 w-2 rounded-sm bg-primary" />
                  </span>
                  Agenda principal
                </label>
                <label className="flex items-center gap-3 text-sm text-content">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-warning-soft bg-warning-soft/40">
                    <span className="h-2 w-2 rounded-sm bg-warning" />
                  </span>
                  Banho &amp; tosa
                </label>
                <label className="flex items-center gap-3 text-sm text-content">
                  <input type="checkbox" className="sr-only" />
                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-success-soft bg-success-soft/50">
                    <span className="h-2 w-2 rounded-sm bg-success" />
                  </span>
                  Consultas
                </label>
              </div>
            </Surface>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {shouldShowForm && (
            <Surface padding="lg" className="space-y-6">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Text tone="muted" size="sm" className="uppercase tracking-wide">
                    Criar novo slot
                  </Text>
                  <Text tone="default">Cadastre servicos com dados validados em tempo real.</Text>
                </div>
              </header>

              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                <FormField label="Cliente" required error={errors.customerId?.message}>
                  <Select
                    {...register('customerId', {required: 'Selecione um cliente'})}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {customersQuery.data?.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Pet" required error={errors.petId?.message}>
                  <Select
                    {...register('petId', {required: 'Selecione um pet'})}
                    disabled={!selectedCustomerId}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {selectedCustomerId ? 'Selecione' : 'Escolha um cliente primeiro'}
                    </option>
                    {customerPets.data?.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Servico" required>
                  <Select {...register('serviceType')}>
                    {serviceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Data e hora" required error={errors.scheduledAt?.message}>
                  <Input
                    type="datetime-local"
                    min={dayjs().startOf('day').format('YYYY-MM-DDTHH:mm')}
                    {...register('scheduledAt', {required: 'Informe data e hora'})}
                  />
                </FormField>

                {isAdmin && (
                  <FormField
                    label="Responsavel"
                    helper="Opcional - escolha quando quiser pre-atribuir."
                    error={errors.staffId?.message}
                  >
                    <Select {...register('staffId')}>
                      <option value="">Selecione</option>
                      {staffQuery.data?.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                )}

                <FormField label="Preco (R$)" error={errors.price?.message}>
                  <Input type="number" min={0} step={0.01} {...register('price')} />
                </FormField>

                <FormField className="md:col-span-2" label="Observacoes">
                  <Textarea
                    rows={4}
                    placeholder="Informacoes adicionais, alergias, preferencias..."
                    {...register('notes')}
                  />
                </FormField>

                <div className="md:col-span-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || createSchedule.isPending}
                    icon={<Clock className="h-4 w-4" />}
                  >
                    {isSubmitting || createSchedule.isPending ? 'Salvando...' : 'Criar agendamento'}
                  </Button>
                </div>
              </form>
            </Surface>
          )}

          {hasSchedules ? (
            viewMode === 'list' ? (
              <Surface padding="none">
                <DataTable
                  header={
                    <thead>
                      <tr>
                        <TableHeadCell>Data</TableHeadCell>
                        <TableHeadCell>Servico</TableHeadCell>
                        <TableHeadCell>Pet</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Acoes</TableHeadCell>
                      </tr>
                    </thead>
                  }
                  body={
                    <tbody className="divide-y divide-border-muted">
                      <AnimatePresence initial={false}>
                        {sortedSchedules.map(schedule => (
                          <motion.tr
                            key={schedule.id}
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.25}}
                            className="hover:bg-surface-muted/60"
                          >
                            <TableCell>
                              <Text size="sm" weight="medium">
                                {dayjs(schedule.scheduledAt).format('DD/MM/YYYY HH:mm')}
                              </Text>
                            </TableCell>
                            <TableCell className="font-medium uppercase tracking-wide text-content-strong">
                              {schedule.serviceType.replace('_', ' ')}
                            </TableCell>
                            <TableCell>{schedule.pet?.name ?? '-'}</TableCell>
                            <TableCell>
                              <Badge tone={statusTone[schedule.status] ?? 'default'}>
                                {statusLabels[schedule.status] ?? schedule.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-2 md:flex-row md:justify-end">
                                {user?.role === 'CUSTOMER' && schedule.status === 'SCHEDULED' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReschedule(schedule.id)}
                                    >
                                      Reagendar
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleCancel(schedule.id)}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                )}

                                {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
                                  <Select
                                    value={schedule.status}
                                    onChange={event => handleStatusChange(schedule.id, event.target.value)}
                                    className="w-40"
                                  >
                                    <option value="SCHEDULED">Agendado</option>
                                    <option value="IN_PROGRESS">Em andamento</option>
                                    <option value="COMPLETED">Concluido</option>
                                    <option value="CANCELLED">Cancelado</option>
                                  </Select>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  }
                />
              </Surface>
            ) : (
              <ScheduleCalendar
                schedules={sortedSchedules}
                currentDate={currentDate}
                viewMode={calendarViewMode}
              />
            )
          ) : (
            <EmptyState
              title="Sem agendamentos ainda"
              description="Comece adicionando um servico ou convide clientes para agendar online."
              icon={<CalendarClock className="h-9 w-9" />}
              action={
                canManageSchedules && (
                  <Button icon={<PlusCircle className="h-4 w-4" />} onClick={() => setShowForm(true)}>
                    Criar primeiro agendamento
                  </Button>
                )
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
