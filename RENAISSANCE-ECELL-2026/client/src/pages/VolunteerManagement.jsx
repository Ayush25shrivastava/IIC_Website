import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowLeft, Check, LoaderCircle, RefreshCw, ShieldCheck, Users, X } from "lucide-react";
import { ticketApi } from "../lib/server1-api";

const PASS_NAMES = {
  "event-standard": "Standard Pass",
  "event-premium": "Premium Pass",
  "event-elite": "Elite Pass",
  "accom-standard": "Standard Pass + Stay",
  "accom-premium": "Premium Pass + Stay",
  "accom-elite": "Elite Pass + Stay",
};

const formatDate = (date) => date && !Number.isNaN(new Date(date).getTime())
  ? new Date(date).toLocaleString()
  : "—";

export default function VolunteerManagement() {
  const { admin, handleError } = useOutletContext();
  const [volunteers, setVolunteers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [volunteerData, ticketData] = await Promise.all([
        ticketApi.adminVolunteers(),
        ticketApi.adminList(),
      ]);
      setVolunteers(volunteerData.volunteers || []);
      setTickets(ticketData.tickets || []);
    } catch (err) {
      if (!handleError(err)) setError(err.message || "Could not load volunteer management data.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => { loadData(); }, [loadData]);

  async function setStatus(volunteer, status) {
    setBusyId(volunteer._id);
    setError("");
    setNotice("");
    try {
      await ticketApi.setVolunteerStatus(volunteer._id, status);
      await loadData();
      setNotice(status === "ACTIVE" ? `${volunteer.name} is approved to scan tickets.` : `Scanner access updated for ${volunteer.name}.`);
    } catch (err) {
      if (!handleError(err)) setError(err.message || "Could not update volunteer access.");
    } finally {
      setBusyId("");
    }
  }

  const visibleVolunteers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return volunteers.filter((volunteer) => !term || `${volunteer.name} ${volunteer.email} ${volunteer.status}`.toLowerCase().includes(term));
  }, [search, volunteers]);

  const selectedScans = useMemo(() => {
    if (!selectedVolunteer) return [];
    return tickets.flatMap((ticket) => (ticket.stageScans || [])
      .filter((scan) => scan.scannedByRole === "VOLUNTEER_SCANNER" && (
        scan.scannedByEmail?.toLowerCase() === selectedVolunteer.email.toLowerCase()
        || (!scan.scannedByEmail && scan.scannedByName === selectedVolunteer.name)
      ))
      .map((scan) => ({ ticket, scan })))
      .sort((a, b) => new Date(b.scan.scannedAt || 0) - new Date(a.scan.scannedAt || 0));
  }, [selectedVolunteer, tickets]);

  const pendingCount = volunteers.filter((volunteer) => volunteer.status === "PENDING").length;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_15%_18%,rgba(249,231,196,0.60)_0%,transparent_34%),radial-gradient(ellipse_at_85%_76%,rgba(128,199,220,0.35)_0%,transparent_36%),linear-gradient(180deg,#E9DFC9_0%,#C6DEE0_20%,#D7E1D9_44%,#F2E8C8_72%,#FFD9A5_100%)] px-4 py-5 text-[#173f52] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/40 bg-[#e5f5f8] px-5 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Users className="text-[#b17e2e]" size={24} />
            <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#527e8e]">Admin command center</p><h1 className="font-cinzel text-xl font-black">Volunteer management</h1></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-xs font-bold text-[#527e8e] sm:inline">{admin?.name}</span>
            <button type="button" onClick={loadData} disabled={loading} className="flex items-center gap-1.5 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
            <Link to="/admin/campus-ambassadors" className="flex items-center gap-1.5 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50"><ArrowLeft size={16} /> Admin home</Link>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/40 bg-[#e5f5f8] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#b6dce4] p-5">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-[#527e8e]">Scanner permissions</p><h2 className="mt-1 font-cinzel text-xl font-bold">Access requests <span className="font-sans text-sm text-[#527e8e]">{pendingCount} pending · {volunteers.length} total</span></h2></div>
            <input aria-label="Search volunteers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, status" className="w-full max-w-sm rounded-xl border border-[#afd6e1] bg-white px-3 py-2 text-sm text-[#173f52]" />
          </div>
          {error && <p role="alert" className="m-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 font-semibold text-rose-800">{error}</p>}
          {notice && <p role="status" className="m-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">{notice}</p>}
          {loading ? (
            <div role="status" className="flex items-center justify-center gap-2 p-12 text-[#527e8e]"><LoaderCircle className="animate-spin" /> Loading volunteers and scan records…</div>
          ) : !visibleVolunteers.length ? (
            <p className="p-8 text-center text-sm font-semibold text-[#527e8e]">{volunteers.length ? "No volunteers match this search." : "No volunteer access requests yet."}</p>
          ) : (
            <div className="divide-y divide-[#b6dce4]">
              {visibleVolunteers.map((volunteer) => {
                const scanCount = tickets.reduce((count, ticket) => count + (ticket.stageScans || []).filter((scan) => scan.scannedByRole === "VOLUNTEER_SCANNER" && scan.scannedByEmail?.toLowerCase() === volunteer.email.toLowerCase()).length, 0);
                return <article key={volunteer._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="min-w-[230px] flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{volunteer.name}</h3><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase ${volunteer.status === "ACTIVE" ? "border-emerald-300 bg-emerald-100 text-emerald-800" : volunteer.status === "PENDING" ? "border-amber-300 bg-amber-100 text-amber-800" : "border-slate-300 bg-slate-100 text-slate-700"}`}>{volunteer.status}</span></div>
                    <p className="mt-1 text-sm text-[#527e8e]">{volunteer.email}</p>
                    <p className="mt-1 text-xs text-[#688b96]">Requested {formatDate(volunteer.createdAt)} · {scanCount} scan{scanCount === 1 ? "" : "s"}{volunteer.lastLoginAt ? ` · Last sign-in ${formatDate(volunteer.lastLoginAt)}` : ""}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedVolunteer(volunteer)} className="rounded-xl border border-[#b6dce4] bg-white px-4 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50">View scans</button>
                    {volunteer.status === "ACTIVE" ? (
                      <button type="button" disabled={busyId === volunteer._id} onClick={() => setStatus(volunteer, "DISABLED")} className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50">{busyId === volunteer._id ? "Saving…" : "Revoke access"}</button>
                    ) : (
                      <button type="button" disabled={busyId === volunteer._id} onClick={() => setStatus(volunteer, "ACTIVE")} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">{busyId === volunteer._id ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />} Approve scanner</button>
                    )}
                    {volunteer.status === "PENDING" && <button type="button" disabled={busyId === volunteer._id} onClick={() => setStatus(volunteer, "REJECTED")} className="rounded-xl border border-[#b6dce4] bg-white px-4 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50 disabled:opacity-50">Reject</button>}
                  </div>
                </article>;
              })}
            </div>
          )}
        </section>
      </div>

      {selectedVolunteer && <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedVolunteer(null); }} role="presentation">
        <section className="my-auto max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#b6dce4] bg-[#f4fbfc] p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="volunteer-scan-history-title">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#527e8e]">Volunteer scan activity</p><h2 id="volunteer-scan-history-title" className="mt-1 font-cinzel text-2xl font-black">{selectedVolunteer.name}</h2><p className="mt-1 text-sm text-[#527e8e]">{selectedVolunteer.email} · {selectedScans.length} recorded scan{selectedScans.length === 1 ? "" : "s"}</p></div><button type="button" onClick={() => setSelectedVolunteer(null)} className="flex items-center gap-1.5 rounded-lg border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579]"><X size={16} /> Close</button></div>
          {!selectedScans.length ? <p className="rounded-xl border border-[#b6dce4] bg-white p-6 text-center text-sm font-semibold text-[#527e8e]">This volunteer has not scanned any tickets yet.</p> : <div className="max-h-[62vh] overflow-auto rounded-xl border border-[#b6dce4] bg-white"><table className="w-full min-w-[800px] border-collapse text-left text-sm"><thead className="sticky top-0 bg-[#e5f5f8] text-[10px] uppercase tracking-wider text-[#527e8e]"><tr><th className="p-3">Ticket ID</th><th className="p-3">Registrant</th><th className="p-3">Registrant email</th><th className="p-3">Pass</th><th className="p-3">Stage</th><th className="p-3">Scanned at</th></tr></thead><tbody className="divide-y divide-[#e1eef1]">{selectedScans.map(({ ticket, scan }, index) => <tr key={`${ticket._id}-${scan.stageId || scan.stage}-${scan.scannedAt || index}`}><td className="p-3 font-mono font-bold">{ticket.ticketId}</td><td className="p-3 font-semibold">{ticket.name}</td><td className="p-3 text-[#376579]">{ticket.email}</td><td className="p-3 text-[#376579]">{PASS_NAMES[ticket.ticketType] || ticket.ticketType}</td><td className="p-3 text-[#376579]">{scan.stageName || scan.stageId || `Stage ${scan.stage}`}</td><td className="p-3 text-[#527e8e]">{formatDate(scan.scannedAt)}</td></tr>)}</tbody></table></div>}
        </section>
      </div>}
    </main>
  );
}
