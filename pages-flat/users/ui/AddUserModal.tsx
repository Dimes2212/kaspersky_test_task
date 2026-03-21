import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import type { CreateUserPayload } from '../../../shared/api/users';

type AddUserModalProps = {
  onCancel: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
};

type FormState = {
  name: string;
  account: string;
  email: string;
  group: string;
  phone: string;
  age: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: '',
  account: '',
  email: '',
  group: '',
  phone: '',
  age: '',
};

const inputClassName =
  'h-[40px] w-full border border-[#F0F2F5] px-[16px] text-[14px] font-medium text-[#162155] outline-none placeholder:text-[rgba(147,147,147,0.6)]';
const invalidInputClassName = 'border-red-500';
const modalButtonClassName =
  'h-[44px] min-w-[180px] px-[24px] bg-[#22528B] text-[14px] font-medium text-white';

const allowedNamePattern = /^[A-Za-zА-Яа-яЁё\s'-]+$/;
const allowedAccountPattern = /^[A-Za-z0-9._/-]+$/;
const allowedGroupPattern = /^[A-Za-zА-Яа-яЁё0-9\s./-]+$/;
const allowedPhonePattern = /^[+0-9()\s-]+$/;

function normalizeSpaces(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function validateForm(state: FormState): FormErrors {
  const errors: FormErrors = {};
  const name = normalizeSpaces(state.name);
  const account = state.account.trim();
  const email = state.email.trim();
  const group = normalizeSpaces(state.group);
  const phone = state.phone.trim();
  const age = state.age.trim();
  const ageNumber = Number(age);

  if (!name) {
    errors.name = 'Укажи имя';
  } else if (name.length < 2 || name.length > 80) {
    errors.name = 'Имя должно быть от 2 до 80 символов';
  } else if (!allowedNamePattern.test(name)) {
    errors.name = 'Имя может содержать только буквы, пробел, дефис и апостроф';
  }

  if (!account) {
    errors.account = 'Укажи учетную запись';
  } else if (account.length < 3 || account.length > 80) {
    errors.account = 'Учетная запись должна быть от 3 до 80 символов';
  } else if (!allowedAccountPattern.test(account)) {
    errors.account = 'Допустимы только буквы, цифры и . _ / -';
  }

  if (!email) {
    errors.email = 'Укажи email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Неверный формат email';
  }

  if (group) {
    if (group.length > 60) {
      errors.group = 'Название группы должно быть до 60 символов';
    } else if (!allowedGroupPattern.test(group)) {
      errors.group = 'Недопустимые символы в группе';
    }
  }

  if (!phone) {
    errors.phone = 'Укажи номер телефона';
  } else if (!allowedPhonePattern.test(phone)) {
    errors.phone = 'Номер может содержать только +, цифры, пробелы, скобки и дефисы';
  } else {
    const digitsCount = phone.replace(/\D/g, '').length;
    if (digitsCount < 10 || digitsCount > 15) {
      errors.phone = 'Номер должен содержать от 10 до 15 цифр';
    }
  }

  if (!age) {
    errors.age = 'Укажи возраст';
  } else if (!Number.isInteger(ageNumber) || ageNumber < 14 || ageNumber > 100) {
    errors.age = 'Возраст должен быть целым числом от 14 до 100';
  }

  return errors;
}

export function AddUserModal({ onCancel, onSubmit }: AddUserModalProps) {
  const modalRef = useRef<HTMLFormElement | null>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    account: false,
    email: false,
    group: false,
    phone: false,
    age: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const errors = useMemo(() => validateForm(formState), [formState]);
  const hasValidationErrors = Object.keys(errors).length > 0;

  const handleChange = (key: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleBlur = (key: keyof FormState) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const getInputClassName = (key: keyof FormState) => {
    const isInvalid = Boolean(errors[key]) && (touched[key] || submitted);
    return `${inputClassName} ${isInvalid ? invalidInputClassName : ''}`.trim();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitted(true);

    if (hasValidationErrors) {
      setError('Проверь корректность заполнения формы');
      return;
    }

    const ageNumber = Number(formState.age.trim());

    setSubmitting(true);

    try {
      await onSubmit({
        name: normalizeSpaces(formState.name),
        account: formState.account.trim(),
        email: formState.email.trim(),
        group: normalizeSpaces(formState.group) || null,
        phone: formState.phone.trim(),
        age: ageNumber,
      });
    } catch {
      setError('Не удалось добавить пользователя');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!modalRef.current) {
        return;
      }

      const target = event.target as Node;

      if (!modalRef.current.contains(target)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <form ref={modalRef} onSubmit={handleSubmit} className="w-full max-w-[620px] rounded-sm bg-white p-[20px]">
        <div className="space-y-[14px]">
          <h2 className="text-2xl font-semibold text-[#162155]">Добавить пользователя</h2>

          <input
            className={getInputClassName('name')}
            placeholder="Полное имя"
            value={formState.name}
            onChange={(event) => handleChange('name', event.target.value)}
            onBlur={() => handleBlur('name')}
          />
          {errors.name && (touched.name || submitted) ? <p className="text-xs text-red-600">{errors.name}</p> : null}
          <input
            className={getInputClassName('account')}
            placeholder="Учетная запись"
            value={formState.account}
            onChange={(event) => handleChange('account', event.target.value)}
            onBlur={() => handleBlur('account')}
          />
          {errors.account && (touched.account || submitted) ? (
            <p className="text-xs text-red-600">{errors.account}</p>
          ) : null}
          <input
            type="email"
            className={getInputClassName('email')}
            placeholder="Электронная почта"
            value={formState.email}
            onChange={(event) => handleChange('email', event.target.value)}
            onBlur={() => handleBlur('email')}
          />
          {errors.email && (touched.email || submitted) ? <p className="text-xs text-red-600">{errors.email}</p> : null}
          <input
            className={getInputClassName('group')}
            placeholder="Группа"
            value={formState.group}
            onChange={(event) => handleChange('group', event.target.value)}
            onBlur={() => handleBlur('group')}
          />
          {errors.group && (touched.group || submitted) ? <p className="text-xs text-red-600">{errors.group}</p> : null}
          <input
            className={getInputClassName('phone')}
            placeholder="Номер телефона"
            value={formState.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            onBlur={() => handleBlur('phone')}
          />
          {errors.phone && (touched.phone || submitted) ? <p className="text-xs text-red-600">{errors.phone}</p> : null}
          <input
            type="number"
            min={14}
            max={100}
            className={getInputClassName('age')}
            placeholder="Возраст"
            value={formState.age}
            onChange={(event) => handleChange('age', event.target.value)}
            onBlur={() => handleBlur('age')}
          />
          {errors.age && (touched.age || submitted) ? <p className="text-xs text-red-600">{errors.age}</p> : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-center gap-[12px] pt-[12px]">
            <button
              type="button"
              onClick={onCancel}
              className={`flex items-center justify-center ${modalButtonClassName}`}
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={submitting || hasValidationErrors}
              className={`flex items-center justify-center ${modalButtonClassName} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {submitting ? 'Сохраняем...' : 'Готово'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
