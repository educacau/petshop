import {useEffect, useRef, useState} from 'react';
import type {KeyboardEvent, MouseEvent} from 'react';
import {LayoutGrid, PawPrint, PlusCircle, Table, Trash2} from 'lucide-react';
import {useForm} from 'react-hook-form';

import {usePets} from '../features/pets/hooks/usePets';
import {usePetsByCustomer} from '../features/pets/hooks/usePetsByCustomer';
import {useCreatePet} from '../features/pets/mutations/useCreatePet';
import {useUpdatePet} from '../features/pets/mutations/useUpdatePet';
import {useDeletePet} from '../features/pets/mutations/useDeletePet';
import {useUsers} from '../features/users/hooks/useUsers';
import {useAuth} from '../hooks/useAuth';
import type {CreatePetDTO, Pet, UpdatePetDTO} from '../types';
import {PageHeader} from '../ui/molecules/PageHeader';
import {Surface} from '../ui/atoms/Surface';
import {FormField} from '../ui/molecules/FormField';
import {Input, Select, Textarea} from '../ui/atoms/FormControls';
import {Button} from '../ui/atoms/Button';
import {IconButton} from '../ui/atoms/IconButton';
import {DataTable} from '../ui/molecules/DataTable';
import {TableHeadCell, TableCell, TableRow} from '../ui/molecules/TableCells';
import {Text} from '../ui/atoms/Text';
import {Badge} from '../ui/atoms/Badge';
import {EmptyState} from '../ui/molecules/EmptyState';

const toOptionalNumber = (value: string) => {
  const sanitized = value.replace(',', '.').trim();
  if (!sanitized) {
    return undefined;
  }

  const parsed = Number(sanitized);
  return Number.isNaN(parsed) ? undefined : parsed;
};

type PetForm = {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  medicalNotes: string;
  customerId: string;
};

const initialFormValues: PetForm = {
  name: '',
  species: '',
  breed: '',
  age: '',
  weight: '',
  medicalNotes: '',
  customerId: ''
};

const buildUpdatePayload = (pet: Pet, values: PetForm): UpdatePetDTO => ({
  id: pet.id,
  name: values.name.trim(),
  species: values.species.trim(),
  breed: values.breed.trim() || undefined,
  age: toOptionalNumber(values.age),
  weight: toOptionalNumber(values.weight),
  medicalNotes: values.medicalNotes.trim() || undefined,
  customerId: pet.customerId
});

const buildCreatePayload = (values: PetForm): CreatePetDTO => ({
  name: values.name.trim(),
  species: values.species.trim(),
  breed: values.breed.trim() || undefined,
  age: toOptionalNumber(values.age),
  weight: toOptionalNumber(values.weight),
  medicalNotes: values.medicalNotes.trim() || undefined,
  customerId: values.customerId
});

const formatMetric = (value?: number, suffix?: string) => {
  if (value === undefined || value === null) {
    return 'Nao informado';
  }

  return suffix ? `${value} ${suffix}` : String(value);
};

/**
 * Painel de pets com foco em cadastro, edicao e visualizacao flexivel.
 */
