'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type StackMetadata } from '../api/stacks/route';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form/form-section';
import FormInput from '@/components/ui/form/input';
import { IconManager } from '@/components/ui/icon-manager';
import { Loading } from '@/components/ui/loading';
import { StackIcon } from '@/components/ui/stack-icon';
import { Table } from '@/components/ui/table';
import { stackTableHeader } from '@/data/table/stacks';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

interface StackFormData {
  name: string;
  icon: string;
  color: string;
  category: StackMetadata['category'];
}

export default function StacksManagement() {
  const [stacks, setStacks] = useState<StackMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStack, setEditingStack] = useState<StackMetadata | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showIconManager, setShowIconManager] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StackFormData>();

  // 스택 데이터 로드
  const loadStacks = async () => {
    setLoading(true);
    try {
      const response = await fetcher('/api/stacks');
      if (response.status) {
        setStacks(response.data);
      }
    } catch {
      console.info('Failed to load stacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStacks();
  }, []);

  // 스택 추가
  const handleAddStack = async (data: StackFormData) => {
    const newStack: StackMetadata = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      category: data.category,
    };

    try {
      const response = await fetch('/api/stacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStack),
      });

      if (response.ok) {
        await loadStacks();
        setIsAdding(false);
        reset();
      }
    } catch {
      console.info('Failed to add stack');
    }
  };

  // 스택 수정
  const handleEditStack = async (data: StackFormData) => {
    if (!editingStack) return;

    const updatedStack: StackMetadata = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      category: data.category,
    };

    try {
      const response = await fetch(`/api/stacks/${editingStack.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStack),
      });

      if (response.ok) {
        await loadStacks();
        setEditingStack(null);
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
      const response = await fetch(`/api/stacks/${stackName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadStacks();
      }
    } catch {
      console.info('Failed to delete stack');
    }
  };

  // 수정 모드 시작
  const startEditing = (stack: StackMetadata) => {
    setEditingStack(stack);
    setValue('name', stack.name);
    setValue('icon', stack.icon);
    setValue('color', stack.color);
    setValue('category', stack.category);
  };

  // 수정 모드 취소
  const cancelEditing = () => {
    setEditingStack(null);
    reset();
  };

  // 추가 모드 취소
  const cancelAdding = () => {
    setIsAdding(false);
    reset();
  };

  const tableData = stacks.map(stack => ({
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
        <StackIcon name={stack.name} icon={stack.icon} color={stack.color} size={20} />
        <span className="text-sm">{stack.icon}</span>
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
  }));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* 아이콘 관리자 토글 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" onClick={() => setIsAdding(true)}>
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
      {isAdding && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 스택 추가</h2>
          <form onSubmit={handleSubmit(handleAddStack)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormSection>
                <FormInput
                  id="name"
                  {...register('name', { required: '스택명을 입력해주세요' })}
                  placeholder="예: React.js"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </FormSection>
              <FormSection>
                <FormInput
                  id="icon"
                  {...register('icon', { required: '아이콘명을 입력해주세요' })}
                  placeholder="예: SiReact"
                />
                {errors.icon && <span className="text-red-500 text-sm">{errors.icon.message}</span>}
              </FormSection>
              <FormSection>
                <FormInput id="color" {...register('color')} placeholder="예: text-sky-500" />
              </FormSection>
              <FormSection>
                <select
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
      {editingStack && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-4">스택 수정</h2>
          <form onSubmit={handleSubmit(handleEditStack)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormSection>
                <FormInput
                  id="edit-name"
                  {...register('name', { required: '스택명을 입력해주세요' })}
                  placeholder="스택명"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </FormSection>
              <FormSection>
                <FormInput
                  id="edit-icon"
                  {...register('icon', { required: '아이콘명을 입력해주세요' })}
                  placeholder="아이콘명"
                />
                {errors.icon && <span className="text-red-500 text-sm">{errors.icon.message}</span>}
              </FormSection>
              <FormSection>
                <FormInput id="edit-color" {...register('color')} placeholder="색상 클래스" />
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
      <Table table={{ header: stackTableHeader, body: tableData }} />
    </>
  );
}
