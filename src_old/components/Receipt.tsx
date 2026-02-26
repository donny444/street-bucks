import { Order } from '../types';

interface ReceiptProps {
  order: Order;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
}

export function Receipt({ order, branchName, branchAddress, branchPhone }: ReceiptProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="receipt-container max-w-md mx-auto bg-white p-8 print:p-6">
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
        <h1 className="text-gray-900 mb-1">☕ CAFE POS</h1>
        <h2 className="text-gray-700">{branchName}</h2>
        <p className="text-gray-600 text-sm mt-2">{branchAddress}</p>
        <p className="text-gray-600 text-sm">Tel: {branchPhone}</p>
      </div>

      {/* Order Info */}
      <div className="space-y-1 text-sm mb-4 border-b border-dashed border-gray-300 pb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Order No:</span>
          <span className="text-gray-900">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="text-gray-900">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cashier:</span>
          <span className="text-gray-900">{order.employeeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment:</span>
          <span className="text-gray-900 uppercase">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4 border-b border-dashed border-gray-300 pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 text-gray-600">Item</th>
              <th className="text-center py-2 text-gray-600">Qty</th>
              <th className="text-right py-2 text-gray-600">Price</th>
              <th className="text-right py-2 text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 text-gray-900">{item.menuItemName}</td>
                <td className="text-center py-2 text-gray-900">{item.quantity}</td>
                <td className="text-right py-2 text-gray-900">฿{item.price.toFixed(2)}</td>
                <td className="text-right py-2 text-gray-900">฿{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900">฿{order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount:</span>
            <span>-฿{order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7%):</span>
          <span className="text-gray-900">฿{order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t-2 border-gray-800">
          <span className="text-gray-900">TOTAL:</span>
          <span className="text-gray-900">฿{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-dashed border-gray-300 pt-4">
        <p className="text-gray-600 text-sm mb-2">Thank you for your visit!</p>
        <p className="text-gray-500 text-xs">กรุณาเก็บใบเสร็จไว้เป็นหลักฐาน</p>
        <p className="text-gray-500 text-xs mt-4">www.cafepos.com</p>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container,
          .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            font-size: 12px;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
