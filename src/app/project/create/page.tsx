'use client';

import { StackSelector } from '@yeoncheols/portfolio-core-ui';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form/input';
import { FormSection } from '@/components/ui/form/section';
import { RadioCard } from '@/components/ui/radio-card';
import { Tabs } from '@/components/ui/tab';
import { type AdminTagResponse, type AdminProjectCreateRequest } from '@/docs/api';
import { getData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { getFileUrl } from '@/lib/file/read';
import { uploadFile } from '@/lib/file/upload';

export default function ProjectCreate() {
  const router = useRouter();

  const methods = useForm<AdminProjectCreateRequest>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      stacks: '',
      image: '',
      linkDemo: '',
      linkGithub: '',
      isShow: false,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const { data: stacksData } = useSWR<{ data: AdminTagResponse[] }>(`/api/stacks`, fetcher);

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
  const [activeTab, setActiveTab] = useState<string>('url');

  const handleCheckDuplicate = async () => {
    const response = await getData<number>(`/project/over-slug/${watch('slug')}`, {}, true);

    if (response.status) {
      setOverSlug({
        status: response.data > 0 ? 'over' : 'success',
        count: typeof response.data === 'number' ? response.data : 0,
      });
    } else {
      setOverSlug({
        status: 'error',
        count: 0,
      });
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLInputElement>) => {
    toast('파일 업로드 진행 중...');
    e.preventDefault();

    const file = e.currentTarget?.files?.[0];
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

  const onSubmit = async (data: AdminProjectCreateRequest) => {
    toast('프로젝트 생성 진행 중...');
    try {
      const response = await fetch('/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        toast.success('프로젝트가 성공적으로 생성되었습니다.');
        router.push('/project');
      } else {
        toast.error('프로젝트 생성 중 오류가 발생했습니다.');
      }
    } catch {
      toast.error('프로젝트 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <form>
        <FormSection>
          <FormInput
            id="title"
            name="프로젝트명"
            register={register}
            errors={errors}
            validation={{
              required: '프로젝트명은 필수입니다.',
              minLength: {
                value: 2,
                message: '프로젝트명은 2글자 이상이어야 합니다.',
              },
            }}
            className='"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'
            placeholder="프로젝트 이름을 입력해주세요"
            maxLength={12}
          />
        </FormSection>
        <FormSection>
          <FormInput
            id="slug"
            name="slug"
            register={register}
            errors={errors}
            validation={{
              required: 'slug는 필수입니다.',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'slug는 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.',
              },
              validate: () => {
                if (overSlug.status === 'success') {
                  return true;
                }
              },
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="프로젝트 고유 아이디입니다. 중복되지 않도록 입력해주세요"
            maxLength={40}
          />
          <Button variant="secondary" className="mt-2" size="sm" onClick={handleCheckDuplicate} type="button">
            중복 확인
          </Button>
          <>
            {overSlug.status === 'success' && <p className="mt-2 text-sm text-green-600">사용할 수 있는 slug입니다.</p>}
            {overSlug.status === 'over' && (
              <p className="mt-2 text-sm text-orange-600">
                이미 사용 중인 slug입니다. 중복 확인 후 다시 입력해주세요. 개수 : {overSlug.count}
              </p>
            )}
            {overSlug.status === 'error' && (
              <p className="mt-2 text-sm text-red-600">데이터를 가져오는 과정에서 오류가 발생했습니다.</p>
            )}
          </>
        </FormSection>
        <FormSection>
          <FormInput
            id="description"
            name="description"
            register={register}
            errors={errors}
            validation={{
              required: '설명은 필수입니다.',
              minLength: {
                value: 5,
                message: '설명은 최소 5글자 이상이어야 합니다.',
              },
            }}
            placeholder="설명을 입력해주세요."
            maxLength={100}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </FormSection>
        {stacksData?.data && (
          <FormProvider {...methods}>
            <FormSection>
              <StackSelector
                stacks={stacksData?.data}
                name="stacks"
                label="기술 스택"
                placeholder="기술 스택을 선택하세요"
                maxStacks={8}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </FormSection>
          </FormProvider>
        )}
        <FormSection>
          <FormInput
            id="linkDemo"
            name="사이트 주소"
            register={register}
            placeholder="사이트 주소를 입력해주세요."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </FormSection>
        <FormSection>
          <FormInput
            id="linkGithub"
            name="깃허브 주소"
            register={register}
            placeholder="깃허브 주소를 입력해주세요."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </FormSection>

        <FormSection label="이미지 설정">
          <Tabs
            tabs={[
              {
                id: 'url',
                label: 'URL 입력',
                content: (
                  <FormSection>
                    <FormInput
                      id="image"
                      name="이미지 URL"
                      register={register}
                      errors={errors}
                      placeholder="이미지 주소를 입력해주세요."
                      onChange={e => {
                        setValue('image', e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {watch('image') && (
                      <div className="mt-8">
                        <NextImage
                          src={watch('image') as string}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="max-w-xs h-auto"
                          unoptimized
                        />
                      </div>
                    )}
                  </FormSection>
                ),
              },
              {
                id: 'upload',
                label: '파일 업로드',
                content: (
                  <FormSection>
                    <FormInput
                      id="image"
                      name="이미지 파일"
                      register={register}
                      placeholder="이미지를 추가해주세요."
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {watch('image') && (
                      <div className="mt-8">
                        <NextImage
                          src={watch('image') as string}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="max-w-xs h-auto object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </FormSection>
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </FormSection>

        <div>
          <RadioCard
            id="isShow"
            label="프로젝트 발행"
            name="is_publish"
            checked={watch('isShow')}
            onChange={e => setValue('isShow', e)}
          />
          <RadioCard
            id="is_hide"
            label="프로젝트 미발행"
            name="is_publish"
            checked={!watch('isShow')}
            onChange={e => setValue('isShow', !e)}
            className="mb-10"
          />
        </div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleSubmit(onSubmit)}
        >
          프로젝트 생성
        </button>
      </form>
    </>
  );
}
