'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "./page";
import { getProducts } from "@/api/productApi";
import { HiOutlinePlus } from "react-icons/hi";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import CustomerSubsStatus from "@/components/shared/CustomerSubsStatus";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCustomerTableData } from "@/store/slices/customerSlice";

export default function ProductsComponent() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [data, setData] = useState<Array<Product>>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const getList = async (page: number, search: string = '') => {
    const list = await getProducts(page, search);
    setCurrentPage(list?.data?.page || 1);
    setTotalPages(list?.data?.totalpages || 1);
    if (list?.data?.products) {
      setData(list.data.products)
    }
  }

  useEffect(() => {
    getList(1);
  }, [])

  const handleSearch = async (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    getList(1, value);
  };

  const openCustomer = (customerId: string) => {
    // router.push(`/customers/${customerId}`)
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="xl:w-[430px] relative">
          <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={handleSearch}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />
        </div>
        <Button size="sm" variant="primary" startIcon={<HiOutlinePlus color="#ffffff" />} onClick={() => openCustomer('new')}>
          Add Product
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[200px]"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[200px]"
                  >
                    Cost
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data?.map((product: Product, idx: number) => (
                  <TableRow key={idx} className="cursor-pointer hover:bg-gray-100">
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {product.price}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {product.cost}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            getList(page, search)
          }}
        />
      </div>
    </>
  )
}