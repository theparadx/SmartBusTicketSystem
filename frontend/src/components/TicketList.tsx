import { QRCodeSVG } from 'qrcode.react';

type Ticket = {
  id: string;
  source: string;
  destination: string;
  busType: string;
  fare: number;
  status: string;
  qrToken: string | null;
  createdAt: string;
};

export const TicketList = ({ tickets }: { tickets: Ticket[] }) => {
  if (tickets.length === 0) return <p className="text-gray-500 text-center py-8">No tickets found.</p>;

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <div key={ticket.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex-1 w-full text-left">
            <div className="font-extrabold text-lg text-gray-800">{ticket.source} &rarr; {ticket.destination}</div>
            <div className="text-sm font-semibold text-gray-600 mt-1">Bus Type: <span className="text-blue-600">{ticket.busType}</span> | Fare: <span className="text-blue-600">₹{ticket.fare}</span></div>
            <div className="text-xs text-gray-400 mt-2 font-medium">Booked on: {new Date(ticket.createdAt).toLocaleString()}</div>
            <div className="mt-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                ticket.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' :
                ticket.status === 'IN_USE' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>
          {ticket.status === 'ACTIVE' && ticket.qrToken && (
            <div className="mt-6 md:mt-0 md:ml-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <QRCodeSVG value={ticket.qrToken} size={110} />
              <div className="text-center text-xs font-bold text-gray-500 mt-2 tracking-wide uppercase">Scan Ticket</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
