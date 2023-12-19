import { useForm } from 'react-hook-form';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

export interface SearchFormValues {
  query: string;
}

interface SearchFormProps {
  onSubmit: (values: SearchFormValues) => void;
}

export const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const { query } = useParams();
  const { handleSubmit, register, setValue, watch } = useForm<SearchFormValues>({
    defaultValues: {
      query,
    },
  });

  const queryValue = watch('query');

  const handleSearch = (values: SearchFormValues) => {
    if (values && values.query && values.query.trim() !== '') {
      onSubmit(values);
    }
  };

  const handleReset = () => {
    setValue('query', '');
  };

  return (
    <form className="relative flex w-full md:w-80" onSubmit={handleSubmit(handleSearch)}>
      <input
        type="text"
        id="query"
        className="rounded-none rounded-l-full block flex-1 min-w-0 w-full text-lg md:text-sm px-3 py-2 bg-neutral-300 placeholder-neutral-400 text-neutral-800 dark:bg-neutral-700 dark:placeholder-neutral-400 dark:text-neutral-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Find Shows"
        {...register('query')}
      />
      {queryValue && queryValue.length > 0 && (
        <button
          className="absolute top-0 right-10 h-full inline-flex items-center text-sm bg-transparent text-neutral-500 dark:text-neutral-400"
          type="button"
          aria-label="Clear"
          onClick={handleReset}
        >
          <IoCloseOutline className="h-4 w-4" />
        </button>
      )}
      <button
        className="inline-flex items-center pr-3 text-sm rounded-r-full bg-neutral-300 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
        aria-label="Search"
        type="submit"
      >
        <IoSearchOutline className="h-4 w-4" />
      </button>
    </form>
  );
};
