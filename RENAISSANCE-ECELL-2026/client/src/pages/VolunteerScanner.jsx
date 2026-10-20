import { useCallback, useEffect, useMemo, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Anchor, Camera, CheckCircle2, LoaderCircle, LogOut, ShieldCheck, Ticket, XCircle } from "lucide-react";
import { ticketApi } from "../lib/server1-api";

const PASS_TYPES = [
    ["event-standard", "Standard Pass"], ["event-premium", "Premium Pass"], ["event-elite", "Elite Pass"],
    ["accom-standard", "Standard Pass + Stay"], ["accom-premium", "Premium Pass + Stay"], ["accom-elite", "Elite Pass + Stay"],
];
const PASS_NAMES = Object.fromEntries(PASS_TYPES);

let scannerLifecycle = Promise.resolve();

function CameraReader({ onDecoded, onError }) {
    useEffect(() => {
        const scanner = new Html5Qrcode("volunteer-qr-reader");
        let active = true;
        const startTask = scannerLifecycle.then(async () => {
            if (!active) return;
            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
                (decoded) => { if (active) { active = false; onDecoded(decoded); } },
                () => { },
            );
        });
        scannerLifecycle = startTask.catch(() => { });
        startTask.catch((error) => {
            if (active) onError(error?.message || "Camera could not start. Check its browser permission.");
        });

        return () => {
            active = false;
            scannerLifecycle = scannerLifecycle.then(async () => {
                if (scanner.isScanning) await scanner.stop().catch(() => { });
                try { scanner.clear(); } catch { /* The scanner host is unmounted. */ }
            }).catch(() => { });
        };
    }, [onDecoded, onError]);
    return <div id="volunteer-qr-reader" className="mx-auto min-h-64 w-full max-w-lg overflow-hidden rounded-2xl bg-slate-950 [&_video]:w-full [&_video]:rounded-xl [&_button]:m-2 [&_button]:rounded-lg [&_button]:bg-white [&_button]:px-3 [&_button]:py-2 [&_button]:text-slate-900 [&_select]:rounded-lg" />;
}

