// import { Component, Input } from '@angular/core';
// import { RazorpayService } from '../razorpay.service';

// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
// })
// export class PaymentComponent {

//   @Input() eventId!: number;      // dynamically passed from parent component
//   @Input() attendeeId!: number;   // dynamically passed
//   @Input() seatsToBook!: number;  // dynamically passed

//   constructor(private razorpayService: RazorpayService) {}

//   payNow() {
//     if (!this.eventId || !this.attendeeId || !this.seatsToBook) {
//       alert('Event, Attendee, or Seats not set!');
//       return;
//     }

//     // Step 1: Create order on backend dynamically
//     this.razorpayService.createOrder(this.eventId, this.attendeeId, this.seatsToBook)
//       .subscribe((orderResp: any) => {
//         const order = orderResp.order;

//         // Step 2: Open Razorpay Checkout
//         const options: any = {
//           key: 'PROCESS.env.RAZORPAY_KEY_ID', // replace with your Razorpay Key
//           amount: order.amount,
//           currency: order.currency,
//           name: 'Event Ticket',
//           description: 'Offline Event Ticket',
//           order_id: order.id,
//           handler: (response: any) => {
//             // Step 3: Send payment details to backend
//             const verifyData = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               event_id: this.eventId,
//               attendee_id: this.attendeeId,
//               seats_to_book: this.seatsToBook
//             };

//             this.razorpayService.verifyPayment(verifyData)
//               .subscribe(res => {
//                 alert('Payment successful and seats booked!');
//                 console.log('Verification response:', res);
//               }, err => {
//                 alert('Payment verification failed!');
//                 console.error('Verification error:', err);
//               });
//           },
//           prefill: {
//             name: '',   // you can fetch attendee name dynamically
//             email: '',  // fetch dynamically
//             contact: '' // fetch dynamically
//           },
//           theme: { color: '#F37254' }
//         };

//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();

//       }, err => {
//         alert('Failed to create order');
//         console.error('Create order error:', err);
//       });
//   }
// }