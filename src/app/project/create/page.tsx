'use client';

import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProjectCreate() {
  const [slug, setSlug] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, error } = useSWR<{ data: { title: string; content: string; image: string } | null }>(
    shouldFetch ? `/api/project/slug?slug=${slug}` : null,
    fetcher,
  );
  const handleCheckDuplicate = () => {
    setShouldFetch(!!slug);
  };

  return (
    <>
      <form>
        <div className="mb-6">
          <label htmlFor="project_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            프로젝트명
          </label>
          <input
            type="text"
            id="project_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="프로젝트 이름을 입력해주세요"
            maxLength={12}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="프로젝트 고유 아이디입니다. 중복되지 않도록 입력해주세요"
            required
          />
          <Button
            variant="secondary"
            className="mt-2"
            size="sm"
            onClick={handleCheckDuplicate}
            type="button"
            disabled={shouldFetch}
          >
            중복 확인
          </Button>
          {data && (
            <>
              {!data?.data && <p className="mt-2 text-sm text-green-600">사용할 수 있는 slug입니다.</p>}
              {data?.data && <p className="mt-2 text-sm text-green-600">이미 사용 중인 slug입니다.</p>}
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  데이터를 가져오는 과정에서 오류가 발생했습니다. error : {error}
                </p>
              )}
            </>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="tech_stack" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            기술 스택
          </label>
          <input
            type="text"
            id="tech_stack"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="기술스택을 입력해주세요."
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm password
          </label>
          <input
            type="password"
            id="confirm_password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            I agree with the{' '}
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
              terms and conditions
            </a>
            .
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>
  );
}
