import { useMemo, useState } from 'react';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'group-asc'
  | 'group-desc'
  | 'age-asc'
  | 'age-desc';

type UsersToolbarProps = {
  query: string;
  sortOption: SortOption;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onAddClick: () => void;
};

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'name-asc', label: 'Имя: A-Я' },
  { value: 'name-desc', label: 'Имя: Я-A' },
  { value: 'group-asc', label: 'Группа: A-Я' },
  { value: 'group-desc', label: 'Группа: Я-A' },
  { value: 'age-asc', label: 'Возраст: по возрастанию' },
  { value: 'age-desc', label: 'Возраст: по убыванию' },
];

const primaryButtonClassName =
  'h-[40px] min-w-[130px] bg-[#22528B] px-[16px] text-[14px] font-medium text-white';
const dropdownItemClassName =
  'w-full rounded px-[8px] py-[8px] text-left text-[14px] text-[#162155] hover:bg-[#F7F7F7]';

export function UsersToolbar({ query, sortOption, onQueryChange, onSortChange, onAddClick }: UsersToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedSortLabel = useMemo(
    () => sortOptions.find((option) => option.value === sortOption)?.label ?? 'Фильтр',
    [sortOption],
  );

  return (
    <section className="w-full rounded-sm bg-white p-[16px]">
      <div className="flex h-[40px] items-center gap-[12px]">
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((currentState) => !currentState)}
            className={`flex items-center justify-center ${primaryButtonClassName}`}
          >
            <span>Фильтр</span>
          </button>

          {filterOpen ? (
            <div className="absolute left-0 top-full z-20 mt-[6px] w-[260px] border border-[#F0F2F5] bg-white p-[8px] shadow-md">
              <p className="px-[8px] py-[6px] text-[12px] font-semibold text-[#939393]">{selectedSortLabel}</p>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.value);
                    setFilterOpen(false);
                  }}
                  className={dropdownItemClassName}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <label className="flex h-[40px] w-full items-center border border-[#F0F2F5] px-[20px]">
          <input
            className="h-full w-full border-none bg-transparent text-[14px] font-medium text-[#162155] outline-none placeholder:text-[rgba(147,147,147,0.6)]"
            placeholder="Поиск ..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <button
          type="button"
          className={`flex items-center justify-center ${primaryButtonClassName}`}
          onClick={onAddClick}
        >
          <span>Добавить</span>
        </button>
      </div>
    </section>
  );
}
