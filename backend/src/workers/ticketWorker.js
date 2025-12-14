const SupportTicket = require('../models/supportTicket.model');
const SupportMessage = require('../models/supportMessage.model');
const User = require('../models/user.model');
const {
  sendEmail,
  ticketCreatedUserEmail,
  ticketCreatedAgentEmail,
  agentAcceptedEmail,
  newMessageEmail,
  ticketResolvedEmail
} = require('../services/email.service');

/**
 * Process ticket email jobs
 */
async function processTicketEmail(job) {
  const { type, ticketId, userId, agentId, messageId } = job.data;

  console.log(`\n========================================`);
  console.log(`📧 Processing Email Job #${job.id}`);
  console.log(`Type: ${type}`);
  console.log(`Ticket ID: ${ticketId}`);
  console.log(`========================================\n`);

  try {
    // Fetch ticket with populated data
    const ticket = await SupportTicket.findById(ticketId)
      .populate('user', 'email firstName lastName')
      .populate('primaryAgent', 'email firstName lastName')
      .populate('assignedAgents.agent', 'email firstName lastName');

    if (!ticket) {
      throw new Error(`Ticket not found: ${ticketId}`);
    }

    let emailResult;

    switch (type) {
      case 'ticket_created_user':
        // Send confirmation to user
        const userEmailData = ticketCreatedUserEmail(ticket, ticket.user);
        emailResult = await sendEmail(userEmailData);
        
        // Track email sent
        if (emailResult.success) {
          await SupportTicket.findByIdAndUpdate(ticketId, {
            $push: {
              emailsSent: {
                type: 'ticket_created',
                sentTo: ticket.user.email,
                sentAt: new Date(),
                success: true
              }
            }
          });
        }
        break;

      case 'ticket_created_agents':
        // Send to all available agents (admin, csr, sales)
        const agents = await User.find({
          role: { $in: ['admin', 'csr', 'sales'] },
          status: 'active'
        });

        console.log(`📨 Sending to ${agents.length} agents...`);

        for (const agent of agents) {
          const agentEmailData = ticketCreatedAgentEmail(ticket, ticket.user, agent);
          const result = await sendEmail(agentEmailData);
          
          if (result.success) {
            // Add to pending agents list
            await SupportTicket.findByIdAndUpdate(ticketId, {
              $addToSet: { pendingAgents: agent._id },
              $push: {
                emailsSent: {
                  type: 'ticket_created',
                  sentTo: agent.email,
                  sentAt: new Date(),
                  success: true
                }
              }
            });
          }
        }
        
        // Update ticket status
        await SupportTicket.findByIdAndUpdate(ticketId, {
          status: 'pending_assignment'
        });
        
        emailResult = { success: true, sent: agents.length };
        break;

      case 'agent_accepted':
        const agent = await User.findById(agentId);
        if (!agent) throw new Error('Agent not found');

        const acceptEmailData = agentAcceptedEmail(ticket, ticket.user, agent);
        emailResult = await sendEmail(acceptEmailData);
        
        if (emailResult.success) {
          await SupportTicket.findByIdAndUpdate(ticketId, {
            $push: {
              emailsSent: {
                type: 'agent_accepted',
                sentTo: ticket.user.email,
                sentAt: new Date(),
                success: true
              }
            }
          });
        }
        break;

      case 'new_message':
        const message = await SupportMessage.findById(messageId)
          .populate('sender', 'email firstName lastName role');
        
        if (!message) throw new Error('Message not found');

        // Determine recipients
        const recipients = [];
        
        if (message.sender._id.toString() === ticket.user._id.toString()) {
          // User sent message → notify all assigned agents
          const assignedAgents = ticket.assignedAgents
            .filter(aa => aa.status === 'accepted')
            .map(aa => aa.agent);
          
          for (const agentRef of assignedAgents) {
            const agentUser = await User.findById(agentRef);
            if (agentUser) recipients.push(agentUser);
          }
        } else {
          // Agent sent message → notify user
          recipients.push(ticket.user);
        }

        // Send emails
        for (const recipient of recipients) {
          if (message.isInternal) continue; // Don't send internal notes to users
          
          const msgEmailData = newMessageEmail(ticket, message, recipient, message.sender);
          const result = await sendEmail(msgEmailData);
          
          if (result.success) {
            await SupportTicket.findByIdAndUpdate(ticketId, {
              $push: {
                emailsSent: {
                  type: 'new_message',
                  sentTo: recipient.email,
                  sentAt: new Date(),
                  success: true
                }
              }
            });
          }
        }

        emailResult = { success: true, sent: recipients.length };
        break;

      case 'ticket_resolved':
        const resolvedEmailData = ticketResolvedEmail(ticket, ticket.user);
        emailResult = await sendEmail(resolvedEmailData);
        
        if (emailResult.success) {
          await SupportTicket.findByIdAndUpdate(ticketId, {
            $push: {
              emailsSent: {
                type: 'ticket_resolved',
                sentTo: ticket.user.email,
                sentAt: new Date(),
                success: true
              }
            }
          });
        }
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    console.log(`✅ Email job completed: ${type}`);
    return emailResult;

  } catch (error) {
    console.error(`❌ Email job failed:`, error.message);
    throw error;
  }
}

module.exports = processTicketEmail;