// const nodemailer = require('nodemailer');

// // Create transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT, 10),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Email transporter error:', error);
//   } else {
//     console.log('✅ Email server is ready to send messages');
//   }
// });

// /**
//  * Send email helper
//  */
// async function sendEmail({ to, subject, html, text }) {
//   try {
//     const info = await transporter.sendMail({
//       from: `"CvSync Support" <${process.env.EMAIL_FROM}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log(`📧 Email sent to ${to}: ${info.messageId}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error(`❌ Email send error to ${to}:`, error.message);
//     return { success: false, error: error.message };
//   }
// }

// /**
//  * Email Templates
//  */

// // 1. Ticket Created - User Confirmation
// function ticketCreatedUserEmail(ticket, user) {
//   return {
//     to: user.email,
//     subject: `Ticket Created: ${ticket.ticketNumber} - ${ticket.subject}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2563eb;">Support Ticket Created</h2>
//         <p>Hi ${user.firstName || 'there'},</p>
//         <p>Your support ticket has been created successfully. Our team will review it shortly.</p>
        
//         <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
//           <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
//           <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: capitalize;">${ticket.priority}</span></p>
//           <p style="margin: 5px 0;"><strong>Status:</strong> <span style="text-transform: capitalize;">${ticket.status.replace('_', ' ')}</span></p>
//           <p style="margin: 5px 0;"><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
//         </div>
        
//         <p><strong>Your message:</strong></p>
//         <p style="background: #ffffff; padding: 15px; border-left: 4px solid #2563eb;">${ticket.description}</p>
        
//         <p>We'll notify you as soon as an agent is assigned to your ticket.</p>
        
//         <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
//           You can view your ticket status at any time by logging into your account.
//         </p>
        
//         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//         <p style="color: #6b7280; font-size: 12px;">
//           CvSync Support Team<br>
//           This is an automated message, please do not reply directly to this email.
//         </p>
//       </div>
//     `,
//     text: `Support Ticket Created\n\nHi ${user.firstName || 'there'},\n\nYour support ticket has been created.\n\nTicket: ${ticket.ticketNumber}\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}\n\nYour message: ${ticket.description}\n\nWe'll notify you when an agent is assigned.`
//   };
// }

// // 2. Ticket Created - Agent Notification
// function ticketCreatedAgentEmail(ticket, user, agent) {
//   return {
//     to: agent.email,
//     subject: `New Support Ticket: ${ticket.ticketNumber} - ${ticket.subject}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #dc2626;">🎫 New Support Ticket</h2>
//         <p>Hi ${agent.firstName},</p>
//         <p>A new support ticket requires your attention.</p>
        
//         <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
//           <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
//           <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
//           <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${ticket.priority === 'urgent' ? '#dc2626' : ticket.priority === 'high' ? '#ea580c' : '#2563eb'};">${ticket.priority}</span></p>
//           <p style="margin: 5px 0;"><strong>Category:</strong> ${ticket.category}</p>
//           <p style="margin: 5px 0;"><strong>From:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
//           <p style="margin: 5px 0;"><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
//         </div>
        
//         <p><strong>Customer message:</strong></p>
//         <p style="background: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">${ticket.description}</p>
        
//         <div style="margin: 30px 0; text-align: center;">
//           <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}?action=accept" 
//              style="display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">
//             ✅ Accept Ticket
//           </a>
//           <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}?action=decline" 
//              style="display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">
//             ❌ Decline
//           </a>
//         </div>
        
//         <p style="color: #6b7280; font-size: 14px;">
//           Click "Accept" to be assigned as the primary agent for this ticket.
//         </p>
        
//         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//         <p style="color: #6b7280; font-size: 12px;">
//           CvSync Support Team
//         </p>
//       </div>
//     `,
//     text: `New Support Ticket: ${ticket.ticketNumber}\n\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}\nFrom: ${user.email}\n\n${ticket.description}\n\nLog in to accept or decline this ticket.`
//   };
// }

