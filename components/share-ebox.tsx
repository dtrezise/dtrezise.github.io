"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Destination = "x" | "bluesky" | "facebook" | "linkedin" | "email";

const destinations: Array<{ id: Destination; label: string; mark: string }> = [
  { id: "x", label: "X", mark: "X" },
  { id: "bluesky", label: "Bluesky", mark: "B" },
  { id: "facebook", label: "Facebook", mark: "f" },
  { id: "linkedin", label: "LinkedIn", mark: "in" },
  { id: "email", label: "Email", mark: "@" },
];

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function clip(value: string, max: number) {
  const normalized = clean(value);
  return normalized.length <= max ? normalized : `${normalized.slice(0, max - 1).trim()}…`;
}

function compose(destination: Destination, title: string, status: string, context: string, summary: string, url: string) {
  if (destination === "x") return `${clip(title, 95)}\n\n${clip(summary, 112)}\n\nEvidence, tests & sources: ${url}`;
  if (destination === "bluesky") return `${clip(title, 105)}\n\n${clip(summary, 130)}\n\nOpen the evidence: ${url}`;
  if (destination === "email") return `${title}\n\nStatus: ${status}\nContext: ${context}\n\n${summary}\n\nReview the complete evidence record, test breakdowns, sources, and limiting context:\n${url}`;
  return `${title}\n\n${summary}\n\nStatus: ${status}\nContext: ${context}\n\nReview the complete evidence object, its sources, test breakdowns, and limiting context:\n${url}`;
}

export function ShareEBox({ slug, title, status, context, summary }: { slug: string; title: string; status: string; context: string; summary: string }) {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState<Destination>("bluesky");
  const [post, setPost] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const payload = useMemo(() => ({ title, status, context, summary: clean(summary), url }), [title, status, context, summary, url]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], textarea, [tabindex]:not([tabindex="-1"])')).filter((node) => !node.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  function openComposer() {
    const exactUrl = `${window.location.origin}/evidence/${slug}/`;
    setUrl(exactUrl);
    setDestination("bluesky");
    setPost(compose("bluesky", title, status, context, summary, exactUrl));
    setMessage("");
    setOpen(true);
  }

  function selectDestination(next: Destination) {
    setDestination(next);
    setPost(compose(next, payload.title, payload.status, payload.context, payload.summary, payload.url));
    setMessage("");
  }

  async function copy(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(success);
      return true;
    } catch {
      setMessage("Copy was unavailable. Select the text manually.");
      return false;
    }
  }

  async function continueToDestination() {
    const encodedPost = encodeURIComponent(post);
    const encodedUrl = encodeURIComponent(url);
    let outgoing = "";
    if (destination === "x") outgoing = `https://twitter.com/intent/tweet?text=${encodedPost}`;
    if (destination === "bluesky") outgoing = `https://bsky.app/intent/compose?text=${encodedPost}`;
    if (destination === "facebook") outgoing = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (destination === "linkedin") outgoing = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    if (destination === "email") outgoing = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedPost}`;

    if (destination === "facebook" || destination === "linkedin") {
      await copy(post, "Commentary copied. Paste it into the platform share window.");
    }
    if (destination === "email") window.location.href = outgoing;
    else window.open(outgoing, "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copy(post, "Post copied; native sharing is unavailable here.");
      return;
    }
    try {
      await navigator.share({ title, text: post, url });
      setMessage("Device share sheet opened.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Native sharing was unavailable.");
    }
  }

  return (
    <>
      <button ref={triggerRef} className="share-trigger" type="button" onClick={openComposer} aria-haspopup="dialog">
        <span aria-hidden="true">↗</span> Share evidence
      </button>
      {open ? (
        <div className="share-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={dialogRef} className="share-dialog" role="dialog" aria-modal="true" aria-labelledby={`share-heading-${slug}`}>
            <div className="share-dialog__header">
              <div><span className="kicker">Share composer</span><h2 id={`share-heading-${slug}`}>Share in context.</h2></div>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close share composer">×</button>
            </div>
            <div className="share-banner" aria-label="Branded social banner preview">
              <span className="share-banner__brand">TRUMP’S KAMPF</span>
              <span className="share-banner__label">EVIDENCE / {context.toUpperCase()}</span>
              <strong>{title}</strong>
              <em>{status}</em>
              <small>{url}</small>
            </div>
            <div className="destination-row" aria-label="Choose a share destination">
              {destinations.map((item) => (
                <button key={item.id} type="button" className={destination === item.id ? "is-selected" : ""} aria-pressed={destination === item.id} onClick={() => selectDestination(item.id)} title={item.label}>
                  <span aria-hidden="true">{item.mark}</span><span className="sr-only">Format for {item.label}</span>
                </button>
              ))}
            </div>
            <label className="post-copy" htmlFor={`post-${slug}`}>
              <span>Editable post copy</span>
              <textarea id={`post-${slug}`} value={post} onChange={(event) => setPost(event.target.value)} rows={5} />
            </label>
            <div className="share-actions">
              <button className="button button--primary" type="button" onClick={continueToDestination}>Continue to {destinations.find((item) => item.id === destination)?.label}</button>
              <button type="button" onClick={() => copy(post, "Post copied.")}>Copy Post</button>
              <button type="button" onClick={() => copy(url, "Exact evidence link copied.")}>Copy Link</button>
              <button type="button" onClick={nativeShare}>Device share</button>
            </div>
            <p className="share-explainer">Facebook and LinkedIn copy your note before opening the share window.</p>
            <p className="share-status" aria-live="polite">{message}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
