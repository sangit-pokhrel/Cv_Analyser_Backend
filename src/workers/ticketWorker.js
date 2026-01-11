
// const ticketQueue = require("../queues/ticketQueue");
// const processTicketEmail = require("../processors/ticketEmail.processor");

// // LOW concurrency for Upstash
// ticketQueue.process(3, processTicketEmail);

// console.log("🎧 Ticket Worker started");



const processTicketEmail = require("../processors/ticketEmail.processor");

// Export the processor function, don't call queue.process here
module.exports = processTicketEmail;