// // 3. Agent Accepted Ticket - User Notification
// function agentAcceptedEmail(ticket, user, agent) {
//   return {
//     to: user.email,
//     subject: `Agent Assigned: ${ticket.ticketNumber} - ${agent.firstName} is now helping you`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #16a34a;">✅ Agent Assigned to Your Ticket</h2>
//         <p>Hi ${user.firstName || 'there'},</p>
//         <p>Good news! An agent has been assigned to your support ticket.</p>
        
//         <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
//           <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
//           <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
//           <p style="margin: 5px 0;"><strong>Assigned Agent:</strong> ${agent.firstName} ${agent.lastName}</p>
//           <p style="margin: 5px 0;"><strong>Status:</strong> In Progress</p>
//         </div>
        
//         <p>${agent.firstName} will review your ticket and respond shortly. You'll receive an email notification when they reply.</p>
        
//         <div style="margin: 30px 0; text-align: center;">
//           <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
//              style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
//             View Ticket
//           </a>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//         <p style="color: #6b7280; font-size: 12px;">
//           CvSync Support Team
//         </p>
//       </div>
//     `,
//     text: `Agent Assigned!\n\nTicket: ${ticket.ticketNumber}\nAgent: ${agent.firstName} ${agent.lastName}\n\n${agent.firstName} will respond to your ticket shortly.`
//   };
// }

// // 4. New Message - Notification
// function newMessageEmail(ticket, message, recipient, sender) {
//   const isUserRecipient = recipient.role === 'job_seeker' || recipient.role === 'employer';
  
//   return {
//     to: recipient.email,
//     subject: `New Reply: ${ticket.ticketNumber} - ${ticket.subject}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2563eb;">💬 New Message on Your Ticket</h2>
//         <p>Hi ${recipient.firstName},</p>
//         <p>${isUserRecipient ? 'An agent' : 'The customer'} has replied to ticket <strong>${ticket.ticketNumber}</strong>.</p>
        
//         <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
//             <strong>${sender.firstName} ${sender.lastName}</strong> • ${new Date(message.createdAt).toLocaleString()}
//           </p>
//           <p style="margin: 15px 0; background: white; padding: 15px; border-radius: 4px;">${message.message}</p>
//         </div>
        
//         ${message.attachments && message.attachments.length > 0 ? `
//           <p><strong>Attachments:</strong></p>
//           <ul>
//             ${message.attachments.map(att => `<li><a href="${att.url}">${att.filename}</a></li>`).join('')}
//           </ul>
//         ` : ''}
        
//         <div style="margin: 30px 0; text-align: center;">
//           <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
//              style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
//             Reply to Message
//           </a>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//         <p style="color: #6b7280; font-size: 12px;">
//           CvSync Support Team
//         </p>
//       </div>
//     `,
//     text: `New message on ticket ${ticket.ticketNumber}\n\nFrom: ${sender.firstName} ${sender.lastName}\n\n${message.message}`
//   };
// }

// // 5. Ticket Resolved - User Notification
// function ticketResolvedEmail(ticket, user) {
//   return {
//     to: user.email,
//     subject: `Ticket Resolved: ${ticket.ticketNumber} - ${ticket.subject}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #16a34a;">✅ Your Ticket Has Been Resolved</h2>
//         <p>Hi ${user.firstName || 'there'},</p>
//         <p>Your support ticket has been marked as resolved.</p>
        
//         <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
//           <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
//           <p style="margin: 5px 0;"><strong>Resolved:</strong> ${new Date(ticket.resolvedAt).toLocaleString()}</p>
//         </div>
        
//         <p><strong>How was your experience?</strong></p>
//         <p>We'd love to hear your feedback. Please rate your support experience:</p>
        
