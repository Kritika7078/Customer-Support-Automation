import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  console.log("Fetching ticket with ID:", id);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Defensive parsing: backend may return either { ticket } or the ticket object directly
        let data = null;
        try {
          data = await res.json();
          console.log("Raw API Response Data:", data);
        } catch (err) {
          data = null;
        }

        // if (!res.ok) {
        //   alert((data && data.message) || "Failed to fetch ticket");
        // } else {
        //   const resolvedTicket = (data && data.ticket) || data || null;
        //   setTicket(resolvedTicket);
        // }
        if (!res.ok) {
          alert((data && data.message) || "Failed to fetch ticket");
        } else {
          // If the response is good, ALWAYS expect data.ticket
          const resolvedTicket = data.ticket; // <-- Simplified and correct
console.log(" Response Data:", resolvedTicket);
          setTicket(resolvedTicket);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }



// TicketDetailsPage.jsx

// ... inside fetchTicket async function ...

    // try {
    //   const res = await fetch(
    //     `${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
      
    //   // Attempt to parse the JSON. If the response is 204 or empty, this might throw.
    //   const data = res.status === 204 ? null : await res.json(); 

    //   if (!res.ok) {
    //     // Handle 400/404/500 errors explicitly
    //     alert((data && data.message) || `Failed to fetch ticket (Status: ${res.status})`);
    //     setTicket(null);
    //   } else if (res.status === 204 || !data || !data.ticket) {
    //     // Handle cases where the server returns 204 or no body
    //     setTicket(null);
    //   } else {
    //     // SUCCESS PATH: Data is received and parsed
    //     console.log("SUCCESS: Fetched Ticket Data:", data.ticket);
    //     setTicket(data.ticket); 
    //   }
    // } catch (err) {
    //   console.error("Error fetching or parsing ticket data:", err);
    //   alert("Something went wrong during data transfer.");
    // } finally {
    //   setLoading(false);
    // }
  
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

   return (
     <div className="max-w-3xl mx-auto p-4">
       <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
     <div className="card bg-gray-800 shadow p-4 space-y-4">
       <h3 className="text-xl font-semibold">{ticket.title}</h3>
       <p>{ticket.description}</p>
       {/* Conditionally render extended details */}
       {ticket.status && (
         <>
           <div className="divider">Metadata</div>
           <p>
             <strong>Status:</strong> {ticket.status}
           </p>
           {ticket.priority && (
             <p>
               <strong>Priority:</strong> {ticket.priority}
             </p>
           )}
           {ticket.relatedSkills?.length > 0 && (
             <p>
              <strong>Related Skills:</strong>{" "}
               {ticket.relatedSkills.join(", ")}
             </p>
           )}

           {ticket.helpfulNotes && (
             <div>
               <strong>Helpful Notes:</strong>
               <div className="prose max-w-none rounded mt-2">
                 <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
               </div>
             </div>
           )}

           {ticket.assignedTo && (
             <p>
               <strong>Assigned To:</strong> {ticket.assignedTo?.email}
             </p>
           )}
           {ticket.createdAt && (
             <p className="text-sm text-gray-500 mt-2">
               Created At: {new Date(ticket.createdAt).toLocaleString()}
             </p>
           )}
         </>
       )}
     </div>
   </div>
 );


}
