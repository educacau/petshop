import {useRef, useState} from 'react';
import type {KeyboardEvent, MouseEvent} from 'react';
import {Users as UsersIcon, ShieldCheck, LayoutGrid, Table, Plus, Trash2} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import {isAxiosError} from 'axios';

import {useUsers} from '../features/users/hooks/useUsers';
import {useCreateUser} from '../features/users/mutations/useCreateUser';
import {useUpdateUser} from '../features/users/mutations/useUpdateUser';
import {useDeleteUser} from '../features/users/mutations/useDeleteUser';
import {useAuth} from '../hooks/useAuth';
import type {CreateUserDTO, Role, User} from '../types';
import {PageHeader} from '../ui/molecules/PageHeader';
import {Surface} from '../ui/atoms/Surface';
import {FormField} from '../ui/molecules/FormField';
import {Input, Select} from '../ui/atoms/FormControls';
import {Button} from '../ui/atoms/Button';
import {IconButton} from '../ui/atoms/IconButton';
import {DataTable} from '../ui/molecules/DataTable';
import {TableHeadCell, TableCell, TableRow} from '../ui/molecules/TableCells';
import {Badge} from '../ui/atoms/Badge';
import {EmptyState} from '../ui/molecules/EmptyState';
import {Text} from '../ui/atoms/Text';
import {formatPhone, normalizePhoneDigits} from '../utils/formatPhone';

const roleLabels: Record<Role, string> = {
  ADMIN: 'Administrador',
  STAFF: 'Colaborador',
  CUSTOMER: 'Cliente'
};

type CreateUserForm = Pick<CreateUserDTO, 'name' | 'email' | 'password' | 'role' | 'phone'>;

const normalizeMessage = (message?: string, field?: string) => {
  if (!message) {
    return undefined;
  }

  const normalized = message.toLowerCase();

  if (normalized.includes('email')) {
    return 'Informe um e-mail válido.';
  }

  if (normalized.includes('string must contain at least 8 character') || field === 'password') {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }

  if (normalized.includes('invalid enum value') || field === 'role') {
    return 'Escolha um perfil válido para o usuário.';
  }

  if (normalized.includes('string') && field === 'name') {
    return 'Informe um nome com pelo menos 3 caracteres.';
  }

  return message;
};

/**
 * Painel de usuários com foco em clareza e criação rápida.
 */