function ScanHistory({ scans = [], stages = [] }) {
    return <div className="mt-4 flex flex-wrap gap-2">{stages.map((stage) => {
        const scan = scans.find((item) => item.stageId === stage.stageId || (!item.stageId && stage.stageId === `stage-${item.stage}`));
        return <span key={stage.stageId} className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${scan ? "border-amber-300 bg-amber-100 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
            {stage.name} · {scan ? "scanned" : "open"}
        </span>;
    })}</div>;
}

export default function VolunteerScanner() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [configs, setConfigs] = useState({});
    const [passType, setPassType] = useState("event-standard");
    const [stageId, setStageId] = useState("");
    const [cameraOn, setCameraOn] = useState(false);
    const [scanBusy, setScanBusy] = useState(false);
    const [result, setResult] = useState(null);
    const stages = useMemo(() => configs[passType] || [], [configs, passType]);

    const loadStages = useCallback(async () => {
        const data = await ticketApi.volunteerStages();
        const nextConfigs = Object.fromEntries((data.configs || []).map((config) => [config.ticketType, config.stages || []]));
        setConfigs(nextConfigs);
        setStageId((current) => (nextConfigs[passType] || []).some((stage) => stage.stageId === current)
            ? current : (nextConfigs[passType] || [])[0]?.stageId || "");
    }, [passType]);

    useEffect(() => {
        let active = true;
        ticketApi.volunteerSession()
            .then(async (data) => {
                if (!active) return;
                setEmail(data.email);
                setName(data.name || "");
                await loadStages();
                if (active) setSignedIn(true);
            })
            .catch((err) => { if (active && err.status !== 401) setError(err.message || "Could not connect to scanner service."); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [loadStages]);

    async function login(event) {
        event.preventDefault();
        setBusy(true); setError("");
        try {
            const data = await ticketApi.volunteerLogin({ email, password });
            setEmail(data.email);
            setName(data.name || "");
            await loadStages();
            setPassword("");
            setSignedIn(true);
        } catch (err) {
            setError(err.message || "Sign-in failed. Check the volunteer scanner credentials.");
        } finally { setBusy(false); }
    }

    async function register(event) {
        event.preventDefault();
        setBusy(true); setError(""); setNotice("");
        try {
            await ticketApi.volunteerRegister({ name, email, password });
            setPassword("");
            setAuthMode("login");
            setNotice("Request submitted. You can sign in after an admin approves your scanner access.");
        } catch (err) {
            setError(err.message || "Could not submit your access request.");
        } finally { setBusy(false); }
    }

    async function logout() {
        setBusy(true); setError(""); setCameraOn(false); setResult(null);
        try { await ticketApi.volunteerLogout(); } catch { /* Clear the local scanner view even if the network is unavailable. */ }
        setSignedIn(false);
        setConfigs({});
        setPassword("");
        setBusy(false);
    }

    const scan = useCallback(async (rawId) => {
        const ticketId = String(rawId || "").trim().toUpperCase();
        if (!ticketId || !stageId) return;
        setCameraOn(false); setScanBusy(true); setError(""); setResult(null);
        try {
            const data = await ticketApi.volunteerScan({ ticketId, ticketType: passType, stageId });
            setResult({ ...data, selectedStage: data.selectedStage?.name || "Selected stage" });
        } catch (err) {
            if (err.status === 401) {
                setSignedIn(false);
                setError("Your scanner session expired. Sign in again to continue.");
            } else {
                setResult({ error: err.message || "Ticket could not be scanned.", selectedStage: stages.find((stage) => stage.stageId === stageId)?.name || "Selected stage" });
            }
        } finally { setScanBusy(false); }
    }, [passType, stageId, stages]);

    const cameraError = useCallback((message) => { setCameraOn(false); setError(message); }, []);

    if (loading) return <main className="grid min-h-svh place-items-center bg-[#082b3a] text-[#f3e8d2]"><LoaderCircle className="animate-spin" aria-label="Checking scanner session" /></main>;

    if (!signedIn) return <main className="grid min-h-svh place-items-center bg-[radial-gradient(ellipse_at_top,#15556a,#082b3a_72%)] px-4 py-10 text-[#133747]">
        <section className="w-full max-w-md rounded-3xl border border-white/60 bg-[#e5f5f8] p-7 shadow-2xl sm:p-9">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#d9bf7b] bg-[#fff4d9] text-[#9a7127]"><Anchor size={26} /></div>
            <p className="mt-5 text-center font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#527e8e]">Renaissance · Gate staff</p>
            <h1 className="mt-2 text-center font-cinzel text-3xl font-black text-[#173f52]">Volunteer scanner</h1>
            <p className="mt-2 text-center text-sm text-[#527e8e]">{authMode === "login" ? "Sign in after an admin approves your scanner access." : "Create an account and request scanner access from an admin."}</p>
            <form onSubmit={authMode === "login" ? login : register} className="mt-7 space-y-4">
                {authMode === "register" && <label className="block text-xs font-bold uppercase tracking-wider text-[#527e8e]">Full name<input type="text" autoComplete="name" minLength={2} maxLength={120} required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#afd6e1] bg-white px-4 py-3 text-sm font-medium normal-case tracking-normal text-[#173f52] outline-none focus:border-[#0d7892] focus:ring-4 focus:ring-[#0d7892]/10" /></label>}
                <label className="block text-xs font-bold uppercase tracking-wider text-[#527e8e]">Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#afd6e1] bg-white px-4 py-3 text-sm font-medium normal-case tracking-normal text-[#173f52] outline-none focus:border-[#0d7892] focus:ring-4 focus:ring-[#0d7892]/10" /></label>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#527e8e]">Password<input type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={authMode === "register" ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#afd6e1] bg-white px-4 py-3 text-sm font-medium normal-case tracking-normal text-[#173f52] outline-none focus:border-[#0d7892] focus:ring-4 focus:ring-[#0d7892]/10" /></label>
                {error && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">{error}</p>}
                {notice && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">{notice}</p>}
                <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123e50] px-4 py-3 font-bold text-white transition hover:bg-[#1c5b70] disabled:opacity-60">{busy ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />} {authMode === "login" ? "Sign in to scanner" : "Request scanner access"}</button>
            </form>
            <button type="button" onClick={() => { setAuthMode((mode) => mode === "login" ? "register" : "login"); setError(""); setNotice(""); }} className="mt-4 w-full text-center text-xs font-bold text-[#0d7892] underline underline-offset-4">{authMode === "login" ? "New volunteer? Request access" : "Already requested access? Sign in"}</button>
            <p className="mt-5 text-center text-[11px] text-[#688b96]">Scanner access only · Payment and stage settings are not available here.</p>
        </section>
    </main>;

    return <main className="min-h-svh bg-[radial-gradient(ellipse_at_top,#15556a,#082b3a_72%)] px-4 py-5 text-[#133747] sm:px-6 sm:py-8">
        <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/50 bg-[#e5f5f8] shadow-2xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#b6dce4] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#123e50] text-[#f1d88e]"><Ticket size={22} /></span><div><p className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#527e8e]">Renaissance entry gate</p><h1 className="font-cinzel text-xl font-black text-[#173f52]">Volunteer scanner</h1></div></div>
                <button type="button" disabled={busy} onClick={logout} className="flex items-center gap-2 rounded-xl border border-[#b6dce4] bg-white px-3 py-2 text-xs font-bold text-[#376579] hover:bg-slate-50"><LogOut size={15} /> Sign out</button>
            </header>
            <div className="p-5 sm:p-7">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><ShieldCheck size={18} className="mt-0.5 shrink-0" /><p>Signed in as <strong>{email}</strong>. This page only checks in verified ticket holders.</p></div>
                {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">{error}</p>}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#527e8e]">Pass type<select value={passType} onChange={(event) => { setPassType(event.target.value); setStageId((configs[event.target.value] || [])[0]?.stageId || ""); setResult(null); }} className="mt-2 w-full rounded-xl border border-[#afd6e1] bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-[#173f52]">{PASS_TYPES.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#527e8e]">Event stage<select value={stageId} onChange={(event) => { setStageId(event.target.value); setResult(null); }} disabled={!stages.length} className="mt-2 w-full rounded-xl border border-[#afd6e1] bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-[#173f52]">{stages.map((stage, index) => <option key={stage.stageId} value={stage.stageId}>{index + 1}. {stage.name}</option>)}</select></label>
                </div>
                {!stages.length && <p className="mt-3 text-sm font-semibold text-amber-800">No stages are configured for this pass. Ask an admin to add stages.</p>}
                {cameraOn ? <div className="mt-5"><CameraReader onDecoded={scan} onError={cameraError} /><button type="button" onClick={() => setCameraOn(false)} className="mt-3 w-full rounded-xl border border-[#b6dce4] bg-white px-4 py-2 text-sm font-bold text-[#376579]">Stop camera</button></div> : <button type="button" disabled={!stageId || scanBusy} onClick={() => { setError(""); setCameraOn(true); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#123e50] px-4 py-4 font-bold text-white transition hover:bg-[#1c5b70] disabled:cursor-not-allowed disabled:opacity-50"><Camera size={19} /> Scan ticket QR</button>}
                {result && <div role={result.error ? "alert" : "status"} className={`mt-5 rounded-2xl border p-4 ${result.error ? "border-rose-300 bg-rose-50 text-rose-900" : result.alreadyScanned ? "border-amber-300 bg-amber-100 text-amber-950" : "border-emerald-300 bg-emerald-50 text-emerald-950"}`}>
                    <div className="flex items-center gap-2 font-black">{result.error ? <XCircle size={21} /> : result.alreadyScanned ? <Ticket size={21} /> : <CheckCircle2 size={21} />}{result.error ? (result.error.toLowerCase().includes("not eligible") ? "Not eligible for this stage" : "Scan blocked") : result.alreadyScanned ? `Already scanned · ${result.selectedStage}` : `Admitted · ${result.selectedStage}`}</div>
                    {result.error ? <p className="mt-2 text-sm">{result.error}</p> : <><p className="mt-2 font-cinzel text-lg font-black">{result.ticket?.name}{result.ticket?.teamName ? ` · Team: ${result.ticket.teamName}` : ""}</p><p className="font-mono text-xs">{result.ticket?.ticketId}{result.ticket?.ticketType ? ` · ${PASS_NAMES[result.ticket.ticketType] || result.ticket.ticketType}` : ""}{result.ticket?.tshirtSize ? ` · Size: ${result.ticket.tshirtSize}` : ""}</p><ScanHistory scans={result.ticket?.stageScans} stages={configs[result.ticket?.ticketType] || []} /></>}
                </div>}
                <p className="mt-5 text-center text-xs text-[#688b96]">Yellow means this ticket has already been scanned at that stage. Each pass type has its own stage list.</p>
            </div>
        </section>
    </main>;
}
