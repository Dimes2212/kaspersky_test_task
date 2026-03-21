'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';

import { createUser, deleteUser, getUsers, type CreateUserPayload } from '../../shared/api/users';
import type { User } from '../../shared/types/user';
import { AddUserModal } from './ui/AddUserModal';
import { UsersTable } from './ui/UsersTable';
import type { SortOption } from './ui/UsersToolbar';
import { UsersToolbar } from './ui/UsersToolbar';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [requestError, setRequestError] = useState('');
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setRequestError('');
        setLoading(false);
      } catch {
        setRequestError('Не удалось загрузить пользователей. Проверь, запущен ли сервер API.');
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      const searchableValues = [
        user.name,
        user.account,
        user.email,
        user.group ?? 'без группы',
        user.phone,
        String(user.age),
      ];

      return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [users, deferredQuery]);

  const preparedUsers = useMemo(() => {
    const sortedUsers = [...filteredUsers];

    sortedUsers.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'group-asc':
          return (a.group ?? '').localeCompare(b.group ?? '');
        case 'group-desc':
          return (b.group ?? '').localeCompare(a.group ?? '');
        case 'age-asc':
          return a.age - b.age;
        case 'age-desc':
          return b.age - a.age;
        default:
          return 0;
      }
    });

    return sortedUsers;
  }, [filteredUsers, sortOption]);

  const handleCreateUser = useCallback(async (payload: CreateUserPayload) => {
    try {
      const createdUser = await createUser(payload);
      setUsers((currentUsers) => [...currentUsers, createdUser]);
      setRequestError('');
      setModalOpen(false);
    } catch (error) {
      setRequestError('Не удалось добавить пользователя. Попробуй еще раз.');
      throw error;
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId: number) => {
    setDeletingUserId(userId);

    try {
      await deleteUser(userId);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
      setRequestError('');
    } catch {
      setRequestError('Не удалось удалить пользователя. Попробуй еще раз.');
    } finally {
      setDeletingUserId(null);
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1568px] space-y-5">
      <UsersToolbar
        query={query}
        sortOption={sortOption}
        onQueryChange={setQuery}
        onSortChange={setSortOption}
        onAddClick={() => setModalOpen(true)}
      />
      {requestError ? (
        <div className="rounded-sm bg-white px-[16px] py-[12px] text-[14px] text-red-600">{requestError}</div>
      ) : null}
      <UsersTable users={preparedUsers} deletingUserId={deletingUserId} onDeleteUser={handleDeleteUser} />
      {loading ? <p className="text-sm text-[#939393]">Загрузка пользователей...</p> : null}
      {modalOpen ? <AddUserModal onCancel={() => setModalOpen(false)} onSubmit={handleCreateUser} /> : null}
    </section>
  );
}