export const PetsPage = () => {
  const {user} = useAuth();
  const canManagePets = user?.role === 'ADMIN' || user?.role === 'STAFF';
  const canEditPets = canManagePets || user?.role === 'CUSTOMER';

  const petsMode = canManagePets ? 'all' : 'mine';
  const [visiblePets, setVisiblePets] = useState<Pet[]>([]);
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('');
  const {data, isLoading} = usePets({mode: petsMode});
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const customersQuery = useUsers({role: 'CUSTOMER', enabled: canManagePets});
  const selectedCustomer = customersQuery.data?.find(customer => customer.id === selectedCustomerFilter) ?? null;

  const [feedback, setFeedback] = useState<{type: 'success' | 'error'; message: string} | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: {errors, isSubmitting}
  } = useForm<PetForm>({
    defaultValues: initialFormValues,
    shouldUnregister: true
  });

  const selectedCustomerId = watch('customerId');
  const customerPets = usePetsByCustomer(selectedCustomerId, Boolean(selectedCustomerId) && canManagePets);

  useEffect(() => {
    if (!data) {
      setVisiblePets([]);
      return;
    }

    if (canManagePets && selectedCustomerFilter) {
      setVisiblePets(data.filter(pet => pet.customerId === selectedCustomerFilter));
    } else {
      setVisiblePets(data);
    }
  }, [data, canManagePets, selectedCustomerFilter]);

  const isSaving = isSubmitting || createPet.isPending || updatePet.isPending;
  const isDeleting = deletePet.isPending;
  const isFiltered = canManagePets && Boolean(selectedCustomerFilter);

  const onSubmit = async (values: PetForm) => {
    setFeedback(null);

    try {
      if (editingPet) {
        await updatePet.mutateAsync(buildUpdatePayload(editingPet, values));
        setFeedback({type: 'success', message: 'Pet atualizado com sucesso.'});
        setEditingPet(null);
        setShowForm(false);
        reset({...initialFormValues, customerId: selectedCustomerFilter || ''});
        return;
      }

      await createPet.mutateAsync(buildCreatePayload(values));
      setFeedback({type: 'success', message: 'Pet cadastrado com sucesso.'});
      reset({...initialFormValues, customerId: selectedCustomerFilter || ''});
      setShowForm(false);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: editingPet ? 'Nao foi possivel atualizar o pet. Tente novamente.' : 'Nao foi possivel cadastrar o pet. Tente novamente.'
      });
    }
  };

  const handleInsertClick = () => {
    setEditingPet(null);
    reset({...initialFormValues, customerId: selectedCustomerFilter || ''});
    setFeedback(null);

    const focusAndScroll = () => {
      setFocus('name');
      if (formRef.current) {
        formRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    };

    if (!showForm) {
      setShowForm(true);
      setTimeout(focusAndScroll, 0);
      return;
    }

    focusAndScroll();
  };

  const handleCancel = () => {
    reset({...initialFormValues, customerId: selectedCustomerFilter || ''});
    setEditingPet(null);
    setShowForm(false);
    setFeedback(null);
  };

  const handleEdit = (pet: Pet) => {
    const formValues: PetForm = {
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? '',
      age: pet.age !== undefined && pet.age !== null ? String(pet.age) : '',
      weight: pet.weight !== undefined && pet.weight !== null ? String(pet.weight) : '',
      medicalNotes: pet.medicalNotes ?? '',
      customerId: pet.customerId
    };

    setEditingPet(pet);
    reset(formValues);
    setFeedback(null);
    setShowForm(true);
    setTimeout(() => setFocus('name'), 0);
  };

  const handleAccessibleOpen = (event: KeyboardEvent<HTMLElement>, pet: Pet) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEdit(pet);
    }
  };

  const handleDeletePet = async (pet: Pet) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Deseja realmente remover ${pet.name}?`);
      if (!confirmed) {
        return;
      }
    }

    setFeedback(null);
    setDeletingId(pet.id);

    try {
      await deletePet.mutateAsync({id: pet.id, customerId: pet.customerId});

      if (editingPet?.id === pet.id) {
        reset({...initialFormValues, customerId: selectedCustomerFilter || ''});
        setEditingPet(null);
        setShowForm(false);
      }

      setFeedback({type: 'success', message: 'Pet removido com sucesso.'});
    } catch (error) {
      setFeedback({type: 'error', message: 'Nao foi possivel remover o pet. Tente novamente.'});
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLElement>, pet: Pet) => {
    event.stopPropagation();
    handleDeletePet(pet);
  };

  const headerActions = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-border-muted bg-surface p-1 shadow-inner">
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'table' ? 'primary' : 'ghost'}
          icon={<Table className="h-4 w-4" />}
          onClick={() => setViewMode('table')}
          aria-pressed={viewMode === 'table'}
          disabled={showForm || isDeleting}
        >
          Tabela
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'cards' ? 'primary' : 'ghost'}
          icon={<LayoutGrid className="h-4 w-4" />}
          onClick={() => setViewMode('cards')}
          aria-pressed={viewMode === 'cards'}
          disabled={showForm || isDeleting}
        >
          Cards
        </Button>
      </div>
      {canManagePets && (
        <Select
          value={selectedCustomerFilter}
          onChange={event => setSelectedCustomerFilter(event.target.value)}
          aria-label="Filtrar pets por cliente"
          className="md:w-56"
          disabled={customersQuery.isLoading || customersQuery.isFetching}
        >
          <option value="">{customersQuery.isLoading ? 'Carregando clientes...' : 'Todos os clientes'}</option>
          {customersQuery.data?.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      )}
      {canManagePets && (
        <Button
          type="button"
          size="sm"
          variant="primary"
          icon={<PlusCircle className="h-4 w-4" />}
          onClick={handleInsertClick}
          disabled={isSaving || isDeleting}
        >
          Inserir pet
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Pets"
        subtitle="Todos os pets cadastrados pelos clientes ficam reunidos em um so lugar."
        icon={<PawPrint className="h-6 w-6" />}
        actions={headerActions}
      />

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 rounded-xl border px-4 py-3 text-sm transition-colors ${
            feedback.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {canManagePets && isFiltered && (
        <Text tone="muted" size="sm" className="mb-4">
          {selectedCustomer
            ? `Exibindo ${visiblePets.length} pet(s) de ${selectedCustomer.name}.`
            : 'Selecione um cliente para filtrar os pets.'}
        </Text>
      )}

      {showForm && (
        <Surface padding="lg" className="space-y-6">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text tone="muted" size="sm" className="uppercase tracking-wide">
                Cadastro rapido
              </Text>
              <Text tone="default">Mantenha o prontuario completo para personalizar o atendimento.</Text>
            </div>
            {selectedCustomerId && customerPets.data && (
              <Text tone="soft" size="sm">
                Cliente possui {customerPets.data.length} pet(s) registrado(s)
              </Text>
            )}
          </header>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
            <FormField label="Nome" required error={errors.name?.message}>
              <Input {...register('name', {required: 'Informe o nome'})} placeholder="Nome do pet" />
            </FormField>

            <FormField label="Especie" required error={errors.species?.message}>
              <Input {...register('species', {required: 'Informe a especie'})} placeholder="Cao, gato..." />
            </FormField>

            <FormField label="Raca">
              <Input {...register('breed')} placeholder="Lhasa Apso, SRD..." />
            </FormField>

            <FormField label="Idade (anos)">
              <Input type="number" min={0} {...register('age')} placeholder="Ex: 4" />
            </FormField>

            <FormField label="Peso (kg)">
              <Input type="number" min={0} step={0.1} {...register('weight')} placeholder="Ex: 7.5" />
            </FormField>

            <FormField
              label="Cliente responsavel"
              required
              error={errors.customerId?.message}
              helper={editingPet ? 'Cliente nao pode ser alterado apos o cadastro.' : undefined}
            >
              <Select {...register('customerId', {required: 'Selecione o responsavel'})} disabled={Boolean(editingPet)}>
                <option value="">Selecione um cliente</option>
                {customersQuery.data?.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              className="md:col-span-2"
              label="Observacoes"
              helper="Informe alergias, restricoes ou preferencias."
            >
              <Textarea rows={4} {...register('medicalNotes')} placeholder="Notas clinicas ou cuidados especiais." />
            </FormField>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" icon={<PlusCircle className="h-4 w-4" />} disabled={isSaving}>
                {isSaving
                  ? editingPet
                    ? 'Atualizando...'
                    : 'Salvando...'
                  : editingPet
                  ? 'Atualizar pet'
                  : 'Cadastrar pet'}
              </Button>
            </div>
          </form>
        </Surface>
      )}

      {!showForm &&
        (isLoading ? (
          <Surface padding="lg" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
            ))}
          </Surface>
        ) : visiblePets.length > 0 ? (
          viewMode === 'table' ? (
            <Surface padding="none">
              <DataTable
                header={
                  <thead>
                    <tr>
                      <TableHeadCell>Nome</TableHeadCell>
                      <TableHeadCell>Especie</TableHeadCell>
                      <TableHeadCell>Raca</TableHeadCell>
                      <TableHeadCell className="text-right">Idade</TableHeadCell>
                      <TableHeadCell className="text-right">Peso</TableHeadCell>
                      {canEditPets && <TableHeadCell className="w-16 text-right">Acoes</TableHeadCell>}
                    </tr>
                  </thead>
                }
                body={
                  <tbody className="divide-y divide-border-muted">
                    {visiblePets.map(item => (
                      <TableRow
                        key={item.id}
                        role={canEditPets ? 'button' : undefined}
                        tabIndex={canEditPets ? 0 : undefined}
                        aria-label={canEditPets ? `Editar ${item.name}` : undefined}
                        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          canEditPets ? 'cursor-pointer' : ''
                        }`}
                        onClick={canEditPets ? () => handleEdit(item) : undefined}
                        onKeyDown={canEditPets ? event => handleAccessibleOpen(event, item) : undefined}
                      >
                        <TableCell className="font-medium text-content-strong">{item.name}</TableCell>
                        <TableCell className="text-content-muted">{item.species}</TableCell>
                        <TableCell>{item.breed ?? 'Nao informado'}</TableCell>
                        <TableCell className="text-right">{formatMetric(item.age, 'anos')}</TableCell>
                        <TableCell className="text-right">{formatMetric(item.weight, 'kg')}</TableCell>
                        {canEditPets && (
                          <TableCell className="text-right">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              label={`Remover ${item.name}`}
                              icon={<Trash2 className="h-4 w-4" />}
                              className="text-danger hover:bg-danger/10 focus-visible:ring-danger"
                              disabled={(isDeleting && deletingId === item.id) || isSaving}
                              onClick={event => handleDeleteClick(event, item)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </tbody>
                }
              />
            </Surface>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePets.map(pet => {
                  return (
                    <Surface
                      key={pet.id}
                      padding="lg"
                      className={`flex h-full flex-col gap-4 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        canEditPets ? 'cursor-pointer' : ''
                      }`}
                      role={canEditPets ? 'button' : undefined}
                      tabIndex={canEditPets ? 0 : undefined}
                      aria-label={canEditPets ? `Editar ${pet.name}` : undefined}
                      onClick={canEditPets ? () => handleEdit(pet) : undefined}
                      onKeyDown={canEditPets ? event => handleAccessibleOpen(event, pet) : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Text as="h3" weight="medium" className="text-lg text-content-strong">
                            {pet.name}
                          </Text>
                          <Text tone="muted" size="sm">
                            {pet.species}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          {pet.breed && <Badge tone="info">{pet.breed}</Badge>}
                          {canEditPets && (
                            <IconButton
                              size="sm"
                              variant="ghost"
                              label={`Remover ${pet.name}`}
                              icon={<Trash2 className="h-4 w-4" />}
                              className="text-danger hover:bg-danger/10 focus-visible:ring-danger"
                              disabled={(isDeleting && deletingId === pet.id) || isSaving}
                              onClick={event => handleDeleteClick(event, pet)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <Text as="span" tone="muted" size="sm" className="block text-xs uppercase tracking-wide">
                            Idade
                          </Text>
                          <Text as="span">{formatMetric(pet.age, 'anos')}</Text>
                        </div>
                        <div>
                          <Text as="span" tone="muted" size="sm" className="block text-xs uppercase tracking-wide">
                            Peso
                          </Text>
                          <Text as="span">{formatMetric(pet.weight, 'kg')}</Text>
                        </div>
                        <div>
                          <Text as="span" tone="muted" size="sm" className="block text-xs uppercase tracking-wide">
                            Observacoes clinicas
                          </Text>
                          <Text as="span">{pet.medicalNotes?.trim() || 'Nao informado'}</Text>
                        </div>
                      </div>
                    </Surface>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <EmptyState
            title={isFiltered ? 'Nenhum pet para o cliente selecionado' : 'Nenhum pet cadastrado'}
            description={
              isFiltered
                ? 'Selecione outro cliente ou cadastre um novo pet para este responsavel.'
                : 'Cadastre um novo pet ou incentive seus clientes a completarem o perfil.'
            }
            icon={<PawPrint className="h-9 w-9" />}
          />
        ))}
    </>
  );
};