//         <div style="margin: 20px 0; text-align: center;">
//           ${[5, 4, 3, 2, 1].map(rating => `
//             <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}/rate?rating=${rating}" 
//                style="display: inline-block; padding: 10px 15px; margin: 5px; background: #fbbf24; color: white; text-decoration: none; border-radius: 4px; font-size: 20px;">
//               ${'⭐'.repeat(rating)}
//             </a>
//           `).join('')}
//         </div>
        
//         <p>If your issue is not fully resolved, you can reopen this ticket at any time.</p>
        
//         <div style="margin: 30px 0; text-align: center;">
//           <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
//              style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
//             View Ticket
//           </a>
//         </div>
        
//         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//         <p style="color: #6b7280; font-size: 12px;">
//           CvSync Support Team
//         </p>
//       </div>
//     `,
//     text: `Your ticket ${ticket.ticketNumber} has been resolved.\n\nPlease rate your experience by visiting your ticket page.`
//   };
// }


// /**
//  * Generate plain text email if template not found
//  */
// function generatePlainTextEmail(template, data) {
//   const templates = {
//     'interview-request': `
//       <h2>Interview Assessment Invitation</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>You've been invited to complete an interview assessment by ${data.coachName}.</p>
//       <p><strong>Title:</strong> ${data.title}</p>
//       <p><strong>Type:</strong> ${data.assessmentType}</p>
//       <p><strong>Time Limit:</strong> ${data.timeLimit} minutes</p>
//       <p><strong>Questions:</strong> ${data.questionCount}</p>
//       <p>
//         <a href="${data.link}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
//           Start Assessment
//         </a>
//       </p>
//       <p><strong>⚠️ Important:</strong> This link can only be opened once and expires on ${data.expiryDate}</p>
//       <p>Good luck!<br>CV Saathi Team</p>
//     `,
    
//     'assessment-approved': `
//       <h2>Assessment Approved! 🎉</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>Great news! ${data.coachName} has reviewed your assessment and approved it.</p>
//       <p><strong>Your Score:</strong> ${data.score}%</p>
//       ${data.mcqScore ? `<p><strong>MCQ Score:</strong> ${data.mcqScore}%</p>` : ''}
//       <p><strong>Feedback:</strong> ${data.feedback}</p>
//       <p>Your coach will contact you soon to schedule a video interview.</p>
//       <p>Best regards,<br>CV Saathi Team</p>
//     `,
    
//     'assessment-rejected': `
//       <h2>Assessment Result</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>${data.coachName} has reviewed your assessment.</p>
//       <p><strong>Your Score:</strong> ${data.score}%</p>
//       ${data.mcqScore ? `<p><strong>MCQ Score:</strong> ${data.mcqScore}%</p>` : ''}
//       <p><strong>Feedback:</strong> ${data.feedback}</p>
//       <p>Keep improving and don't give up!</p>
//       <p>Best regards,<br>CV Saathi Team</p>
//     `,
    
//     'interview-scheduled': `
//       <h2>Video Interview Scheduled 📹</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>${data.coachName} has scheduled a video interview with you!</p>
//       <p><strong>Date:</strong> ${data.date}</p>
//       <p><strong>Time:</strong> ${data.time}</p>
//       <p><strong>Duration:</strong> ${data.duration} minutes</p>
//       ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
//       <p>
//         <a href="${data.meetingLink}" style="display:inline-block;background:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
//           Join Video Call
//         </a>
//       </p>
//       <p>You'll receive a reminder 1 day and 1 hour before the interview.</p>
//       <p>Best regards,<br>CV Saathi Team</p>
//     `,
    
//     'interview-cancelled': `
//       <h2>Interview Cancelled</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>${data.coachName} has cancelled your scheduled interview.</p>
//       ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
//       <p>Your coach will contact you for rescheduling if needed.</p>
//       <p>Best regards,<br>CV Saathi Team</p>
//     `,
    
