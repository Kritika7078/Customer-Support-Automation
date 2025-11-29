import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      //fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      const aiResponse = await analyzeTicket(ticket);
        const relatedskills = await step.run("update-ticket-data", async () => {
        let skills = [];
        if (aiResponse) {
              const validatedPriority = !["low", "medium", "high"].includes(aiResponse.priority?.toLowerCase())
              ? "medium"
              : aiResponse.priority.toLowerCase();

          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: validatedPriority,
            helpfulNotes: aiResponse.helpfulNotes || null,
            status: "IN_PROGRESS", // Now the status updates correctly
            relatedSkills: aiResponse.relatedSkills || [],
          });
          skills = aiResponse.relatedSkills || [];
        }
        return skills;
      });

      // 4. ASSIGN MODERATOR
      const moderator = await step.run("assign-moderator", async () => {
        // The primary logic: find a moderator whose skills match ANY of the ticket's skills
        // Fix for multiple moderators: Sort by assigned ticket count to pick the least busy one.
        // We will use the $all operator to ensure ALL skills are matched, but since you want ANY match, we stick to the regex but make the query better.
        
        // Find a moderator who possesses at least one of the required skills
        let user = await User.findOne({
            role: "moderator",
            skills: { $in: relatedskills }, // $in is cleaner than complex regex for a list
        })
        .sort({ ticketsAssignedCount: 1 }) // Assuming you'll add a counter for load balancing
        .exec();
        
        // Fallback logic: If no skilled moderator, assign to an admin
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }
            if (user) {
                console.log(`Fallback: Assigned ticket ${ticket._id} to Admin: ${user._id}`);
            } else {
                console.warn(`CRITICAL WARNING: No moderator or admin user found. Ticket remains unassigned (null).`);
            }
        // Update the assignedTo field and the moderator's assigned ticket count
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        
        // Optional: Increment the assigned moderator's ticket count for load balancing
        if (user) {
            await User.findByIdAndUpdate(user._id, { $inc: { ticketsAssignedCount: 1 } });
        }
        
        return user;
      });

      // console.log("aiResponse Data:", aiResponse);
      // const relatedskills = await step.run("ai-processing", async () => {
      //   let skills = [];
      //   if (aiResponse) {
      //     await Ticket.findByIdAndUpdate(ticket._id, {
      //       priority: !["low", "medium", "high"].includes(aiResponse.priority)
      //         ? "medium"
      //         : aiResponse.priority,
      //       helpfulNotes: aiResponse.helpfulNotes,
      //       status: "IN_PROGRESS",
      //       relatedSkills: aiResponse.relatedSkills,
      //     });
      //     skills = aiResponse.relatedSkills;
      //   }
      //   return skills;
      // });

      // const moderator = await step.run("assign-moderator", async () => {
      //   let user = await User.findOne({
      //     role: "moderator",
      //     skills: {
      //       $elemMatch: {
      //         $regex: relatedskills.join("|"),
      //         $options: "i",
      //       },
      //     },
      //   });
      //   if (!user) {
      //     user = await User.findOne({
      //       role: "admin",
      //     });
      //   }
      //   await Ticket.findByIdAndUpdate(ticket._id, {
      //     assignedTo: user?._id || null,
      //   });
      //   return user;
      // });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket is assigned to you ${finalTicket.title}`
          );
        }
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error running the step", err.message);
      return { success: false };
    }
  }
);


