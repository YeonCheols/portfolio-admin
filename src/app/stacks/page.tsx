'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form/form-section';
import FormInput from '@/components/ui/form/input';
import { Loading } from '@/components/ui/loading';
import { StackIcon } from '@/components/ui/stack-icon';
import { Table } from '@/components/ui/table';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { stackTableHeader } from '@/data/table/stacks';

interface StackMetadata {
  name: string;
  icon: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tool' | 'other';
}

export default function StacksManagement() {
  const [stacks, setStacks] = useState<StackMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStack, setEditingStack] = useState<StackMetadata | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 스택 데이터 로드
  const loadStacks = async () => {
    setLoading(true);
    try {
      const response = await fetcher('/api/stacks');
      if (response.status) {
        setStacks(response.data);
      }
    } catch (error) {
      console.error('Failed to load stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStacks();
  }, []);

  // 스택 추가
  const handleAddStack = async (formData: FormData) => {
    const newStack: StackMetadata = {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      category: formData.get('category') as StackMetadata['category'],
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
      }
    } catch (error) {
      console.error('Failed to add stack:', error);
    }
  };

  // 스택 수정
  const handleEditStack = async (formData: FormData) => {
    if (!editingStack) return;

    const updatedStack: StackMetadata = {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      category: formData.get('category') as StackMetadata['category'],
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
      }
    } catch (error) {
      console.error('Failed to update stack:', error);
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
    } catch (error) {
      console.error('Failed to delete stack:', error);
    }
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
        <div className={cn('w-4 h-4 rounded', stack.color)}></div>
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
        <Button size="sm" variant="outline" onClick={() => setEditingStack(stack)}>
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
      <Button variant="secondary" className="mb-4" onClick={() => setIsAdding(true)}>
        새 스택 추가
      </Button>

      {/* 스택 추가 폼 */}
      {isAdding && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4">새 스택 추가</h2>
          <form action={handleAddStack} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormSection>
                <FormInput id="name" name="name" placeholder="예: React.js" required />
              </FormSection>
              <FormSection>
                <FormInput id="icon" name="icon" placeholder="예: SiReact" required />
              </FormSection>
              <FormSection>
                <FormInput id="color" name="color" placeholder="예: text-sky-500" />
              </FormSection>
              <FormSection>
                <select name="category" className="w-full p-2 border rounded-md" required>
                  <option value="">카테고리 선택</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </FormSection>
            </div>
            <div className="flex gap-2">
              <Button type="submit">추가</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 스택 수정 폼 */}
      {editingStack && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4">스택 수정</h2>
          <form action={handleEditStack} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormSection>
                <FormInput id="name" name="name" placeholder="스택명" defaultValue={editingStack.name} required />
              </FormSection>
              <FormSection>
                <FormInput id="icon" name="icon" placeholder="아이콘명" defaultValue={editingStack.icon} required />
              </FormSection>
              <FormSection>
                <FormInput id="color" name="color" placeholder="색상 클래스" defaultValue={editingStack.color} />
              </FormSection>
              <FormSection>
                <select
                  name="category"
                  className="w-full p-2 border rounded-md"
                  defaultValue={editingStack.category}
                  required
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </FormSection>
            </div>
            <div className="flex gap-2">
              <Button type="submit">수정</Button>
              <Button type="button" variant="outline" onClick={() => setEditingStack(null)}>
                취소
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* 스택 목록 테이블 */}
      <Table table={{ header: stackTableHeader, body: tableData }} />
    </>
  );
}
