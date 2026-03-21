'use client';

import { useEffect, useMemo, useState } from 'react';

import { getUsers } from '../../shared/api/users';
import type { User } from '../../shared/types/user';
import { GroupsList } from './ui/GroupsList';

export function GroupsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const { groups, usersWithoutGroup } = useMemo(() => {
    const groupedUsers = new Map<string, User[]>();
    const withoutGroup: User[] = [];

    for (const user of users) {
      const groupName = user.group?.trim();

      if (!groupName) {
        withoutGroup.push(user);
        continue;
      }

      const groupUsers = groupedUsers.get(groupName) ?? [];
      groupUsers.push(user);
      groupedUsers.set(groupName, groupUsers);
    }

    const groupedList = [...groupedUsers.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([groupName, groupUsers]) => ({
        groupName,
        users: [...groupUsers].sort((a, b) => a.name.localeCompare(b.name)),
      }));

    const preparedWithoutGroup = [...withoutGroup].sort((a, b) => a.name.localeCompare(b.name));

    return {
      groups: groupedList,
      usersWithoutGroup: preparedWithoutGroup,
    };
  }, [users]);

  return (
    <section className="mx-auto w-full max-w-[1568px] space-y-[16px]">
      {loading ? (
        <div className="rounded-sm bg-white p-[16px] text-[14px] text-[#939393]">Загрузка пользователей...</div>
      ) : (
        <GroupsList groups={groups} usersWithoutGroup={usersWithoutGroup} />
      )}
    </section>
  );
}
