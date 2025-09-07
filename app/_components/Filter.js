'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFileter = searchParams.get('capacity') ?? 'all';

  function handleClick(filter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex border border-primary-800 ">
      <Button
        filter="all"
        handleClick={handleClick}
        activeFileter={activeFileter}
      >
        All cabins{' '}
      </Button>
      <Button
        filter="small"
        handleClick={handleClick}
        activeFileter={activeFileter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        handleClick={handleClick}
        activeFileter={activeFileter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        handleClick={handleClick}
        activeFileter={activeFileter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

export default Filter;

function Button({ children, filter, handleClick, activeFileter }) {
  const isActive = activeFileter === filter;

  return (
    <button
      className={`${
        isActive ? 'bg-primary-700 text-primary-50' : 'hover:bg-primary-700 '
      } px-5 py-2`}
      onClick={() => handleClick(filter)}
    >
      {children}{' '}
    </button>
  );
}