//     'new-assignment': `
//       <h2>New Assignment: ${data.title}</h2>
//       <p>Hi ${data.studentName},</p>
//       <p>${data.coachName} has assigned you a new task!</p>
//       <p><strong>Title:</strong> ${data.title}</p>
//       <p><strong>Description:</strong> ${data.description}</p>
//       <p><strong>Due Date:</strong> ${data.dueDate}</p>
//       <p><strong>Points:</strong> ${data.points}</p>
//       <p>
//         <a href="${data.link}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
//           View Assignment
//         </a>
//       </p>
//       <p>Good luck!<br>CV Saathi Team</p>
//     `
//   };
  
//   return templates[template] || `<p>${JSON.stringify(data)}</p>`;
// }

// /**
//  * Send interview request email
//  */
// async function sendInterviewRequestEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: `Interview Assessment - ${data.title}`,
//     template: 'interview-request',
//     data
//   });
// }

// /**
//  * Send assessment approval email
//  */
// async function sendAssessmentApprovedEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: 'Assessment Approved! 🎉',
//     template: 'assessment-approved',
//     data
//   });
// }

// /**
//  * Send assessment rejection email
//  */
// async function sendAssessmentRejectedEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: 'Assessment Result',
//     template: 'assessment-rejected',
//     data
//   });
// }

// /**
//  * Send interview scheduled email
//  */
// async function sendInterviewScheduledEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: 'Video Interview Scheduled 📹',
//     template: 'interview-scheduled',
//     data
//   });
// }

// /**
//  * Send interview cancelled email
//  */
// async function sendInterviewCancelledEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: 'Interview Cancelled',
//     template: 'interview-cancelled',
//     data
//   });
// }

// /**
//  * Send new assignment email
//  */
// async function sendNewAssignmentEmail(to, data) {
//   return sendEmail({
//     to,
//     subject: `New Assignment: ${data.title}`,
//     template: 'new-assignment',
//     data
//   });
// }

// /**
//  * Send interview reminder (24h or 1h before)
//  */
// async function sendInterviewReminderEmail(to, data, hoursBefore) {
//   const subject = hoursBefore === 24 
//     ? 'Interview Tomorrow - Reminder'
//     : 'Interview in 1 Hour - Reminder';
    
//   return sendEmail({
//     to,
//     subject,
//     template: 'interview-reminder',
//     data: { ...data, hoursBefore }
//   });
// }
// module.exports = {
//   sendEmail,
//   ticketCreatedUserEmail,
//   ticketCreatedAgentEmail,
//   agentAcceptedEmail,
//   newMessageEmail,
//   ticketResolvedEmail,
//   sendInterviewRequestEmail,
//   sendAssessmentApprovedEmail,
//   sendAssessmentRejectedEmail,
//   sendInterviewScheduledEmail,
//   sendInterviewCancelledEmail,
//   sendNewAssignmentEmail,
//   sendInterviewReminderEmail
// };



const nodemailer = require('nodemailer');

let transporter = null;
let emailAvailable = false;

// Only create transporter if SMTP credentials exist
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Add timeout to prevent hanging
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // Verify connection but don't block startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('⚠️ Email transporter error:', error.message);
      console.log('ℹ️ Email notifications disabled - server will continue without email');
      emailAvailable = false;
    } else {
      console.log('✅ Email server is ready to send messages');
      emailAvailable = true;
    }
  });
} else {
  console.log('ℹ️ SMTP not configured - email notifications disabled');
}

/**
 * Send email helper
 */
