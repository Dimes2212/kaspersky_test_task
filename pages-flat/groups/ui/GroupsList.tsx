import type { User } from '../../../shared/types/user';

type GroupsListProps = {
  groups: Array<{ groupName: string; users: User[] }>;
  usersWithoutGroup: User[];
};

export function GroupsList({ groups, usersWithoutGroup }: GroupsListProps) {
  const hasAnyUsers = groups.length > 0 || usersWithoutGroup.length > 0;

  if (!hasAnyUsers) {
    return <section className="rounded-sm bg-white p-[16px] text-[14px] text-[#939393]">Пользователи не найдены</section>;
  }

  return (
    <section className="space-y-[12px]">
      {groups.map((group) => (
        <article key={group.groupName} className="rounded-sm bg-white p-[16px]">
          <header className="mb-[12px] flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#162155]">{group.groupName}</h2>
            <span className="text-[13px] text-[#939393]">{group.users.length} чел.</span>
          </header>

          <ul className="space-y-[8px]">
            {group.users.map((user) => (
              <li key={user.id} className="rounded-sm border border-[#F0F2F5] bg-white px-[14px] py-[10px]">
                <p className="text-[14px] font-semibold text-[#2A2A2A]">{user.name}</p>
                <p className="mt-[4px] text-[13px] text-[#939393]">
                  {user.email} • {user.phone}
                </p>
                <p className="mt-[4px] text-[13px] text-[#939393]">Аккаунт: {user.account}</p>
              </li>
            ))}
          </ul>
        </article>
      ))}

      {usersWithoutGroup.length > 0 ? (
        <article className="rounded-sm bg-white p-[16px]">
          <header className="mb-[12px] flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#162155]">Без группы</h2>
            <span className="text-[13px] text-[#939393]">{usersWithoutGroup.length} чел.</span>
          </header>

          <ul className="space-y-[8px]">
            {usersWithoutGroup.map((user) => (
              <li key={user.id} className="rounded-sm border border-[#F0F2F5] bg-white px-[14px] py-[10px]">
                <p className="text-[14px] font-semibold text-[#2A2A2A]">{user.name}</p>
                <p className="mt-[4px] text-[13px] text-[#939393]">
                  {user.email} • {user.phone}
                </p>
                <p className="mt-[4px] text-[13px] text-[#939393]">Аккаунт: {user.account}</p>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
    </section>
  );
}
