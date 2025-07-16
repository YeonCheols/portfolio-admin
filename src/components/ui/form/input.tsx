import { type RegisterOptions, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  validation?: RegisterOptions<any>;
  className?: string;
}

function FormInput(props: FormInputProps) {
  const { id, name, register, errors, validation, className, ...restProps } = props;

  return (
    <>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {name}
      </label>
      <input
        id={id}
        className={cn('w-full p-2 border rounded-md', className)}
        {...(register ? register(id, { ...validation }) : {})}
        {...restProps}
      />
      {errors && errors[id] && <p className="mt-2 text-sm text-red-600">{errors[id]?.message as string}</p>}
    </>
  );
}

export { FormInput };
