/**
 * Typed flow data interfaces for cross-screen data passing.
 * flowData is used via setFlowData() and read via flowData.fieldName from useKiosk().
 * 
 * IMPORTANT: If you add a new field, document it here AND in CLAUDE.md.
 */

/** Payment flow data — set by ECI-03, EVT-02, LCO-01; read by PAY-02, PAY-03, LCO-02 */
export interface PaymentFlowData {
  /** Amount to charge, e.g. "$45.00" */
  payAmount?: string;
  /** Screen to navigate to after payment completes */
  payNextScreen?: string;
  /** Title shown on payment confirmation, e.g. "Early Check-in" */
  payTitle?: string;
}

/** Booking flow data — set during BKG screens */
export interface BookingFlowData {
  selectedRoom?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}

/** Combined flow data type — union of all flow interfaces */
export interface FlowData extends PaymentFlowData, BookingFlowData {
  /** Allow additional untyped fields for forward compatibility */
  [key: string]: unknown;
}
