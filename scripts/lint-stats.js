#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  // ESLint 실행
  const result = execSync('npx next lint --format=compact', {
    encoding: 'utf8',
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // 결과 파싱
  const lines = result.split('\n');
  const lastLine = lines[lines.length - 1];

  // 문제 수 추출
  const match = lastLine.match(/(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/);

  if (match) {
    const [, total, errors, warnings] = match;
    // eslint-disable-next-line no-console
    console.info('📊 ESLint Statistics:');
    // eslint-disable-next-line no-console
    console.info(`   Total: ${total}`);
    // eslint-disable-next-line no-console
    console.info(`   Errors: ${errors}`);
    // eslint-disable-next-line no-console
    console.info(`   Warnings: ${warnings}`);

    // 색상 출력
    const errorColor = errors > 0 ? '\x1b[31m' : '\x1b[32m'; // 빨강 또는 초록
    const warningColor = warnings > 0 ? '\x1b[33m' : '\x1b[32m'; // 노랑 또는 초록
    const resetColor = '\x1b[0m';

    // eslint-disable-next-line no-console
    console.info(`\n${errorColor}Errors: ${errors}${resetColor}`);
    // eslint-disable-next-line no-console
    console.info(`${warningColor}Warnings: ${warnings}${resetColor}`);

    // 종료 코드 설정
    process.exit(errors > 0 ? 1 : 0);
  } else {
    // eslint-disable-next-line no-console
    console.info('✅ No ESLint problems found!');
    process.exit(0);
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Error running ESLint:', error.message);
  process.exit(1);
}
