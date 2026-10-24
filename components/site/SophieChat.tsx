import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AV } from '../../content/avatars';

// ══════════════════════════════════════════════════════════════════
// Sophie Chat — porte verbatim depuis `_contenu-source/sophie_chat.js`
// (ressource `b41ed13f-…` du bundle en ligne du 17/09/2026).
//
// Tiroir en bas a droite, extensible en plein ecran. Dialogue avec
// /api/public/concierge/talk sur la meme origine (sans authentification).
// Le session_uuid est memorise dans localStorage pour reprendre la
// conversation apres un rechargement.
//
// C'est la base de la boite adaptative du brief (partie A.1) : a faire
// evoluer, pas a reecrire. Evolution (vitrines, 2026) : le tiroir ecoute
// l'evenement `dh:sophie` emis par la ligne Sophie des boites adaptatives
// (components/vitrine/BoiteSophie.tsx) — il s'ouvre et envoie la question
// recue ; `lanceur={false}` masque le bouton flottant (accueil). Sans prop,
// le rendu est inchange (pages legales).
// ══════════════════════════════════════════════════════════════════

const API_TALK = '/api/public/concierge/talk';
const API_HISTORY = (uuid) => `/api/public/concierge/history/${uuid}`;
const SESSION_KEY = 'dh-sophie-session';

