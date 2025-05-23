import { cn } from '@/lib/utils';

interface RadioCardProps {
  id: string;
  label: string;
  name: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

function RadioCard({ id, label, name, checked, onChange, className }: RadioCardProps) {
  return (
    <div className={cn('flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700', className)}>
      <input
        id={id}
        type="radio"
        name={name}
        defaultChecked={checked}
        onChange={e => onChange?.(e.target.checked)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor={id} className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
    </div>
  );
}

RadioCard.displayName = 'RadioCard';
export { RadioCard };