export const UsersPage = () => {
  const {user} = useAuth();
  const {data, isLoading} = useUsers();
  const canManageUsers = user?.role === 'ADMIN';
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [feedback, setFeedback] = useState<{type: 'success' | 'error'; message: string} | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialFormValues: CreateUserForm = {
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    phone: ''
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: {errors, isSubmitting}
  } = useForm<CreateUserForm>({
    defaultValues: initialFormValues,
    shouldUnregister: true
  });
  const isSaving = isSubmitting || createUser.isPending || updateUser.isPending;
  const isDeleting = deleteUser.isPending;

  const onSubmit = async (values: CreateUserForm) => {
    setFeedback(null);

    try {
      const normalizedPhone = values.phone ? normalizePhoneDigits(values.phone) : undefined;

      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          name: values.name.trim(),
          role: values.role,
          phone: normalizedPhone
        });
        setFeedback({
          type: 'success',
          message: 'Usuário atualizado com sucesso.'
        });
        setEditingUser(null);
        setShowForm(false);
        reset(initialFormValues);
        return;
      }

      await createUser.mutateAsync({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: normalizedPhone
      });
      reset(initialFormValues);
      setFeedback({
        type: 'success',
        message: 'Usuário criado com sucesso.'
      });
      setShowForm(false);
    } catch (error) {
      let message = editingUser
        ? 'Não foi possível atualizar o usuário. Tente novamente.'
        : 'Não foi possível salvar o usuário. Tente novamente.';

      if (
        isAxiosError<{
          message?: string;
          details?: {fieldErrors?: Record<string, string[]>; formErrors?: string[]};
        }>(error)
      ) {
        const responseData = error.response?.data;
        const fieldErrors = responseData?.details?.fieldErrors
          ? Object.entries(responseData.details.fieldErrors)
              .flatMap(([field, errors]) => errors?.map(err => normalizeMessage(err, field)) ?? [])
              .filter(Boolean)
          : [];
        const formErrors = responseData?.details?.formErrors?.map(err => normalizeMessage(err)) ?? [];
        const fallback = normalizeMessage(responseData?.message);

        message = fieldErrors[0] ?? formErrors[0] ?? fallback ?? message;
      }

      setFeedback({
        type: 'error',
        message
      });
    }
  };

  const handleInsertClick = () => {
    setEditingUser(null);
    reset(initialFormValues);
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
    reset(initialFormValues);
    setEditingUser(null);
    setShowForm(false);
    setFeedback(null);
  };

  const handleEdit = (userItem: User) => {
    const values: CreateUserForm = {
      name: userItem.name,
      email: userItem.email,
      password: '',
      role: userItem.role,
      phone: userItem.phone ? formatPhone(userItem.phone) : ''
    };

    setEditingUser(userItem);
    reset(values);
    setFeedback(null);
    setShowForm(true);
    setTimeout(() => setFocus('name'), 0);
  };

  const handleAccessibleOpen = (event: KeyboardEvent<HTMLElement>, userItem: User) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEdit(userItem);
    }
  };

  const handleDeleteUser = async (userItem: User) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Deseja realmente remover ${userItem.name}?`);
      if (!confirmed) {
        return;
      }
    }

    setFeedback(null);
    setDeletingId(userItem.id);

    try {
      await deleteUser.mutateAsync({id: userItem.id, role: userItem.role});

      if (editingUser?.id === userItem.id) {
        reset(initialFormValues);
        setEditingUser(null);
        setShowForm(false);
      }

      setFeedback({
        type: 'success',
        message: 'Usuario removido com sucesso.'
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Nao foi possivel remover o usuario. Tente novamente.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLElement>, userItem: User) => {
    event.stopPropagation();
    handleDeleteUser(userItem);
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
      {canManageUsers && (
        <Button
          type="button"
          size="sm"
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleInsertClick}
          disabled={isSaving || isDeleting}
        >
          Inserir usuário
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os perfis da equipe e dos clientes com visibilidade unificada."
        icon={<UsersIcon className="h-6 w-6" />}
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

      {canManageUsers && showForm && (
        <Surface padding="lg" className="space-y-6">
          <header className="space-y-1">
            <Text tone="muted" size="sm" className="uppercase tracking-wide">
              Novo usuário
            </Text>
            <Text tone="default">Envie convites e defina permissões em segundos.</Text>
            <Badge tone="info" className="inline-flex">
              Apenas administradores podem criar contas
            </Badge>
          </header>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
            <FormField label="Nome completo" required error={errors.name?.message} className="md:col-span-2">
              <Input {...register('name', {required: 'Informe o nome completo'})} placeholder="Nome e sobrenome" />
            </FormField>

            <FormField
              label="E-mail"
              required
              error={errors.email?.message}
              helper={editingUser ? 'E-mail não pode ser alterado após o cadastro.' : undefined}
            >
              <Input
                type="email"
                {...register('email', {required: 'Informe o e-mail corporativo'})}
                placeholder="nome@petshop.com"
                disabled={Boolean(editingUser)}
                readOnly={Boolean(editingUser)}
              />
            </FormField>

            <FormField label="Telefone">
              <Controller
                name="phone"
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={event => field.onChange(formatPhone(event.target.value))}
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                )}
              />
            </FormField>

            {!editingUser && (
              <FormField label="Senha provisoria" required error={errors.password?.message}>
                <Input
                  type="password"
                  {...register('password', {required: 'Defina uma senha provisoria'})}
                  placeholder="Minimo 8 caracteres"
                />
              </FormField>
            )}

            <FormField label="Perfil" helper="Escolha o nível de acesso para o novo usuário.">
              <Select {...register('role')}>
                <option value="CUSTOMER">Cliente</option>
                <option value="STAFF">Colaborador</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </FormField>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSaving || !showForm}>
                Cancelar
              </Button>
              <Button type="submit" icon={<ShieldCheck className="h-4 w-4" />} disabled={isSaving}>
                {isSaving
                  ? editingUser
                    ? 'Atualizando...'
                    : 'Salvando...'
                  : editingUser
                  ? 'Atualizar usuário'
                  : 'Salvar usuário'}
              </Button>
            </div>
          </form>
        </Surface>
      )}

      {!showForm &&
        (isLoading ? (
          <Surface padding="lg" className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            ))}
          </Surface>
        ) : data && data.length > 0 ? (
          viewMode === 'table' ? (
            <Surface padding="none">
              <DataTable
                header={
                  <thead>
                    <tr>
                      <TableHeadCell>Nome</TableHeadCell>
                      <TableHeadCell>E-mail</TableHeadCell>
                      <TableHeadCell>Perfil</TableHeadCell>
                      {canManageUsers && <TableHeadCell className="w-16 text-right">Acoes</TableHeadCell>}
                    </tr>
                  </thead>
                }
                body={
                  <tbody className="divide-y divide-border-muted">
                    {data.map(item => (
                      <TableRow
                        key={item.id}
                        role={canManageUsers ? 'button' : undefined}
                        tabIndex={canManageUsers ? 0 : undefined}
                        aria-label={canManageUsers ? `Editar ${item.name}` : undefined}
                        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          canManageUsers ? 'cursor-pointer' : ''
                        }`}
                        onClick={canManageUsers ? () => handleEdit(item) : undefined}
                        onKeyDown={canManageUsers ? event => handleAccessibleOpen(event, item) : undefined}
                      >
                        <TableCell className="font-medium text-content-strong">{item.name}</TableCell>
                        <TableCell className="text-content-muted">{item.email}</TableCell>
                        <TableCell>
                          <Badge tone={item.role === 'ADMIN' ? 'info' : item.role === 'STAFF' ? 'success' : 'default'}>
                            {roleLabels[item.role]}
                          </Badge>
                        </TableCell>
                        {canManageUsers && (
                          <TableCell className="text-right">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              label={`Remover ${item.name}`}
                              icon={<Trash2 className="h-4 w-4" />}
                              className="text-danger hover:bg-danger/10 focus-visible:ring-danger"
                              disabled={isDeleting && deletingId === item.id}
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
                {data.map(userItem => {
                  const formattedPhone = userItem.phone ? formatPhone(userItem.phone) : null;

                  return (
                    <Surface
                      key={userItem.id}
                      padding="lg"
                      className={`flex h-full flex-col gap-4 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        canManageUsers ? 'cursor-pointer' : ''
                      }`}
                      role={canManageUsers ? 'button' : undefined}
                      tabIndex={canManageUsers ? 0 : undefined}
                      aria-label={canManageUsers ? `Editar ${userItem.name}` : undefined}
                      onClick={canManageUsers ? () => handleEdit(userItem) : undefined}
                      onKeyDown={canManageUsers ? event => handleAccessibleOpen(event, userItem) : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Text as="h3" weight="medium" className="text-lg text-content-strong">
                            {userItem.name}
                          </Text>
                          <Text tone="muted" size="sm">
                            {userItem.email}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            tone={userItem.role === 'ADMIN' ? 'info' : userItem.role === 'STAFF' ? 'success' : 'default'}
                          >
                            {roleLabels[userItem.role]}
                          </Badge>
                          {canManageUsers && (
                            <IconButton
                              size="sm"
                              variant="ghost"
                              label={`Remover ${userItem.name}`}
                              icon={<Trash2 className="h-4 w-4" />}
                              className="text-danger hover:bg-danger/10 focus-visible:ring-danger"
                              disabled={isDeleting && deletingId === userItem.id}
                              onClick={event => handleDeleteClick(event, userItem)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <Text as="span" tone="muted" size="sm" className="block text-xs uppercase tracking-wide">
                            Telefone
                          </Text>
                          <Text as="span">{formattedPhone ?? 'Nao informado'}</Text>
                        </div>
                        <div>
                          <Text as="span" tone="muted" size="sm" className="block text-xs uppercase tracking-wide">
                            Tipo de acesso
                          </Text>
                          <Text as="span">{roleLabels[userItem.role]}</Text>
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
            title="Nenhum usuario cadastrado"
            description="Convide membros da equipe para colaborar e acompanhar os atendimentos."
            icon={<UsersIcon className="h-9 w-9" />}
          />
        ))}

    </>
  );
};
