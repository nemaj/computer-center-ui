import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { getProduct } from "@/api/productApi";
import { getTransactions } from "@/api/inventoryTransactionApi";
import { TbEdit } from "react-icons/tb";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { NumericFormat } from "react-number-format";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Button from "@/components/ui/button/Button";
import { LuCalendarCog } from "react-icons/lu";
import Badge from "@/components/ui/badge/Badge";
import { Product } from "@/app/(admin)/products/page";
import ProductFormModal from "./ProductFormModal";

type props = {
  productId: string,
  isOpen: boolean,
  closeModal: (refresh: boolean) => void
}

const ProductDetailsModal = (props: props) => {
  const { productId, isOpen, closeModal } = props;

  const [isNeedRefresh, setIsNeedRefresh] = useState<boolean>(false)
  const [details, setDetails] = useState<any>(null)
  const [transactions, setTransactions] = useState<any>(null)
  const [showFormModal, setShowFormModal] = useState<boolean>(false)

  const getDetails = async (productId: string) => {
    const { data } = await getProduct(productId);
    console.log(data, "<== Product Details")
    setDetails(data ?? null);
    const { data: transactions } = await getTransactions(productId);
    console.log(transactions, "<== Product transactions")
    setTransactions(transactions?.transactions || [])
  } 

  useEffect(() => {
    if (!productId) return;
    getDetails(productId)
  }, [productId])

  const handleClose = () => {
    closeModal?.(isNeedRefresh)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-visible">
          <div>
            <h5 className="mb-2 font-semibold flex items-center gap-[10px] text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Product Details
              <TbEdit className="cursor-pointer text-grey-600 hover:text-grey-800" data-tooltip-id="product-edit-tooltip" onClick={() => setShowFormModal(true)} />
            </h5>
            <ReactTooltip
              id="product-edit-tooltip"
              place="bottom"
              content="Edit Product Info"
            />
          </div>
          <div className="mt-8">
            <p className="text-lg mb-3">Name: <span className="font-semibold ml-2">{details?.name}</span> <span className="text-sm ml-2">({details?.sku})</span></p>
            <div className="grid gap-6 mb-3 md:grid-cols-2">
              <p className="text-lg">Price:
                <span className="font-semibold ml-2">
                  <NumericFormat
                    value={details?.price}
                    displayType="text"
                    prefix="₱ "
                    thousandSeparator=","
                  />
                </span>
              </p>
              <p className="text-lg">Status:
                <span className="font-semibold ml-2">
                  {details?.isActive ? 'ACTIVE' : 'NOT-ACTIVE'}
                </span>
              </p>
            </div>
            <p className="text-lg mb-3">Total Stock: <span className="font-semibold ml-2">{details?.totalStock}</span></p>

            {transactions?.length !== 0 ? (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-lg mb-0">Product Inventory:</p>
                  <div data-tooltip-id="manage-transaction-tooltip">
                    <Button size="sm" variant="outline">
                      <LuCalendarCog size={15} />
                    </Button>
                  </div>
                </div>
                <ReactTooltip
                  id="manage-transaction-tooltip"
                  place="left"
                  content="Manage Transaction"
                />
                
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                  <div className="max-w-full overflow-x-auto">
                    <div>
                      <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                          <TableRow>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Quantity
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Type
                            </TableCell>
                          </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {transactions?.map((_transaction: any) => (
                            <TableRow key={_transaction.id}>
                              <TableCell className="px-5 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                                {format(_transaction.date, 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {_transaction.quantity}
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                {_transaction.type === 'OUT' ? (
                                  <Badge variant="solid" color="error">
                                    Out
                                  </Badge>
                                ) : (
                                  <Badge variant="solid" color="success">
                                    In
                                  </Badge>
                                )}
                                
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center mt-6">
                <Button size="sm" variant="outline" startIcon={<LuCalendarCog size={15} />}>
                  Add Stock
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>
      
      {showFormModal && (
        <ProductFormModal
          product={details}
          isOpen={true}
          closeModal={(refresh: boolean) => {
            if (refresh) {
              setIsNeedRefresh(true);
              getDetails(productId);
            }
            setShowFormModal(false);
          }}
        />
      )}
    </>
  )
}

export default ProductDetailsModal;