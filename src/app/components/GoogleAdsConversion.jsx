"use client";

import { useEffect } from "react";
import { adsConversion } from "./GoogleTags";

/**
 * Auto-fires a Google Ads conversion when this component mounts.
 * Place it on a “thank you” page after a successful lead/purchase.
 *
 * <GoogleAdsConversion value={1990} currency="THB" transactionId={orderId}/>
 */
export default function GoogleAdsConversion({
  value,
  currency = "THB",
  transactionId
}) {
  useEffect(() => {
    adsConversion({
      value,
      currency,
      transaction_id: transactionId
    });
  }, [value, currency, transactionId]);

  return null;
}
