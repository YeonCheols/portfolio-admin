import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const addThousandsSeparator = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const numberToPercentage = (num: number) => `${num * 100}%`;

export const swapArrayElements = <T>(arr: T[], index1: number, index2: number): T[] => {
  const newArr = [...arr];
  [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];
  return newArr;
};
