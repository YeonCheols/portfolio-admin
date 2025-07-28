import { StackIcon } from '@yeoncheols/portfolio-core-ui';
import { useMemo, useState } from 'react';
import { FormSection, FormInput, Button } from '@/components/ui';
import { type StackFormProps } from '@/types/stack';

export function StackForm({
  formMode,
  defaultValues,
  register,
  errors,
  handleSubmit,
  onSubmit,
  onClose,
}: StackFormProps) {
  const [isPreviewIcon, setIsPreviewIcon] = useState(false);
  const previewIcon = useMemo(() => {
    return defaultValues;
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormSection>
          <FormInput
            id="name"
            name="스택명"
            register={register}
            errors={errors}
            validation={{
              required: '스택명을 입력해주세요',
            }}
            placeholder="예: React.js"
          />
        </FormSection>
        <FormSection>
          <FormInput
            id="icon"
            name="아이콘명"
            register={register}
            errors={errors}
            validation={{
              required: '아이콘명을 입력해주세요',
            }}
            placeholder="예: SiReact"
          />
        </FormSection>
        <FormSection>
          <FormInput id="color" name="색상" register={register} errors={errors} placeholder="예: text-sky-500" />
        </FormSection>
        <FormSection>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            카테고리
          </label>
          <select
            id="category"
            {...register('category', { required: '카테고리를 선택해주세요' })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">카테고리 선택</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="devops">DevOps</option>
            <option value="tool">Tool</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
        </FormSection>
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {formMode === 'add' ? '추가' : '수정'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          닫기
        </Button>
        <div className="flex items-center ml-auto">
          <Button type="button" variant="outline" color="blue" onClick={() => setIsPreviewIcon(!isPreviewIcon)}>
            아이콘 미리보기
          </Button>
          {isPreviewIcon && (
            <StackIcon name={previewIcon.name} icon={previewIcon.icon} color={previewIcon.color} size={20} />
          )}
        </div>
      </div>
    </form>
  );
}
