const SupportTicket = require("../models/supportTicket.model");
const SupportMessage = require("../models/supportMessage.model");
const User = require("../models/user.model");
const {
  sendEmail,
  ticketCreatedUserEmail,
  ticketCreatedAgentEmail,
  agentAcceptedEmail,
  newMessageEmail,
  ticketResolvedEmail
} = require("../services/email.service");

module.exports = async function processTicketEmail(job) {
  const { type, ticketId, agentId, messageId } = job.data;

  console.log(`📧 Processing Ticket Email Job #${job.id} (${type})`);

  try {
    const ticket = await SupportTicket.findById(ticketId)
      .populate("user", "email firstName lastName")
      .populate("primaryAgent", "email firstName lastName")
      .populate("assignedAgents.agent", "email firstName lastName");

    if (!ticket) throw new Error(`Ticket not found: ${ticketId}`);

    switch (type) {
      case "ticket_created_user": {
        await sendEmail(ticketCreatedUserEmail(ticket, ticket.user));
        break;
      }

      case "ticket_created_agents": {
        const agents = await User.find({
          role: { $in: ["admin", "csr", "sales"] },
          status: "active"
        });

        for (const agent of agents) {
          await sendEmail(ticketCreatedAgentEmail(ticket, ticket.user, agent));
        }

        await SupportTicket.findByIdAndUpdate(ticketId, {
          status: "pending_assignment"
        });
        break;
      }

      case "agent_accepted": {
        const agent = await User.findById(agentId);
        if (!agent) throw new Error("Agent not found");
        await sendEmail(agentAcceptedEmail(ticket, ticket.user, agent));
        break;
      }

      case "new_message": {
        const message = await SupportMessage.findById(messageId).populate(
          "sender",
          "email firstName lastName role"
        );
        if (!message) throw new Error("Message not found");

        const recipients =
          message.sender._id.toString() === ticket.user._id.toString()
            ? ticket.assignedAgents
                .filter(a => a.status === "accepted")
                .map(a => a.agent)
            : [ticket.user];

        for (const recipient of recipients) {
          if (!message.isInternal) {
            await sendEmail(
              newMessageEmail(ticket, message, recipient, message.sender)
            );
          }
        }
        break;
      }

      case "ticket_resolved": {
        await sendEmail(ticketResolvedEmail(ticket, ticket.user));
        break;
      }

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    console.log(`✅ Ticket email job completed (${type})`);
    return { success: true };
  } catch (err) {
    console.error("❌ Ticket email job failed:", err.message);
    throw err;
  }
};
