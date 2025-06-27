'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StackTag } from '@/components/ui/stack-icon';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

export interface StackSelectorProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  maxStacks?: number;
}

export function StackSelector({ name, label = '기술 스택', className = '', maxStacks = 10 }: StackSelectorProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStacks, setSelectedStacks] = useState<Array<{ name: string; icon: string; color: string }>>([]);
  const [availableStacks, setAvailableStacks] = useState<Array<{ name: string; icon: string; color: string }>>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = watch(name);

  // 스택 데이터 로드
  useEffect(() => {
    const loadStacks = async () => {
      setLoading(true);
      try {
        const response = await fetcher('/api/stacks');
        if (response.status) {
          setAvailableStacks(response.data);
        }
      } catch {
        console.info('Failed to load stacks');
      } finally {
        setLoading(false);
      }
    };

    loadStacks();
  }, []);

  // 초기값 설정
  useEffect(() => {
    if (currentValue) {
      try {
        const stacksArray = JSON.parse(currentValue);
        const stackObjects = stacksArray.map((stackName: string) => {
          const stack = availableStacks.find(s => s.name === stackName);
          return stack || { name: stackName, icon: '', color: '' };
        });
        setSelectedStacks(stackObjects);
      } catch {
        console.info('Failed to parse stacks');
      }
    }
  }, [currentValue, availableStacks]);

  // 스택 추가
  const addStack = (stack: { name: string; icon: string; color: string }) => {
    if (selectedStacks.length >= maxStacks) {
      alert(`최대 ${maxStacks}개의 스택만 선택할 수 있습니다.`);
      return;
    }

    if (!selectedStacks.find(s => s.name === stack.name)) {
      const newStacks = [...selectedStacks, stack];
      setSelectedStacks(newStacks);
      setValue(name, JSON.stringify(newStacks.map(s => s.name)));
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  // 스택 제거
  const removeStack = (stackName: string) => {
    const newStacks = selectedStacks.filter(s => s.name !== stackName);
    setSelectedStacks(newStacks);
    setValue(name, JSON.stringify(newStacks.map(s => s.name)));
  };

  // 필터링된 스택 목록
  const filteredStacks = availableStacks.filter(
    stack =>
      stack.name.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedStacks.find(s => s.name === stack.name),
  );

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}

      {/* 숨겨진 입력 필드 */}
      <input {...register(name)} type="hidden" />

      {/* 선택된 스택 태그들 */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
        {selectedStacks.map((stack, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
          >
            <StackTag name={stack.name} icon={stack.icon} color={stack.color} size={14} />
            <button
              type="button"
              onClick={() => removeStack(stack.name)}
              className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              ×
            </button>
          </div>
        ))}

        {selectedStacks.length < maxStacks && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => setIsOpen(true)}
              >
                + 스택 추가
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-3 border-b">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="스택 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">로딩 중...</div>
                ) : filteredStacks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '사용 가능한 스택이 없습니다.'}
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredStacks.map((stack, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addStack(stack)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <StackTag name={stack.name} icon={stack.icon} color={stack.color} size={16} showName />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* 에러 메시지 */}
      {errors[name] && <p className="text-sm text-red-600 dark:text-red-400">{errors[name]?.message as string}</p>}

      {/* 선택된 스택 개수 표시 */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {selectedStacks.length} / {maxStacks} 스택 선택됨
      </p>
    </div>
  );
}
