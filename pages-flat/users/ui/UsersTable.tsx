import type { User } from '../../../shared/types/user';

type UsersTableProps = {
  users: User[];
  deletingUserId: number | null;
  onDeleteUser: (userId: number) => void;
};

const tableGridClassName = 'grid grid-cols-[2fr_1.45fr_2fr_1.35fr_1.35fr_0.7fr_0.7fr] items-center';
const headerCellClassName = 'px-[16px] text-[14px] font-medium text-[#939393]';
const rowCellClassName = 'min-w-0 px-[16px] text-[14px] font-medium leading-[140%] text-[#2A2A2A]';

export function UsersTable({ users, deletingUserId, onDeleteUser }: UsersTableProps) {
  const rows = users;

  return (
    <section className="w-full max-w-[1568px] space-y-[8px]">
      <div className={`${tableGridClassName} h-[64px] rounded-sm bg-white`}>
        <div className={headerCellClassName}>Полное имя</div>
        <div className={headerCellClassName}>Учетная запись</div>
        <div className={headerCellClassName}>Электронная почта</div>
        <div className={headerCellClassName}>Группа</div>
        <div className={headerCellClassName}>Номер телефона</div>
        <div className={headerCellClassName}>Возраст</div>
        <div className={headerCellClassName} />
      </div>

      <div className="space-y-[8px]">
        {rows.length > 0 ? (
          rows.map((user) => (
            <article
              key={user.id}
              className={`${tableGridClassName} min-h-[72px] rounded-sm bg-white`}
            >
              <div className={`${rowCellClassName} truncate`}>{user.name}</div>
              <div className={`${rowCellClassName} truncate`}>{user.account}</div>
              <div className={`${rowCellClassName} truncate`}>{user.email}</div>
              <div className={`${rowCellClassName} truncate`}>{user.group ?? 'Без группы'}</div>
              <div className={`${rowCellClassName} truncate`}>{user.phone}</div>
              <div className={`${rowCellClassName} text-center`}>{user.age}</div>
              <div className={`${rowCellClassName} flex justify-center`}>
                <button
                  type="button"
                  className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-slate-50 disabled:opacity-50"
                  aria-label="Удалить пользователя"
                  onClick={() => onDeleteUser(user.id)}
                  disabled={deletingUserId === user.id}
                >
                  {deletingUserId === user.id ? (
                    <span className="text-[10px] text-[#939393]">...</span>
                  ) : (
                    <img src="/icons/fi-rs-trash.svg" alt="" width={18} height={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-sm bg-white px-5 py-6 text-sm text-[#939393]">
            Пользователи не найдены
          </article>
        )}
      </div>
    </section>
  );
}
