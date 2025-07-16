import { type FieldErrors, type SubmitHandler, type UseFormRegister } from 'react-hook-form';
import { type AdminTagCreateRequest } from '@/docs/api';

export interface StackFormProps {
  formMode: 'add' | 'edit' | 'none';
  register: UseFormRegister<AdminTagCreateRequest>;
  errors: FieldErrors<AdminTagCreateRequest>;
  handleSubmit: (fn: SubmitHandler<AdminTagCreateRequest>) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: SubmitHandler<AdminTagCreateRequest>;
  onClose: () => void;
}
