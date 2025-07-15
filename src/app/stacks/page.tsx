'use client';

import { StackTag } from '@yeoncheols/portfolio-core-ui';
import { isEqual } from 'lodash-es';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form/form-section';
import FormInput from '@/components/ui/form/input';
import { IconManager } from '@/components/ui/icon-manager';
import { Loading } from '@/components/ui/loading';
import { Table } from '@/components/ui/table';
import { stackTableHeader } from '@/data/table/stacks';
import { type AdminTagUpdateRequest, type AdminTagCreateRequest, type AdminTagResponse } from '@/docs/api';
import { deleteData, postData, putData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { useTableStore } from '@/lib/zustand/table';

export default function StacksManagement() {
  const { table, setBody } = useTableStore();

  const [formMode, setFormMode] = useState<'add' | 'edit' | 'none'>('none');
  const [showIconManager, setShowIconManager] = useState(false);

  const {
    data: stacksData,
    isLoading: isStacksLoading,
    mutate: stacksMutate,
  } = useSWR<{ data: AdminTagResponse[] }>(`/api/stacks`, fetcher);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminTagCreateRequest>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      icon: '',
      color: '',
      category: 'frontend',
    },
  });

  // 스택 추가
  const handleAddStack = async (data: AdminTagCreateRequest) => {
    const newStack: AdminTagCreateRequest = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      category: data.category,
    };

    try {
      const response = await postData(`/api/stacks`, newStack);

      if (response.status) {
        await stacksMutate();
        setFormMode('none');
        reset();
      }
    } catch {
      setFormMode('none');
      console.info('Failed to add stack');
    }
  };

  // 스택 수정
  const handleEditStack = async (data: AdminTagUpdateRequest) => {
    if (formMode !== 'edit') {
      return;
    }

    const updatedStack: AdminTagUpdateRequest = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      category: data.category,
    };

    try {
      const response = await putData(`/api/stacks/${data.name}`, updatedStack);

      if (response.status) {
        await stacksMutate();
        setFormMode('none');
        reset();
      }
    } catch {
      console.info('Failed to update stack');
    }
  };

  // 스택 삭제
  const handleDeleteStack = async (stackName: string) => {
    if (!confirm(`정말로 "${stackName}" 스택을 삭제하시겠습니까?`)) return;

    try {
      const response = await deleteData(`/api/stacks/${stackName}`);

      if (response.status) {
        await stacksMutate();
      }
    } catch {
      console.info('Failed to delete stack');
    }
  };

  // 수정 모드 시작
  const startEditing = (stack: AdminTagResponse) => {
    setFormMode('edit');
    setValue('name', stack.name);
    setValue('icon', stack.icon);
    setValue('color', stack.color);
    setValue('category', stack.category);
  };

  // 수정 모드 취소
  const cancelEditing = () => {
    setFormMode('none');
    reset();
  };

  // 추가 모드 취소
  const cancelAdding = () => {
    setFormMode('none');
    reset();
  };

  const stacksTableData = useMemo(
    () =>
      stacksData?.data.map(stack => ({
        id: {
          checkbox: {
            id: `checkbox-${stack.name}`,
            value: stack.name,
            checked: false,
          },
        },
        name: stack.name,
        icon: (
          <div className="flex items-center gap-2">
            <StackTag name={stack.name} icon={stack.icon} color={stack.color} size={20} showName />
          </div>
        ),
        color: (
          <div className="flex items-center gap-2">
            <span className="text-sm">{stack.color}</span>
          </div>
        ),
        category: (
          <span
            className={cn('px-2 py-1 rounded-full text-xs font-medium', {
              'bg-blue-100 text-blue-800': stack.category === 'frontend',
              'bg-green-100 text-green-800': stack.category === 'backend',
              'bg-purple-100 text-purple-800': stack.category === 'database',
              'bg-orange-100 text-orange-800': stack.category === 'devops',
              'bg-gray-100 text-gray-800': stack.category === 'tool',
              'bg-red-100 text-red-800': stack.category === 'other',
            })}
          >
            {stack.category}
          </span>
        ),
        actions: (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => startEditing(stack)}>
              수정
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDeleteStack(stack.name)}>
              삭제
            </Button>
          </div>
        ),
      })) || [],
    [stacksData],
  );

  useEffect(() => {
    if (!isEqual(stacksTableData, table.body)) {
      setBody(stacksTableData);
    }
  }, [stacksTableData]);

  if (isStacksLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* 아이콘 관리자 토글 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" onClick={() => setFormMode('add')}>
          새 스택 추가
        </Button>
        <Button variant="outline" onClick={() => setShowIconManager(!showIconManager)}>
          {showIconManager ? '아이콘 관리자 숨기기' : '아이콘 관리자 보기'}
        </Button>
      </div>

      {/* 아이콘 관리자 */}
      {showIconManager && (
        <div className="mb-6">
          <IconManager />
        </div>
      )}

      {/* 스택 추가 폼 */}
      {formMode === 'add' && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 스택 추가</h2>
          <form onSubmit={handleSubmit(handleAddStack)} className="space-y-4">
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
              <Button type="submit">추가</Button>
              <Button type="button" variant="outline" onClick={cancelAdding}>
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 스택 수정 폼 */}
      {formMode === 'edit' && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-4">스택 수정</h2>
          <form onSubmit={handleSubmit(handleEditStack)} className="space-y-4">
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
                  placeholder="스택명"
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
                  placeholder="아이콘명"
                />
              </FormSection>
              <FormSection>
                <FormInput id="color" name="색상" register={register} errors={errors} placeholder="색상 클래스" />
              </FormSection>
              <FormSection>
                <select
                  {...register('category', { required: '카테고리를 선택해주세요' })}
                  className="w-full p-2 border rounded-md"
                >
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
              <Button type="submit">수정</Button>
              <Button type="button" variant="outline" onClick={cancelEditing}>
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 스택 테이블 */}
      {stacksData && <Table table={{ header: stackTableHeader, body: stacksTableData }} />}
    </>
  );
}
