// app/api/send-receipt/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { receipt } = body;

    if (!receipt || !receipt.customerEmail) {
      return NextResponse.json(
        { error: "Missing receipt or customerEmail" },
        { status: 400 }
      );
    }

    const html = buildReceiptHtml(receipt);
    const subject = `Order Confirmed — ${receipt.orderId}`;

    await sendMail({
      to: receipt.customerEmail,
      subject,
      html,
      text: `Order ${receipt.orderId} confirmed. Total: $${Number(
        receipt.total || 0
      ).toFixed(2)}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("send-receipt error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/** Build a simple responsive HTML email for the receipt. */
function buildReceiptHtml(receipt: any) {
  const itemsHtml = (receipt.items || [])
    .map(
      (item: any) => `
      <tr>
        <td style="padding:6px 0;">${escapeHtml(
          item.product?.name || "Item"
        )}</td>
        <td style="padding:6px 0; text-align:right;">x ${item.quantity}</td>
        <td style="padding:6px 0; text-align:right;">$${Number(
          item.subtotal || 0
        ).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#333;">
    <h2 style="color:#1f9d55;">Order Confirmed!</h2>
    <p>Hi ${escapeHtml(receipt.customerName || "")},</p>
    <p>Thanks for your order. Here are the details:</p>

    <p><strong>Order ID:</strong> ${escapeHtml(receipt.orderId || "")}<br/>
    <strong>Order Date:</strong> ${new Date(
      receipt.timestamp || Date.now()
    ).toLocaleString()}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left">Item</th>
          <th align="right">Qty</th>
          <th align="right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <p style="border-top:1px solid #eee; padding-top:12px; font-weight:bold;">
      Total: $${Number(receipt.total || 0).toFixed(2)}
    </p>

    <p>If you have any questions reply to this email.</p>

    <hr />
    <p style="font-size:12px;color:#666;">This is an automated email from ${escapeHtml(
      process.env.FROM_EMAIL || "no-reply"
    )}</p>
  </div>
  `;
}

function escapeHtml(str: string) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