function getSessionUuid() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    // RFC 4122 v4 — crypto.randomUUID is widely supported, fall back if absent
    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random()*16|0;
          return (c==='x' ? r : (r&0x3|0x8)).toString(16);
        });
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const SophieChat: React.FC<{ lanceur?: boolean }> = ({ lanceur = true }) => {
    const { language: lang } = useLanguage();

    const [open, setOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const sessionUuid = useRef(null);
    const historique = useRef(false);
    const scrollRef = useRef(null);

    const t = lang === 'en' ? {
      cta: 'Talk to Sophie',
      placeholder: 'Type a message…',
      send: 'Send',
      thinking: 'Sophie is thinking…',
      title: 'Sophie',
      subtitle: 'Virtual assistant — artificial intelligence · Digital·Humans Studio',
      disclaimer: 'Sophie is AI and can make mistakes. Please double-check responses.',
      welcome: "Hi! I'm Sophie. I orchestrate the eleven agents. What brings you here today?",
      error: 'Something went wrong. Please try again.',
      expand: 'Expand',
      shrink: 'Collapse',
      close: 'Close',
    } : {
      cta: 'Parler à Sophie',
      placeholder: 'Tape un message…',
      send: 'Envoyer',
      thinking: 'Sophie réfléchit…',
      title: 'Sophie',
      subtitle: 'Assistante virtuelle — intelligence artificielle · Digital·Humans Studio',
      disclaimer: 'Sophie est une IA et peut se tromper. Vérifiez ses réponses.',
      welcome: "Bonjour ! Je suis Sophie, l'orchestratrice du studio. Qu'est-ce qui vous amène ?",
      error: "Désolée, j'ai eu un souci. Réessaie ?",
      expand: 'Agrandir',
      shrink: 'Réduire',
      close: 'Fermer',
    };

    // Initialize session UUID + load history when widget opens for the first time.
    useEffect(() => {
      if (!open) return;
      if (!historique.current) {
        historique.current = true;
        if (!sessionUuid.current) sessionUuid.current = getSessionUuid();
        // Fetch any existing history (silent fail if endpoint hiccups)
        fetch(API_HISTORY(sessionUuid.current))
          .then(r => r.ok ? r.json() : [])
          .then(turns => {
            // `prev` : une question envoyee par une boite adaptative pendant le
            // chargement de l'historique reste a la suite.
            if (Array.isArray(turns) && turns.length > 0) {
              setMessages(prev => turns.map(t => ({role: t.role, content: t.message})).concat(prev));
            } else {
              setMessages(prev => [{role: 'assistant', content: t.welcome}].concat(prev));
            }
          })
          .catch(() => {
            setMessages(prev => [{role: 'assistant', content: t.welcome}].concat(prev));
          });
      }
    }, [open]);

    // Question envoyee par une boite adaptative : ouvrir, puis envoyer si non vide.
    const envoyerRef = useRef(sendMessage);
    envoyerRef.current = sendMessage;
    useEffect(() => {
      const recevoir = (e: Event) => {
        const texte = ((e as CustomEvent).detail?.texte || '').trim();
        setOpen(true);
        if (texte) envoyerRef.current(texte);
      };
      window.addEventListener('dh:sophie', recevoir);
      return () => window.removeEventListener('dh:sophie', recevoir);
    }, []);

    // Auto-scroll to bottom on new message.
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages, sending]);

    // Une question recue pendant qu'une reponse est attendue n'est jamais jetee :
    // elle est affichee tout de suite et mise en file, puis envoyee apres la
    // reponse en cours (avant : `if (sending) return;` l'avalait en silence —
    // revue independante du 24/10, reprise 1). Refs, pas d'etat : l'appel peut
    // venir d'un ecouteur d'evenement dont la fermeture voit un `sending` perime.
    const enCours = useRef(false);
    const file = useRef<string[]>([]);

    async function transmettre(text: string) {
      enCours.current = true;
      setSending(true);
      try {
        const res = await fetch(API_TALK, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            session_uuid: sessionUuid.current,
            message: text,
            visitor_language: lang,
          }),
        });
        if (!res.ok) throw new Error('http ' + res.status);
        const data = await res.json();
        setMessages(prev => [...prev, {role: 'assistant', content: data.reply, next_action: data.next_action}]);
      } catch (e) {
        setError(t.error);
      } finally {
        const suivante = file.current.shift();
        if (suivante !== undefined) transmettre(suivante);
        else { enCours.current = false; setSending(false); }
      }
    }

    function sendMessage(direct?: string) {
      const text = (direct !== undefined ? direct : input).trim();
      if (!text) return;
      if (!sessionUuid.current) sessionUuid.current = getSessionUuid();
      setError(null);
      setMessages(prev => [...prev, {role: 'user', content: text}]);
      if (direct === undefined) setInput('');
      if (enCours.current) { file.current.push(text); return; }
      transmettre(text);
    }

    function handleKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }

    return (
      <>
        {/* Floating launcher button — bottom-right, hidden when drawer open */}
        {lanceur && !open && (
          <button
            className="sophie-launcher"
            onClick={() => setOpen(true)}
            aria-label={t.cta}
          >
            <span className="sophie-launcher-dot"></span>
            <span>{t.cta}</span>
            <span className="ar">→</span>
          </button>
        )}

        {/* Drawer / fullscreen panel */}
        {open && (
          <div className={`sophie-drawer ${fullscreen ? 'sophie-drawer--full' : ''}`}>
            <div className="sophie-drawer-head">
              <div className="sophie-head-left">
                <img src={AV('sophie')} alt="" className="sophie-head-avatar"/>
                <div>
                  <div className="sophie-head-title">{t.title}</div>
                  <div className="sophie-head-subtitle">{t.subtitle}</div>
                </div>
              </div>
              <div className="sophie-head-actions">
                <button onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? t.shrink : t.expand} className="sophie-head-btn">
                  {fullscreen ? '⤡' : '⤢'}
                </button>
                <button onClick={() => setOpen(false)} aria-label={t.close} className="sophie-head-btn">×</button>
              </div>
            </div>

            <div ref={scrollRef} className="sophie-drawer-body">
              {messages.map((m, i) => (
                <div key={i} className={`sophie-msg sophie-msg--${m.role}`}>
                  <div className="sophie-msg-bubble">{m.content}</div>
                </div>
              ))}
              {sending && (
                <div className="sophie-msg sophie-msg--assistant">
                  <div className="sophie-msg-bubble sophie-msg-bubble--thinking">{t.thinking}</div>
                </div>
              )}
              {error && (
                <div className="sophie-msg sophie-msg--assistant">
                  <div className="sophie-msg-bubble sophie-msg-bubble--error">{error}</div>
                </div>
              )}
            </div>

            <div className="sophie-disclaimer">{t.disclaimer}</div>

            <div className="sophie-drawer-input">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={t.placeholder}
                rows={1}
                disabled={sending}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || sending} className="sophie-send-btn">
                {t.send} →
              </button>
            </div>
          </div>
        )}
      </>
    );
};

export default SophieChat;
