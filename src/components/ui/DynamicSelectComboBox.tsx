/* eslint-disable */
'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface ComboBoxItem {
  id: string;
  name: string;
}

interface DynamicSelectComboBoxProps {
  label?: string;
  data: ComboBoxItem[];
  onSelect: (item: ComboBoxItem | null) => void;
  placeholder?: string;
  className?: string;
}

export default function DynamicSelectComboBox({
  label = 'Pilih Item',
  data,
  onSelect,
  placeholder = 'Ketik untuk mencari... ',
  className,
}: DynamicSelectComboBoxProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ComboBoxItem | null>(null);

  const filteredData =
    query === ''
      ? data
      : data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (item: ComboBoxItem) => {
    setSelected(item);
    onSelect(item);
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )} */}

      <Combobox value={selected} onChange={handleSelect}>
        <div className="relative w-full">
          <ComboboxInput
            className={clsx(
              'w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            )}
            displayValue={(item: ComboBoxItem) => item?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 px-2.5 flex items-center">
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </ComboboxButton>
        </div>

        <div className='relative w-full'>
          <ComboboxOptions className="absolute z-10 mt-1  w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
          {filteredData.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">Tidak ditemukan</div>
          ) : (
            filteredData.map((item) => (
              <ComboboxOption
                key={item.id}
                value={item}
                className={({ active, selected }) =>
                  clsx(
                    'relative cursor-pointer select-none px-4 py-2',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <span
                    className={clsx(
                      'flex items-center gap-2',
                      selected && 'font-semibold'
                    )}
                  >
                    {selected && <CheckIcon className="w-4 h-4" />}
                    {item.name}
                  </span>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
}