async function sendEmail({ to, subject, html, text }) {
  // If email is not available, log and return success (don't block functionality)
  if (!transporter || !emailAvailable) {
    console.log(`⚠️ Email not sent (SMTP unavailable) - to: ${to}, subject: ${subject}`);
    return { success: false, error: 'Email service unavailable', skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"CvSync Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Email Templates
 */

// 1. Ticket Created - User Confirmation
function ticketCreatedUserEmail(ticket, user) {
  return {
    to: user.email,
    subject: `Ticket Created: ${ticket.ticketNumber} - ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Support Ticket Created</h2>
        <p>Hi ${user.firstName || 'there'},</p>
        <p>Your support ticket has been created successfully. Our team will review it shortly.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: capitalize;">${ticket.priority}</span></p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="text-transform: capitalize;">${ticket.status.replace('_', ' ')}</span></p>
          <p style="margin: 5px 0;"><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        
        <p><strong>Your message:</strong></p>
        <p style="background: #ffffff; padding: 15px; border-left: 4px solid #2563eb;">${ticket.description}</p>
        
        <p>We'll notify you as soon as an agent is assigned to your ticket.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          You can view your ticket status at any time by logging into your account.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          CvSync Support Team<br>
          This is an automated message, please do not reply directly to this email.
        </p>
      </div>
    `,
    text: `Support Ticket Created\n\nHi ${user.firstName || 'there'},\n\nYour support ticket has been created.\n\nTicket: ${ticket.ticketNumber}\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}\n\nYour message: ${ticket.description}\n\nWe'll notify you when an agent is assigned.`
  };
}

// 2. Ticket Created - Agent Notification
function ticketCreatedAgentEmail(ticket, user, agent) {
  return {
    to: agent.email,
    subject: `New Support Ticket: ${ticket.ticketNumber} - ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🎫 New Support Ticket</h2>
        <p>Hi ${agent.firstName},</p>
        <p>A new support ticket requires your attention.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${ticket.priority === 'urgent' ? '#dc2626' : ticket.priority === 'high' ? '#ea580c' : '#2563eb'};">${ticket.priority}</span></p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${ticket.category}</p>
          <p style="margin: 5px 0;"><strong>From:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p style="margin: 5px 0;"><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        
        <p><strong>Customer message:</strong></p>
        <p style="background: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">${ticket.description}</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}?action=accept" 
             style="display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">
            ✅ Accept Ticket
          </a>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}?action=decline" 
             style="display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">
            ❌ Decline
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Click "Accept" to be assigned as the primary agent for this ticket.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          CvSync Support Team
        </p>
      </div>
    `,
    text: `New Support Ticket: ${ticket.ticketNumber}\n\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}\nFrom: ${user.email}\n\n${ticket.description}\n\nLog in to accept or decline this ticket.`
  };
}

// 3. Agent Accepted Ticket - User Notification
function agentAcceptedEmail(ticket, user, agent) {
  return {
    to: user.email,
    subject: `Agent Assigned: ${ticket.ticketNumber} - ${agent.firstName} is now helping you`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">✅ Agent Assigned to Your Ticket</h2>
        <p>Hi ${user.firstName || 'there'},</p>
        <p>Good news! An agent has been assigned to your support ticket.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 5px 0;"><strong>Assigned Agent:</strong> ${agent.firstName} ${agent.lastName}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> In Progress</p>
        </div>
        
        <p>${agent.firstName} will review your ticket and respond shortly. You'll receive an email notification when they reply.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
             style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Ticket
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          CvSync Support Team
        </p>
      </div>
    `,
    text: `Agent Assigned!\n\nTicket: ${ticket.ticketNumber}\nAgent: ${agent.firstName} ${agent.lastName}\n\n${agent.firstName} will respond to your ticket shortly.`
  };
}

// 4. New Message - Notification
function newMessageEmail(ticket, message, recipient, sender) {
  const isUserRecipient = recipient.role === 'job_seeker' || recipient.role === 'employer';
  
  return {
    to: recipient.email,
    subject: `New Reply: ${ticket.ticketNumber} - ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">💬 New Message on Your Ticket</h2>
        <p>Hi ${recipient.firstName},</p>
        <p>${isUserRecipient ? 'An agent' : 'The customer'} has replied to ticket <strong>${ticket.ticketNumber}</strong>.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
            <strong>${sender.firstName} ${sender.lastName}</strong> • ${new Date(message.createdAt).toLocaleString()}
          </p>
          <p style="margin: 15px 0; background: white; padding: 15px; border-radius: 4px;">${message.message}</p>
        </div>
        
        ${message.attachments && message.attachments.length > 0 ? `
          <p><strong>Attachments:</strong></p>
          <ul>
            ${message.attachments.map(att => `<li><a href="${att.url}">${att.filename}</a></li>`).join('')}
          </ul>
        ` : ''}
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
             style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reply to Message
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          CvSync Support Team
        </p>
      </div>
    `,
    text: `New message on ticket ${ticket.ticketNumber}\n\nFrom: ${sender.firstName} ${sender.lastName}\n\n${message.message}`
  };
}

// 5. Ticket Resolved - User Notification
function ticketResolvedEmail(ticket, user) {
  return {
    to: user.email,
    subject: `Ticket Resolved: ${ticket.ticketNumber} - ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">✅ Your Ticket Has Been Resolved</h2>
        <p>Hi ${user.firstName || 'there'},</p>
        <p>Your support ticket has been marked as resolved.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Ticket:</strong> ${ticket.ticketNumber}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${ticket.subject}</p>
          <p style="margin: 5px 0;"><strong>Resolved:</strong> ${new Date(ticket.resolvedAt).toLocaleString()}</p>
        </div>
        
        <p><strong>How was your experience?</strong></p>
        <p>We'd love to hear your feedback. Please rate your support experience:</p>
        
        <div style="margin: 20px 0; text-align: center;">
          ${[5, 4, 3, 2, 1].map(rating => `
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}/rate?rating=${rating}" 
               style="display: inline-block; padding: 10px 15px; margin: 5px; background: #fbbf24; color: white; text-decoration: none; border-radius: 4px; font-size: 20px;">
              ${'⭐'.repeat(rating)}
            </a>
          `).join('')}
        </div>
        
        <p>If your issue is not fully resolved, you can reopen this ticket at any time.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/tickets/${ticket._id}" 
             style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Ticket
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          CvSync Support Team
        </p>
      </div>
    `,
    text: `Your ticket ${ticket.ticketNumber} has been resolved.\n\nPlease rate your experience by visiting your ticket page.`
  };
}


/**
 * Generate plain text email if template not found
 */
function generatePlainTextEmail(template, data) {
  const templates = {
    'interview-request': `
      <h2>Interview Assessment Invitation</h2>
      <p>Hi ${data.studentName},</p>
      <p>You've been invited to complete an interview assessment by ${data.coachName}.</p>
      <p><strong>Title:</strong> ${data.title}</p>
      <p><strong>Type:</strong> ${data.assessmentType}</p>
      <p><strong>Time Limit:</strong> ${data.timeLimit} minutes</p>
      <p><strong>Questions:</strong> ${data.questionCount}</p>
      <p>
        <a href="${data.link}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
          Start Assessment
        </a>
      </p>
      <p><strong>⚠️ Important:</strong> This link can only be opened once and expires on ${data.expiryDate}</p>
      <p>Good luck!<br>CV Saathi Team</p>
    `,
    
    'assessment-approved': `
      <h2>Assessment Approved! 🎉</h2>
      <p>Hi ${data.studentName},</p>
      <p>Great news! ${data.coachName} has reviewed your assessment and approved it.</p>
      <p><strong>Your Score:</strong> ${data.score}%</p>
      ${data.mcqScore ? `<p><strong>MCQ Score:</strong> ${data.mcqScore}%</p>` : ''}
      <p><strong>Feedback:</strong> ${data.feedback}</p>
      <p>Your coach will contact you soon to schedule a video interview.</p>
      <p>Best regards,<br>CV Saathi Team</p>
    `,
    
    'assessment-rejected': `
      <h2>Assessment Result</h2>
      <p>Hi ${data.studentName},</p>
      <p>${data.coachName} has reviewed your assessment.</p>
      <p><strong>Your Score:</strong> ${data.score}%</p>
      ${data.mcqScore ? `<p><strong>MCQ Score:</strong> ${data.mcqScore}%</p>` : ''}
      <p><strong>Feedback:</strong> ${data.feedback}</p>
      <p>Keep improving and don't give up!</p>
      <p>Best regards,<br>CV Saathi Team</p>
    `,
    
    'interview-scheduled': `
      <h2>Video Interview Scheduled 📹</h2>
      <p>Hi ${data.studentName},</p>
      <p>${data.coachName} has scheduled a video interview with you!</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Duration:</strong> ${data.duration} minutes</p>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      <p>
        <a href="${data.meetingLink}" style="display:inline-block;background:#10B981;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
          Join Video Call
        </a>
      </p>
      <p>You'll receive a reminder 1 day and 1 hour before the interview.</p>
      <p>Best regards,<br>CV Saathi Team</p>
    `,
    
    'interview-cancelled': `
      <h2>Interview Cancelled</h2>
      <p>Hi ${data.studentName},</p>
      <p>${data.coachName} has cancelled your scheduled interview.</p>
      ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
      <p>Your coach will contact you for rescheduling if needed.</p>
      <p>Best regards,<br>CV Saathi Team</p>
    `,
    
    'new-assignment': `
      <h2>New Assignment: ${data.title}</h2>
      <p>Hi ${data.studentName},</p>
      <p>${data.coachName} has assigned you a new task!</p>
      <p><strong>Title:</strong> ${data.title}</p>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Due Date:</strong> ${data.dueDate}</p>
      <p><strong>Points:</strong> ${data.points}</p>
      <p>
        <a href="${data.link}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:20px 0;">
          View Assignment
        </a>
      </p>
      <p>Good luck!<br>CV Saathi Team</p>
    `
  };
  
  return templates[template] || `<p>${JSON.stringify(data)}</p>`;
}

/**
 * Send interview request email
 */
async function sendInterviewRequestEmail(to, data) {
  return sendEmail({
    to,
    subject: `Interview Assessment - ${data.title}`,
    template: 'interview-request',
    data
  });
}

/**
 * Send assessment approval email
 */
async function sendAssessmentApprovedEmail(to, data) {
  return sendEmail({
    to,
    subject: 'Assessment Approved! 🎉',
    template: 'assessment-approved',
    data
  });
}

/**
 * Send assessment rejection email
 */
async function sendAssessmentRejectedEmail(to, data) {
  return sendEmail({
    to,
    subject: 'Assessment Result',
    template: 'assessment-rejected',
    data
  });
}

/**
 * Send interview scheduled email
 */
async function sendInterviewScheduledEmail(to, data) {
  return sendEmail({
    to,
    subject: 'Video Interview Scheduled 📹',
    template: 'interview-scheduled',
    data
  });
}

/**
 * Send interview cancelled email
 */
async function sendInterviewCancelledEmail(to, data) {
  return sendEmail({
    to,
    subject: 'Interview Cancelled',
    template: 'interview-cancelled',
    data
  });
}

/**
 * Send new assignment email
 */
async function sendNewAssignmentEmail(to, data) {
  return sendEmail({
    to,
    subject: `New Assignment: ${data.title}`,
    template: 'new-assignment',
    data
  });
}

/**
 * Send interview reminder (24h or 1h before)
 */
async function sendInterviewReminderEmail(to, data, hoursBefore) {
  const subject = hoursBefore === 24 
    ? 'Interview Tomorrow - Reminder'
    : 'Interview in 1 Hour - Reminder';
    
  return sendEmail({
    to,
    subject,
    template: 'interview-reminder',
    data: { ...data, hoursBefore }
  });
}
module.exports = {
  sendEmail,
  ticketCreatedUserEmail,
  ticketCreatedAgentEmail,
  agentAcceptedEmail,
  newMessageEmail,
  ticketResolvedEmail,
  sendInterviewRequestEmail,
  sendAssessmentApprovedEmail,
  sendAssessmentRejectedEmail,
  sendInterviewScheduledEmail,
  sendInterviewCancelledEmail,
  sendNewAssignmentEmail,
  sendInterviewReminderEmail
};