function FormSection({ children, label }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      {label && <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>}
      {children}
    </div>
  );
}

FormSection.displayName = 'FormSection';

export { FormSection };
