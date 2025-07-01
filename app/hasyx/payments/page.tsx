/*😈{"symbol":"🟢","name":"page-payments","required":["components-payments"],"available":["payment-ui","billing-dashboard"]}*/

import sidebar from "@/app/sidebar";
import Payments from "hasyx/components/payments";

export default function PaymentsPage() {
  return (
    <Payments sidebarData={sidebar} />
  );
} 