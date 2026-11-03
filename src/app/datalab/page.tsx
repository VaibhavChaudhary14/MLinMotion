import { Suspense } from 'react';
import { MyDataLab } from '@/components/datalab/MyDataLab';

export default function DataLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense
        fallback={
          <div className="p-8 text-center font-mono text-xs text-[#5C544B] bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
            INITIALIZING SCIENTIFIC WORKBENCH...
          </div>
        }
      >
        <MyDataLab />
      </Suspense>
    </div>
  );
}
