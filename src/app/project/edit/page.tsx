'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { getData, patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { getFileUrl } from '@/lib/file/read';
import { uploadFile } from '@/lib/file/upload';
interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  stacks: string;
  image: string;
  content: string;
}

export default function ProjectCreate() {
  const params = useSearchParams();
  const router = useRouter();

  const slug = params.get('slug');
  const { data, error } = useSWR<{ data: ProjectFormData | null }>(
    slug ? `/api/project/slug?slug=${slug}` : null,
    fetcher,
  );

  /*
    success : 사용할 수 있는 slug입니다.
    over: 이미 사용 중인 slug입니다.
    error : 데이터 요청 중 오류가 발생했습니다.
    none : 데이터 요청 전
  */
  const [overSlug, setOverSlug] = useState<{
    status: 'success' | 'over' | 'error' | 'none';
    count?: number;
  }>({
    status: 'none',
    count: 0,
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      stacks: '',
      image: '',
      content: '',
    },
  });

  const handleCheckDuplicate = async () => {
    const response = await getData(`/project/over-slug/${watch('slug')}`, {}, true);

    setOverSlug({
      status: response.error ? 'error' : response > 0 ? 'over' : 'success',
      count: typeof response === 'number' ? response : 0,
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return alert('파일을 선택하세요.');

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData, 'main');

    if (result.error) {
      toast.error('업로드 실패: ' + result.error);
    } else {
      const { url } = await getFileUrl(result.data?.path as string);
      setValue('image', url);
      toast.success('업로드 성공!');
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    switch (overSlug.status) {
      case 'over':
        toast.error('중복된 slug를 사용할 수 없습니다.');
        return;
      case 'error':
        toast.error('중복 확인 중 오류가 발생했습니다.');
        return;
      default:
        break;
    }

    toast('프로젝트 수정 진행 중...');
    try {
      const response = await patchData(`/api/project/edit`, data);

      if (response.status !== 200) {
        throw new Error('프로젝트 수정에 실패했습니다.');
      }

      toast.success('프로젝트가 수정 되었습니다.');
      router.push('/project');
    } catch {
      toast.error('프로젝트 수정중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  return (
    <>
      {data?.data && (
        <form>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              프로젝트명
            </label>
            <input
              type="text"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="프로젝트 이름을 입력해주세요"
              maxLength={12}
              {...register('title', {
                required: '프로젝트명은 필수입니다.',
                minLength: {
                  value: 2,
                  message: '프로젝트명은 2글자 이상이어야 합니다.',
                },
              })}
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              slug
            </label>
            <input
              type="text"
              id="slug"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="프로젝트 고유 아이디입니다. 중복되지 않도록 입력해주세요"
              {...register('slug', {
                required: 'slug는 필수입니다.',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'slug는 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.',
                },
              })}
            />
            <Button variant="secondary" className="mt-2" size="sm" onClick={handleCheckDuplicate} type="button">
              중복 확인
            </Button>
            <>
              {overSlug.status === 'success' && (
                <p className="mt-2 text-sm text-green-600">사용할 수 있는 slug입니다.</p>
              )}
              {overSlug.status === 'over' && (
                <p className="mt-2 text-sm text-orange-600">
                  이미 사용 중인 slug입니다. 중복 확인 후 다시 입력해주세요. 개수 : {overSlug.count}
                </p>
              )}
              {overSlug.status === 'error' && (
                <p className="mt-2 text-sm text-red-600">
                  데이터를 가져오는 과정에서 오류가 발생했습니다. error : {error}
                </p>
              )}
            </>
            {errors.slug && <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              설명
            </label>
            <input
              type="text"
              id="description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="설명을 입력해주세요. 최대 15글자 이내"
              maxLength={15}
              {...register('description', {
                required: '설명은 필수입니다.',
                minLength: {
                  value: 5,
                  message: '설명은 15글자 이상이어야 합니다.',
                },
              })}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="stack" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              기술 스택
            </label>
            <input
              type="text"
              id="stack"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="기술스택을 입력해주세요."
              {...register('stacks', {
                required: '기술 스택은 필수입니다.',
              })}
            />
            {errors.stacks && <p className="mt-2 text-sm text-red-600">{errors.stacks.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              이미지 추가하기
            </label>
            <input
              type="file"
              id="image"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleFileUpload}
              accept="image/*"
              ref={inputRef}
            />
            {watch('image') && (
              <div className="mt-2">
                <Image src={watch('image')} alt="Preview" width={300} height={200} className="max-w-xs h-auto" />
              </div>
            )}
            {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              내용
            </label>
            <input
              type="text"
              id="content"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="내용을 입력해주세요."
              {...register('content', {
                required: '내용은 필수입니다.',
                minLength: {
                  value: 10,
                  message: '내용은 10글자 이상이어야 합니다.',
                },
              })}
            />
            {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
          </div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSubmit(onSubmit)}
          >
            프로젝트 수정
          </button>
        </form>
      )}
    </>
  );
}
