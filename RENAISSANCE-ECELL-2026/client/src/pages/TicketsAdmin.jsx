
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import {
    ArrowLeft, Camera, Check, CheckCircle2, Edit3, Globe, LoaderCircle, Plus,
    RefreshCw, Search, ShieldCheck, Ticket, Trash2, XCircle
} from "lucide-react";
import { ticketApi } from "../lib/server1-api";
import { adminStyles } from "../lib/adminStyles";

const PASS_TYPES = [
    ["event-standard", "Standard Pass"],
    ["event-premium", "Premium Pass"],
    ["event-elite", "Elite Pass"],
    ["accom-standard", "Standard Pass + Stay"],
    ["accom-premium", "Premium Pass + Stay"],
    ["accom-elite", "Elite Pass + Stay"],
];

const PASS_NAMES = Object.fromEntries(PASS_TYPES);
const TICKETS_PER_PAGE = 20;

const statusColors = {
    Pending: "border-amber-300 bg-amber-100 text-amber-800",
    Verified: "border-emerald-300 bg-emerald-100 text-emerald-800",
    Rejected: "border-rose-300 bg-rose-100 text-rose-800",
};

let scannerLifecycle = Promise.resolve();

function StageBadges({ scans = [], stages = [] }) {
    const visibleStages = stages.length
        ? stages
        : [1, 2, 3].map((stage) => ({
              stageId: `stage-${stage}`,
              name: `Stage ${stage}`,
          }));

    return (
        <div className="flex flex-wrap gap-1.5">
            {visibleStages.map((stage) => {
                const scan = scans.find(
                    (item) =>
                        item.stageId === stage.stageId ||
                        (!item.stageId &&
                            stage.stageId === `stage-${item.stage}`)
                );

                return (
                    <span
                        key={stage.stageId}
                        title={
                            scan
                                ? `Scanned ${new Date(
                                      scan.scannedAt
                                  ).toLocaleString()}`
                                : `${stage.name} not scanned`
                        }
                        className={`rounded-full border px-2 py-1 text-[10px] font-bold ${
                            scan
                                ? "border-amber-300 bg-amber-100 text-amber-800"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                    >
                        {scan
                            ? `${stage.name} · scanned`
                            : `${stage.name} · open`}
                    </span>
                );
            })}

            {scans
                .filter(
                    (scan) =>
                        !visibleStages.some(
                            (stage) =>
                                stage.stageId ===
                                (scan.stageId || `stage-${scan.stage}`)
                        )
                )
                .map((scan) => (
                    <span
                        key={scan.stageId || `legacy-${scan.stage}`}
                        title={`Scanned ${new Date(
                            scan.scannedAt
                        ).toLocaleString()}`}
                        className="rounded-full border border-amber-300 bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800"
                    >
                        {scan.stageName ||
                            scan.stageId ||
                            `Legacy stage ${scan.stage}`}{" "}
                        · scanned
                    </span>
                ))}
        </div>
    );
}

function CameraReader({ onDecoded, onError }) {
    useEffect(() => {
        const scanner = new Html5Qrcode("admin-ticket-qr-reader");
        let active = true;

        const startTask = scannerLifecycle.then(async () => {
            if (!active) return;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 240, height: 240 },
                    aspectRatio: 1,
                },
                (decoded) => {
                    if (active) {
                        active = false;
                        onDecoded(decoded);
                    }
                },
                () => {}
            );
        });

        scannerLifecycle = startTask.catch(() => {});

        startTask.catch((error) => {
            if (active) {
                onError(
                    error?.message ||
                        "Camera could not be started. Check browser permissions."
                );
            }
        });

        return () => {
            active = false;

            scannerLifecycle = scannerLifecycle
                .then(async () => {
                    if (scanner.isScanning) {
                        await scanner.stop().catch(() => {});
                    }

                    try {
                        scanner.clear();
                    } catch {
                        // Scanner already unmounted.
                    }
                })
                .catch(() => {});
        };
    }, [onDecoded, onError]);

    return (
        <div
            id="admin-ticket-qr-reader"
            className="mx-auto min-h-64 w-full max-w-md overflow-hidden rounded-2xl bg-slate-950 [&_video]:w-full [&_video]:rounded-xl [&_button]:m-2 [&_button]:rounded-lg [&_button]:bg-white [&_button]:px-3 [&_button]:py-2 [&_button]:text-slate-900 [&_select]:rounded-lg"
        />
    );
}

export default function TicketsAdmin() {
    const { admin, handleError } = useOutletContext();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [filter, setFilter] = useState("Pending");
    const [passFilter, setPassFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [stageConfigs, setStageConfigs] = useState({});
    const [soldOutPasses, setSoldOutPasses] = useState({});
    const [passType, setPassType] = useState("event-standard");
    const [stageId, setStageId] = useState("");
    const [stageName, setStageName] = useState("");
    const [stageConfigBusy, setStageConfigBusy] = useState(false);
    const [manualId, setManualId] = useState("");
    const [cameraOn, setCameraOn] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanBusy, setScanBusy] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [editBusy, setEditBusy] = useState(false);

    const loadTickets = useCallback(async () => {
        const data = await ticketApi.adminList();
        setTickets(data.tickets || []);
    }, []);

    const loadStageConfigs = useCallback(async () => {
        const data = await ticketApi.stageConfigs();

        const configs = Object.fromEntries(
            (data.configs || []).map((config) => [
                config.ticketType,
                config.stages || [],
            ])
        );

        setStageConfigs(configs);
        setSoldOutPasses(Object.fromEntries((data.configs || []).map((config) => [config.ticketType, Boolean(config.soldOut)])));
        return configs;
    }, []);

    useEffect(() => {
        let active = true;

        Promise.all([
            ticketApi.adminList(),
            ticketApi.stageConfigs(),
        ])
            .then(([ticketData, stageData]) => {
                if (!active) return;

                setTickets(ticketData.tickets || []);

                const configs = Object.fromEntries(
                    (stageData.configs || []).map((config) => [
                        config.ticketType,
                        config.stages || [],
                    ])
                );

                setStageConfigs(configs);
                setSoldOutPasses(Object.fromEntries((stageData.configs || []).map((config) => [config.ticketType, Boolean(config.soldOut)])));
                setStageId((configs[passType] || [])[0]?.stageId || "");
            })
            .catch((err) => {
                if (active && !handleError(err)) {
                    setError(
                        err.message ||
                            "Could not load ticket submissions."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [handleError, passType]);

    async function refresh() {
        setError("");

        try {
            await Promise.all([loadTickets(), loadStageConfigs()]);
        } catch (err) {
            if (!handleError(err)) {
                setError(
                    err.message || "Could not refresh ticket settings."
                );
            }
        }
    }

    async function addStage(event) {
        event.preventDefault();

        if (!stageName.trim()) return;

        setStageConfigBusy(true);
        setError("");
        setNotice("");

        try {
            const data = await ticketApi.addStage(
                passType,
                stageName.trim()
            );

            setStageConfigs((current) => ({
                ...current,
                [passType]: data.stages,
            }));

            setStageId(data.stages.at(-1)?.stageId || "");
            setStageName("");

            setNotice(
                `Added ${data.stages.at(-1)?.name} to ${
                    PASS_TYPES.find(([id]) => id === passType)?.[1]
                }.`
            );
        } catch (err) {
            if (!handleError(err)) {
                setError(err.message || "Could not add stage.");
            }
        } finally {
            setStageConfigBusy(false);
        }
    }

    async function removeStage(stage) {
        if (
            !window.confirm(
                `Remove “${stage.name}” from ${
                    PASS_TYPES.find(([id]) => id === passType)?.[1]
                }? Existing scan records will be kept.`
            )
        ) {
            return;
        }

        setStageConfigBusy(true);
        setError("");
        setNotice("");

        try {
            const data = await ticketApi.deleteStage(
                passType,
                stage.stageId
            );

            setStageConfigs((current) => ({
                ...current,
                [passType]: data.stages,
            }));

            if (stageId === stage.stageId) {
                setStageId(data.stages[0]?.stageId || "");
            }

            setNotice(
                `Removed ${stage.name}. Existing ticket scan history was preserved.`
            );
        } catch (err) {
            if (!handleError(err)) {
                setError(err.message || "Could not remove stage.");
            }
        } finally {
            setStageConfigBusy(false);
        }
    }

    async function toggleSoldOut() {
        const soldOut = !soldOutPasses[passType];
        setStageConfigBusy(true);
        setError("");
        setNotice("");
        try {
            const result = await ticketApi.setSoldOut(passType, soldOut);
            setSoldOutPasses((current) => ({ ...current, [passType]: result.soldOut }));
            setNotice(`${PASS_TYPES.find(([id]) => id === passType)?.[1]} marked ${result.soldOut ? "sold out" : "available"}.`);
        } catch (err) {
            if (!handleError(err)) setError(err.message || "Pass availability could not be updated.");
        } finally {
            setStageConfigBusy(false);
        }
    }

    async function verify(ticket, status) {
        setBusyId(ticket._id);
        setError("");
        setNotice("");

        try {
            await ticketApi.verify(ticket._id, { status });

            setNotice(
                `${ticket.ticketId} marked ${status.toLowerCase()}.`
            );

            await loadTickets();
        } catch (err) {
            if (!handleError(err)) {
                setError(
                    err.message || "Ticket status could not be updated."
                );
            }
        } finally {
            setBusyId("");
        }
    }

    function startEditing(ticket) {
        const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
        setEditingTicket(ticket);
        setEditForm({
            name: ticket.name || "", email: ticket.email || "", phone: ticket.phone || "",
            college: ticket.college || "", city: ticket.city || "", teamName: ticket.teamName || "",
            ticketType: ticket.ticketType || "event-standard", tshirtSize: ticket.tshirtSize || "",
            accommodationDays: String(ticket.accommodationDays ?? 0),
            checkInDate: dateValue(ticket.checkInDate), checkOutDate: dateValue(ticket.checkOutDate),
            accommodationPreferences: ticket.accommodationPreferences || "",
            transactionId: ticket.transactionId || "", amountPaid: String(ticket.amountPaid ?? ""),
        });
    }

    async function saveTicketEdits(event) {
        event.preventDefault();
        if (!editingTicket || !editForm) return;
        setEditBusy(true);
        setError("");
        setNotice("");
        try {
            await ticketApi.update(editingTicket._id, editForm);
            setNotice(`${editingTicket.ticketId} updated. The Edited badge is now recorded.`);
            setEditingTicket(null);
            setEditForm(null);
            await loadTickets();
        } catch (err) {
            if (!handleError(err)) setError(err.message || "Ticket could not be updated.");
        } finally {
            setEditBusy(false);
        }
    }

    const activeStages = useMemo(
        () => stageConfigs[passType] || [],
        [passType, stageConfigs]
    );

    const handleScan = useCallback(
        async (rawValue) => {
            const ticketId = String(rawValue || "").trim().toUpperCase();

            if (!ticketId) return;

            setCameraOn(false);
            setScanBusy(true);
            setScanResult(null);
            setError("");

            try {
                const data = await ticketApi.scan({
                    ticketId,
                    ticketType: passType,
                    stageId,
                });

                const result = {
                    ...data,
                    selectedStage:
                        data.selectedStage?.name || "Selected stage",
                };

                setScanResult(result);
                setManualId("");

                await loadTickets();
            } catch (err) {
                if (handleError(err)) return;

                setScanResult({
                    error: err.message || "Ticket scan failed.",
                    selectedStage:
                        activeStages.find(
                            (item) => item.stageId === stageId
                        )?.name || "Selected stage",
                });
            } finally {
                setScanBusy(false);
            }
        },
        [
            activeStages,
            handleError,
            loadTickets,
            passType,
            stageId,
        ]
    );

    const cameraError = useCallback((message) => {
        setCameraOn(false);
        setError(message);
    }, []);

    const changePassType = (nextType) => {
        setPassType(nextType);
        setStageId(
            (stageConfigs[nextType] || [])[0]?.stageId || ""
        );
        setScanResult(null);
    };

    const visibleTickets = tickets.filter((ticket) => {
        const matchesFilter =
            filter === "All" || ticket.status === filter;
        const matchesPass = passFilter === "All" || ticket.ticketType === passFilter;

        const term = search.trim().toLowerCase();

        const matchesSearch =
            !term ||
            [
                ticket.name,
                ticket.email,
                ticket.phone,
                ticket.ticketId,
                ticket.transactionId,
                ticket.college,
                ticket.teamName,
                ticket.tshirtSize,
            ].some((value) =>
                String(value || "").toLowerCase().includes(term)
            );

        return matchesFilter && matchesPass && matchesSearch;
    });
    const totalPages = Math.max(1, Math.ceil(visibleTickets.length / TICKETS_PER_PAGE));
    const pageTickets = visibleTickets.slice((currentPage - 1) * TICKETS_PER_PAGE, currentPage * TICKETS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const counts = {
        Pending: tickets.filter(
            (item) => item.status === "Pending"
        ).length,
        Verified: tickets.filter(
            (item) => item.status === "Verified"
        ).length,
        Rejected: tickets.filter(
            (item) => item.status === "Rejected"
        ).length,
    };

    return (
        <main className={`${adminStyles.app} px-4 py-5 sm:px-6 lg:px-10`}>
            <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/40 bg-[#e5f5f8] px-5 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <Ticket className="text-[#b17e2e]" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#527e8e]">
                            Admin command center
                        </p>
                        <h1 className="font-cinzel text-xl font-black text-[#173f52]">
                            Ticket operations
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden text-xs font-bold text-[#527e8e] sm:inline">
                        {admin?.name}
                    </span>

                    <button
                        type="button"
                        onClick={refresh}
                        className="flex items-center gap-1.5 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-1.5 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50"
                    >
                        <Globe size={16} /> Return to website
                    </Link>

                    <Link
                        to="/admin/campus-ambassadors"
                        className="flex items-center gap-1.5 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50"
                    >
                        <ArrowLeft size={16} /> Admin home
                    </Link>
                </div>
            </header>

            <section className="mx-auto mt-6 grid w-full max-w-7xl gap-4 sm:grid-cols-3">
                {[
                    ["Pending review", counts.Pending, "text-amber-800"],
                    ["Verified", counts.Verified, "text-emerald-800"],
                    ["Rejected", counts.Rejected, "text-rose-800"],
                ].map(([label, value, color]) => (
                    <article
                        key={label}
                        className="rounded-2xl border border-white/40 bg-[#e5f5f8] p-5 shadow-lg"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-[#527e8e]">
                            {label}
                        </p>
                        <strong className={`mt-2 block text-3xl ${color}`}>
                            {value}
                        </strong>
                    </article>
                ))}
            </section>

            {error && (
                <div
                    role="alert"
                    className="mx-auto mt-5 max-w-7xl rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 font-semibold text-rose-800"
                >
                    {error}
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="mx-auto mt-5 max-w-7xl rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800"
                >
                    {notice}
                </div>
            )}

            {editingTicket && editForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" role="presentation">
                    <form onSubmit={saveTicketEdits} className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#b6dce4] bg-[#f4fbfc] p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="edit-ticket-title">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div><p className="text-xs font-bold uppercase tracking-widest text-[#527e8e]">Ticket {editingTicket.ticketId}</p><h2 id="edit-ticket-title" className="mt-1 font-cinzel text-2xl font-black text-[#173f52]">Edit ticket entry</h2><p className="mt-1 text-xs text-[#527e8e]">Saving records who edited this ticket and displays an Edited badge.</p></div>
                            <button type="button" onClick={() => { setEditingTicket(null); setEditForm(null); }} className="rounded-lg border border-[#b6dce4] bg-white px-3 py-2 text-sm font-bold text-[#376579]" aria-label="Close edit form">Close</button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[["name", "Full name"], ["email", "Email"], ["phone", "Phone"], ["college", "College / organization"], ["city", "City and state"], ["teamName", "Team name"], ["transactionId", "Transaction ID / UTR"], ["amountPaid", "Amount paid (₹)"], ["checkInDate", "Check-in date"], ["checkOutDate", "Check-out date"]].map(([key, label]) => (
                                <label key={key} className="block text-xs font-bold text-[#527e8e]">{label}<input required={!['teamName', 'checkInDate', 'checkOutDate'].includes(key)} type={key.includes('Date') ? 'date' : key === 'amountPaid' ? 'number' : key === 'email' ? 'email' : 'text'} min={key === 'amountPaid' ? '0' : undefined} step={key === 'amountPaid' ? '0.01' : undefined} value={editForm[key]} onChange={(event) => setEditForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#afd6e1] bg-white px-3 py-2.5 text-sm text-[#173f52]" /></label>
                            ))}
                            <label className="block text-xs font-bold text-[#527e8e]">Pass type<select required value={editForm.ticketType} onChange={(event) => { const ticketType = event.target.value; setEditForm((current) => ({ ...current, ticketType, accommodationDays: ticketType.startsWith('accom-') ? (Number(current.accommodationDays) || 1).toString() : '0' })); }} className="mt-1 w-full rounded-lg border border-[#afd6e1] bg-white px-3 py-2.5 text-sm font-bold text-[#173f52]">{PASS_TYPES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
                            {editForm.ticketType.startsWith('accom-') && <label className="block text-xs font-bold text-[#527e8e]">Accommodation days<select value={editForm.accommodationDays} onChange={(event) => setEditForm((current) => ({ ...current, accommodationDays: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#afd6e1] bg-white px-3 py-2.5 text-sm font-bold text-[#173f52]">{[1, 2, 3, 4].map((days) => <option key={days} value={days}>{days}</option>)}</select></label>}
                            {(editForm.ticketType === 'event-elite' || editForm.ticketType === 'accom-elite') && <label className="block text-xs font-bold text-[#527e8e]">T-shirt size<select value={editForm.tshirtSize} onChange={(event) => setEditForm((current) => ({ ...current, tshirtSize: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#afd6e1] bg-white px-3 py-2.5 text-sm font-bold text-[#173f52]">{['', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => <option key={size || 'unset'} value={size}>{size || 'Not set'}</option>)}</select></label>}
                            {editForm.ticketType.startsWith('accom-') && <label className="block text-xs font-bold text-[#527e8e] sm:col-span-2">Accommodation preferences<textarea rows={2} value={editForm.accommodationPreferences} onChange={(event) => setEditForm((current) => ({ ...current, accommodationPreferences: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#afd6e1] bg-white px-3 py-2.5 text-sm text-[#173f52]" /></label>}
                        </div>
                        <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" disabled={editBusy} onClick={() => { setEditingTicket(null); setEditForm(null); }} className="rounded-xl border border-[#b6dce4] bg-white px-4 py-2.5 text-sm font-bold text-[#376579]">Cancel</button><button type="submit" disabled={editBusy} className="rounded-xl bg-[#0c5264] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{editBusy ? 'Saving…' : 'Save changes'}</button></div>
                    </form>
                </div>
            )}

            <section className="mx-auto mt-6 grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,.8fr)]">
                <div className="overflow-hidden rounded-2xl border border-white/40 bg-[#e5f5f8] shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#b6dce4] p-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#527e8e]">
                                Payment reconciliation
                            </p>
                            <h2 className="mt-1 font-cinzel text-xl font-bold text-[#173f52]">
                                Submissions{" "}
                                <span className="font-sans text-sm text-[#527e8e]">
                                    ({visibleTickets.length})
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <label className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-3 text-[#6396aa]"
                                />
                                <input
                                    aria-label="Search tickets"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Name, ID, UTR…"
                                    className="w-48 rounded-xl border border-[#afd6e1] bg-white py-2 pl-9 pr-3 text-sm text-[#173f52]"
                                />
                            </label>

                            <select
                                aria-label="Filter ticket status"
                                value={filter}
                                onChange={(event) => {
                                    setFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="rounded-xl border border-[#afd6e1] bg-white px-3 py-2 text-sm text-[#173f52]"
                            >
                                <option>Pending</option>
                                <option>Verified</option>
                                <option>Rejected</option>
                                <option>All</option>
                            </select>
                            <select
                                aria-label="Filter by pass type"
                                value={passFilter}
                                onChange={(event) => {
                                    setPassFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="rounded-xl border border-[#afd6e1] bg-white px-3 py-2 text-sm text-[#173f52]"
                            >
                                <option value="All">All passes</option>
                                {PASS_TYPES.map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div
                            role="status"
                            className="flex items-center justify-center gap-2 p-12 text-[#527e8e]"
                        >
                            <LoaderCircle className="animate-spin" />
                            Loading ticket submissions…
                        </div>
                    ) : visibleTickets.length === 0 ? (
                        <p className="p-12 text-center text-sm font-semibold text-[#527e8e]">
                            No tickets match this view.
                        </p>
                    ) : (
                        <div className="divide-y divide-[#b6dce4]">
                            {pageTickets.map((ticket) => (
                                <article
                                    key={ticket._id}
                                    className="p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-cinzel text-lg font-black text-[#173f52]">
                                                    {ticket.name}
                                                </h3>
                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                                                        statusColors[
                                                            ticket.status
                                                        ] || ""
                                                    }`}
                                                >
                                                    {ticket.status}
                                                </span>
                                                {ticket.editedAt && (
                                                    <span title={`Edited ${new Date(ticket.editedAt).toLocaleString()}`} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-violet-800">
                                                        Edited
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-[#527e8e]">
                                                {ticket.email} · {ticket.phone}
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-xs font-black text-[#986e24]">
                                            {ticket.ticketId}
                                        </span>
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
                                        {/* Pass and T-shirt size */}
                                        <div>
                                            <dt className="text-[#527e8e]">
                                                Pass
                                            </dt>

                                            <dd className="flex flex-col items-start gap-1 font-bold text-[#173f52]">
                                                <span>
                                                    {PASS_NAMES[
                                                        ticket.ticketType
                                                    ] || ticket.ticketType}
                                                </span>

                                                {(ticket.ticketType ===
                                                    "event-elite" ||
                                                    ticket.ticketType ===
                                                        "accom-elite") &&
                                                    ticket.tshirtSize && (
                                                        <span className="inline-flex w-max items-center gap-1 rounded-md border border-[#C5A25F]/40 bg-[#E8D4B4]/50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#8A5F1C]">
                                                            Shirt Size:{" "}
                                                            {ticket.tshirtSize}
                                                        </span>
                                                    )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-[#527e8e]">
                                                Team
                                            </dt>
                                            <dd className="font-bold text-[#173f52]">
                                                {ticket.teamName || "—"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-[#527e8e]">
                                                Paid / expected
                                            </dt>
                                            <dd className="font-bold text-[#173f52]">
                                                ₹{ticket.amountPaid} / ₹
                                                {ticket.amount}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-[#527e8e]">
                                                Transaction / UTR
                                            </dt>
                                            <dd className="break-all font-mono font-bold text-[#173f52]">
                                                {ticket.transactionId}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-[#527e8e]">
                                                College · city
                                            </dt>
                                            <dd className="font-semibold text-[#173f52]">
                                                {ticket.college} · {ticket.city}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-[#527e8e]">
                                                Submitted
                                            </dt>
                                            <dd className="font-semibold text-[#173f52]">
                                                {new Date(
                                                    ticket.createdAt
                                                ).toLocaleString()}
                                            </dd>
                                        </div>
                                    </dl>

                                    {ticket.verificationRemarks && (
                                        <p className="mt-3 rounded-lg bg-white/70 p-3 text-xs text-[#527e8e]">
                                            Admin note:{" "}
                                            {ticket.verificationRemarks}
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <button type="button" disabled={editBusy || Boolean(busyId)} onClick={() => startEditing(ticket)} className="inline-flex items-center gap-2 rounded-xl border border-[#b6dce4] bg-white px-4 py-2 text-sm font-bold text-[#376579] hover:bg-slate-50 disabled:opacity-50">
                                            <Edit3 size={16} /> Edit ticket
                                        </button>
                                    </div>

                                    {ticket.status === "Pending" && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={Boolean(busyId)}
                                                onClick={() =>
                                                    verify(ticket, "Verified")
                                                }
                                                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                                            >
                                                <Check
                                                    size={16}
                                                    className="inline"
                                                />{" "}
                                                {busyId === ticket._id
                                                    ? "Saving…"
                                                    : "Verify payment"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={Boolean(busyId)}
                                                onClick={() =>
                                                    verify(ticket, "Rejected")
                                                }
                                                className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                                            >
                                                <XCircle
                                                    size={16}
                                                    className="inline"
                                                />{" "}
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {ticket.status === "Verified" && (
                                        <div className="mt-4 space-y-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#527e8e]">
                                                Entry by stage
                                            </p>

                                            <StageBadges
                                                scans={ticket.stageScans}
                                                stages={
                                                    stageConfigs[
                                                        ticket.ticketType
                                                    ] || []
                                                }
                                            />

                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    disabled={Boolean(busyId)}
                                                    onClick={() =>
                                                        verify(
                                                            ticket,
                                                            "Pending"
                                                        )
                                                    }
                                                    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                                                >
                                                    <XCircle
                                                        size={16}
                                                        className="inline"
                                                    />{" "}
                                                    Unverify
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={Boolean(busyId)}
                                                    onClick={() =>
                                                        verify(
                                                            ticket,
                                                            "Rejected"
                                                        )
                                                    }
                                                    className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                                                >
                                                    <XCircle
                                                        size={16}
                                                        className="inline"
                                                    />{" "}
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {ticket.status === "Rejected" && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={Boolean(busyId)}
                                                onClick={() =>
                                                    verify(ticket, "Pending")
                                                }
                                                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                                            >
                                                <XCircle
                                                    size={16}
                                                    className="inline"
                                                />{" "}
                                                Undo Reject
                                            </button>

                                            <button
                                                type="button"
                                                disabled={Boolean(busyId)}
                                                onClick={() =>
                                                    verify(ticket, "Verified")
                                                }
                                                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                                            >
                                                <Check
                                                    size={16}
                                                    className="inline"
                                                />{" "}
                                                Verify
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))}
                            {visibleTickets.length > TICKETS_PER_PAGE && (
                                <nav aria-label="Ticket pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#b6dce4] px-5 py-4">
                                    <p className="text-xs font-semibold text-[#527e8e]">
                                        Showing {(currentPage - 1) * TICKETS_PER_PAGE + 1}–{Math.min(currentPage * TICKETS_PER_PAGE, visibleTickets.length)} of {visibleTickets.length}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-[#afd6e1] bg-white px-3 py-2 text-sm font-bold text-[#376579] disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                                        <span aria-live="polite" className="px-2 text-xs font-bold text-[#527e8e]">Page {currentPage} of {totalPages}</span>
                                        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-[#afd6e1] bg-white px-3 py-2 text-sm font-bold text-[#376579] disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                                    </div>
                                </nav>
                            )}
                        </div>
                    )}
                </div>

                <aside className="h-fit rounded-2xl border border-white/40 bg-[#e5f5f8] p-5 shadow-xl">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#b17e2e]" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#527e8e]">
                                Entry gate & stages
                            </p>
                            <h2 className="font-cinzel text-xl font-bold text-[#173f52]">
                                Stage QR scanner
                            </h2>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-[#527e8e]">
                        Configure pass stages and scan attendee QR codes.
                        Volunteers can also scan from{" "}
                        <strong>/volunteer</strong>.
                    </p>

                    <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-[#527e8e]">
                        Pass type
                        <select
                            value={passType}
                            onChange={(event) =>
                                changePassType(event.target.value)
                            }
                            className="mt-2 rounded-xl border border-[#afd6e1] bg-white px-3 py-3 text-sm font-bold text-[#173f52]"
                        >
                            {PASS_TYPES.map(([id, name]) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${soldOutPasses[passType] ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
                        <div><p className="text-xs font-black uppercase tracking-wider text-[#173f52]">Pass availability</p><p className={`mt-1 text-xs font-bold ${soldOutPasses[passType] ? "text-rose-700" : "text-emerald-700"}`}>{soldOutPasses[passType] ? "Sold out · registration is blocked" : "Available for registration"}</p></div>
                        <button type="button" disabled={stageConfigBusy} onClick={toggleSoldOut} className={`rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50 ${soldOutPasses[passType] ? "bg-emerald-700 hover:bg-emerald-800" : "bg-rose-700 hover:bg-rose-800"}`}>{stageConfigBusy ? "Saving…" : soldOutPasses[passType] ? "Reopen pass" : "Mark sold out"}</button>
                    </div>

                    <div className="mt-4 rounded-xl border border-[#b6dce4] bg-white/75 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#173f52]">
                                Stages for this pass
                            </h3>
                            <span className="text-[10px] font-bold text-[#527e8e]">
                                {activeStages.length}/20
                            </span>
                        </div>

                        {activeStages.length ? (
                            <ul className="mt-3 space-y-2">
                                {activeStages.map((stage, index) => (
                                    <li
                                        key={stage.stageId}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-[#d4e7eb] bg-white px-3 py-2"
                                    >
                                        <span className="min-w-0">
                                            <span className="mr-2 font-mono text-[10px] font-bold text-[#8A5F1C]">
                                                {index + 1}.
                                            </span>
                                            <span className="wrap-break-word text-sm font-semibold text-[#173f52]">
                                                {stage.name}
                                            </span>
                                        </span>

                                        <button
                                            type="button"
                                            aria-label={`Delete ${stage.name}`}
                                            disabled={stageConfigBusy}
                                            onClick={() =>
                                                removeStage(stage)
                                            }
                                            className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-xs text-[#7b5b25]">
                                No stages configured. Add stages below before
                                scanning.
                            </p>
                        )}

                        <form
                            onSubmit={addStage}
                            className="mt-3 flex gap-2"
                        >
                            <input
                                aria-label="New stage name"
                                value={stageName}
                                onChange={(event) =>
                                    setStageName(event.target.value)
                                }
                                minLength={2}
                                maxLength={50}
                                placeholder="e.g. Main auditorium"
                                className="min-w-0 flex-1 rounded-xl border border-[#afd6e1] bg-white px-3 py-2 text-sm text-[#173f52]"
                            />

                            <button
                                type="submit"
                                disabled={
                                    stageConfigBusy ||
                                    activeStages.length >= 20 ||
                                    stageName.trim().length < 2
                                }
                                className="rounded-xl bg-[#b17e2e] px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
                            >
                                <Plus size={16} className="inline" /> Add
                            </button>
                        </form>
                    </div>

                    <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#527e8e]">
                        Current stage to scan
                        <select
                            value={stageId}
                            onChange={(event) => {
                                setStageId(event.target.value);
                                setScanResult(null);
                            }}
                            disabled={!activeStages.length}
                            className="mt-2 rounded-xl border border-[#afd6e1] bg-white px-3 py-3 text-sm font-bold text-[#173f52]"
                        >
                            {activeStages.map((stage, index) => (
                                <option
                                    key={stage.stageId}
                                    value={stage.stageId}
                                >
                                    {index + 1}. {stage.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {cameraOn ? (
                        <div className="mt-4">
                            <CameraReader
                                onDecoded={handleScan}
                                onError={cameraError}
                            />

                            <button
                                type="button"
                                onClick={() => setCameraOn(false)}
                                className="mt-3 w-full rounded-xl border border-[#b6dce4] bg-white px-4 py-2 font-bold text-[#376579]"
                            >
                                Stop camera
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            disabled={!activeStages.length || scanBusy}
                            onClick={() => {
                                setError("");
                                setCameraOn(true);
                            }}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173f52] px-4 py-3 font-bold text-white hover:bg-[#245970] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Camera size={18} /> Scan with camera
                        </button>
                    )}

                    <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#7a99a2]">
                        <span className="h-px flex-1 bg-[#b6dce4]" />
                        or enter ID manually
                        <span className="h-px flex-1 bg-[#b6dce4]" />
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleScan(manualId);
                        }}
                        className="flex gap-2"
                    >
                        <input
                            aria-label="Ticket ID to scan"
                            value={manualId}
                            onChange={(event) =>
                                setManualId(event.target.value)
                            }
                            placeholder="REN-XXXXXXXXXXXX"
                            className="min-w-0 flex-1 rounded-xl border border-[#afd6e1] bg-white px-3 py-3 font-mono text-sm uppercase text-[#173f52]"
                        />

                        <button
                            disabled={
                                scanBusy || !manualId.trim() || !stageId
                            }
                            className="rounded-xl bg-[#b17e2e] px-4 py-3 font-bold text-white disabled:opacity-50"
                        >
                            {scanBusy ? (
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                />
                            ) : (
                                "Check in"
                            )}
                        </button>
                    </form>

                    {scanResult && (
                        <div
                            role={scanResult.error ? "alert" : "status"}
                            className={`mt-5 rounded-xl border p-4 ${
                                scanResult.error
                                    ? "border-rose-300 bg-rose-50 text-rose-800"
                                    : scanResult.alreadyScanned
                                      ? "border-amber-300 bg-amber-100 text-amber-900"
                                      : "border-emerald-300 bg-emerald-50 text-emerald-900"
                            }`}
                        >
                            <div className="flex items-center gap-2 font-black">
                                {scanResult.error ? (
                                    <XCircle size={20} />
                                ) : scanResult.alreadyScanned ? (
                                    <Ticket size={20} />
                                ) : (
                                    <CheckCircle2 size={20} />
                                )}

                                {scanResult.error
                                    ? "Scan blocked"
                                    : scanResult.alreadyScanned
                                      ? `Already scanned · ${scanResult.selectedStage}`
                                      : `Admitted · ${scanResult.selectedStage}`}
                            </div>

                            {scanResult.error ? (
                                <p className="mt-2 text-sm">
                                    {scanResult.error}
                                </p>
                            ) : (
                                <>
                                    <p className="mt-2 font-cinzel font-bold">
                                        {scanResult.ticket?.name}
                                        {scanResult.ticket?.teamName
                                            ? ` · Team: ${scanResult.ticket.teamName}`
                                            : ""}
                                    </p>

                                    <p className="font-mono text-xs">
                                        {scanResult.ticket?.ticketId}
                                        {scanResult.ticket?.ticketType
                                            ? ` · ${
                                                  PASS_NAMES[
                                                      scanResult.ticket
                                                          .ticketType
                                                  ] ||
                                                  scanResult.ticket.ticketType
                                              }`
                                            : ""}
                                    </p>

                                    <div className="mt-3">
                                        <StageBadges
                                            scans={
                                                scanResult.ticket?.stageScans
                                            }
                                            stages={
                                                stageConfigs[
                                                    scanResult.ticket
                                                        ?.ticketType
                                                ] || []
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                        <strong>Color guide:</strong> yellow indicates a
                        stage that has already been scanned. A ticket’s
                        stages are configured separately for each pass type.
                    </div>
                </aside>
            </section>
        </main>
    );
}
