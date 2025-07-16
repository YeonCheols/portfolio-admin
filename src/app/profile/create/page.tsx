'use client';

import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FormInput } from '@/components/ui/form/input';
import { FormSection } from '@/components/ui/form/section';
import { Tabs } from '@/components/ui/tab';
import { type AdminProfileCreateRequest } from '@/docs/api';
import { getFileUrl } from '@/lib/file/read';
import { uploadFile } from '@/lib/file/upload';
import { validateFileCommon } from '@/lib/file/validationFile';

export default function ProfileCreate() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminProfileCreateRequest>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      imageUrl: '',
      isActive: false,
    },
  });

  const [activeTab, setActiveTab] = useState<string>('url');

  const handleFileUpload = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    toast('파일 업로드 진행 중...');

    const file = e.currentTarget?.files?.[0];

    if (!file) {
      toast.error('파일을 선택하세요.');
      return;
    }
    if (!validateFileCommon(e)) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData, 'profile');

    if (result.error) {
      toast.error('업로드 실패: ' + result.error);
    } else {
      const { url } = await getFileUrl(result.data?.path as string);

      setValue('imageUrl', url);
      toast.success('업로드 성공!');
    }
  };

  const onSubmit = async (data: AdminProfileCreateRequest) => {
    toast('프로필 생성 진행 중...');

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        toast.success('프로필이 성공적으로 생성되었습니다.');
        router.push('/profile');
      } else {
        toast.error('프로필 생성 중 오류가 발생했습니다.');
      }
    } catch {
      toast.error('프로필 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <form>
        <FormSection>
          <FormInput
            id="name"
            name="프로필 이름"
            register={register}
            errors={errors}
            validation={{
              required: '프로필 이름은 필수입니다.',
              minLength: {
                value: 2,
                message: '프로필 이름은 2글자 이상이어야 합니다.',
              },
            }}
            className='"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'
            placeholder="프로필 이름을 입력해주세요"
            maxLength={12}
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
                      id="imageUrl"
                      name="이미지 URL"
                      register={register}
                      errors={errors}
                      placeholder="이미지 주소를 입력해주세요."
                      onChange={e => {
                        setValue('imageUrl', e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {watch('imageUrl') && (
                      <div className="mt-8">
                        <NextImage
                          src={watch('imageUrl') as string}
                          alt="Preview"
                          width={36}
                          height={36}
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
                      id="imageUrl"
                      name="이미지 파일"
                      register={register}
                      placeholder="이미지를 추가해주세요."
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {watch('imageUrl') && (
                      <div className="mt-8">
                        <NextImage
                          src={watch('imageUrl') as string}
                          alt="Preview"
                          width={36}
                          height={36}
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
            onTabChange={tabId => {
              setValue('imageUrl', '');
              setActiveTab(tabId);
            }}
          />
        </FormSection>

        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleSubmit(onSubmit)}
        >
          프로필 생성
        </button>
      </form>
    </>
  );
}
