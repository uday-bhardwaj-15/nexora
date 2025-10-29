// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface ReceiptModalProps {
//   receipt: any
//   onClose: () => void
// }

// export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-center text-green-600">Order Confirmed!</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="bg-green-50 p-4 rounded-md">
//             <p className="text-sm text-gray-600">Order ID</p>
//             <p className="font-bold text-lg">{receipt.orderId}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-600">Customer Name</p>
//             <p className="font-semibold">{receipt.customerName}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-600">Email</p>
//             <p className="font-semibold">{receipt.customerEmail}</p>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="font-semibold mb-2">Items</h3>
//             {receipt.items.map((item: any, index: number) => (
//               <div key={index} className="flex justify-between text-sm mb-1">
//                 <span>
//                   {item.product.name} x {item.quantity}
//                 </span>
//                 <span>${item.subtotal.toFixed(2)}</span>
//               </div>
//             ))}
//             <div className="border-t mt-2 pt-2 flex justify-between font-bold">
//               <span>Total:</span>
//               <span>${receipt.total.toFixed(2)}</span>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-600">Order Date</p>
//             <p className="font-semibold">{new Date(receipt.timestamp).toLocaleString()}</p>
//           </div>

//           <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
//             Continue Shopping
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
// components/ReceiptModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReceiptModalProps {
  receipt: any;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // send email when modal opens (receipt exists)
    if (!receipt || !receipt.customerEmail) return;

    let cancelled = false;
    async function sendEmail() {
      try {
        setSending(true);
        setError(null);

        const res = await fetch("/api/send-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipt }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.error || `Server responded ${res.status}`);
        }

        if (!cancelled) {
          setSent(true);
        }
      } catch (err: any) {
        console.error("email send failed", err);
        if (!cancelled) setError(err.message || "Failed to send email");
      } finally {
        if (!cancelled) setSending(false);
      }
    }

    sendEmail();
    return () => {
      cancelled = true;
    };
  }, [receipt]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Order Confirmed!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-bold text-lg">{receipt?.orderId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Customer Name</p>
            <p className="font-semibold">{receipt?.customerName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{receipt?.customerEmail}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Items</h3>
            {Array.isArray(receipt?.items) && receipt.items.length ? (
              receipt.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>
                    {item.product?.name} x {item.quantity}
                  </span>
                  <span>${Number(item.subtotal || 0).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No items</div>
            )}

            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>${Number(receipt?.total || 0).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">
              {new Date(receipt?.timestamp || Date.now()).toLocaleString()}
            </p>
          </div>

          {/* Status area: loader / success / error */}
          <div className="mt-2">
            {sending ? (
              <div className="flex items-center gap-2 text-sm">
                <Spinner />{" "}
                <span>
                  Sending confirmation email to {receipt?.customerEmail}…
                </span>
              </div>
            ) : sent ? (
              <div className="text-sm text-green-700">
                A confirmation mail has been sent to {receipt?.customerEmail}.
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">
                Failed to send confirmation email: {error}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Preparing confirmation email...
              </div>
            )}
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={sending} // prevent closing while sending if you want
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/** Simple spinner component — feel free to replace with your UI spinner */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
