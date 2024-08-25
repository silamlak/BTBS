import React from 'react'
import { ResponsiveContainer } from 'recharts';

export const TotalSkeleton = () => {
 return (
   <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 w-full gap-4 mt-4">
     {Array.from({ length: 4 }).map((_, index) => (
       <div
         key={index}
         className="flex w-full justify-between gap-2 items-end shadow-md bg-slate-50 dark:bg-slate-900 p-6 rounded-xl animate-pulse"
       >
         <div className="flex flex-col justify-start">
           <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full w-fit h-6"></div>
           <div className="bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded mt-8"></div>
           <div className="bg-gray-200 dark:bg-gray-700 h-6 w-22 rounded mt-1"></div>
         </div>
         <div className="flex gap-1 text-green-500">
           <div className="bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded"></div>
           <div className="bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded"></div>
         </div>
       </div>
     ))}
   </div>
 );
}

export const TotalError = ({error}) => {
 return (
   <div className="w-full mt-4 p-4 bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 rounded-lg shadow-md">
     <p className='text-sm 2xl:text-md'>{error?.data || "An unexpected error occurred."}</p>
   </div>
 );
}

export const TableSkeleton = () => {
 return (
   <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md mt-4 max-xl:mt-0">
     <div className="border-b">
       <h1 className="p-6 text-xl font-semibold text-slate-800 dark:text-slate-100">
         User Spending Table
       </h1>
     </div>
     <div className="mx-6 py-3">
       <table className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
         <thead className="bg-slate-100 dark:bg-slate-800">
           <tr className="uppercase text-slate-800 dark:text-slate-100 text-sm">
             <th className="py-2 text-start px-4 border-b">
               <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded"></div>
             </th>
             <th className="py-2 text-start px-4 border-b">
               <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded"></div>
             </th>
             <th className="py-2 text-start px-4 border-b">
               <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded"></div>
             </th>
             <th className="py-2 max-sm:hidden text-start px-4 border-b">
               <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded"></div>
             </th>
           </tr>
         </thead>
         <tbody>
           {Array.from({ length: 5 }).map((_, index) => (
             <tr
               key={index}
               className="text-slate-800 text-sm dark:text-slate-100"
             >
               <td className="py-3 px-4 border-b">
                 <div className="bg-gray-300 dark:bg-gray-600 h-4 w-full rounded"></div>
               </td>
               <td className="py-3 px-4 border-b">
                 <div className="bg-gray-300 dark:bg-gray-600 h-4 w-full rounded"></div>
               </td>
               <td className="py-3 px-4 border-b">
                 <div className="bg-gray-300 dark:bg-gray-600 h-4 w-full rounded"></div>
               </td>
               <td className="py-3 max-sm:hidden px-4 border-b">
                 <div className="bg-gray-300 dark:bg-gray-600 h-4 w-full rounded"></div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
}

export const TableError = ({error}) => {
 return (
   <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md mt-4 max-xl:mt-0 overflow-hidden p-6">
     <div className="border-b">
       <h1 className="p-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
         User Spending Table
       </h1>
     </div>
     <div className="w-full p-6 text-red-600 dark:text-red-600 rounded-lg">
       <p className="text-sm 2xl:text-md">
         {error?.data || "An unexpected error occurred."}
       </p>
     </div>
   </div>
 );
}

export const ChartSkeleton = () => {
 return (
   <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md max-md:ml-0 max-md:mt-4">
     <h1 className="text-xl max-sm:text-lg mb-2 font-semibold text-slate-800 dark:text-slate-100">
       Revenue and Sales History
     </h1>
     <ResponsiveContainer width="100%" height={350}>
       <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
         <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
       </div>
     </ResponsiveContainer>
   </div>
 );
}

export const ChartError = ({error}) => {
 return (
   <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md max-md:ml-0 max-md:mt-4">
     <h1 className="text-xl max-sm:text-lg mb-2 font-semibold text-slate-800 dark:text-slate-100">
       Revenue and Sales History
     </h1>
     <ResponsiveContainer width="100%" height={350}>
       <div className="w-full p-4 text-red-600 dark:text-red-600 rounded-lg">
         <p className="text-sm 2xl:text-md">
           {error?.data || "An unexpected error occurred."}
         </p>
       </div>
     </ResponsiveContainer>
   </div>
 );
}
