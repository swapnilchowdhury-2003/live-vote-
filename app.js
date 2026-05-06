// ============================================================
// app.js — Bangladesh Election Live Dashboard
// Shared logic for index.html (Live View) and admin.html
// All data stored in localStorage, synced via storage events
// ============================================================

const STORAGE_KEY = "bd_election_data";

// ─── Default Data ────────────────────────────────────────────
const DEFAULT_DATA = {
  parties: {
    "আওয়ামী লীগ": "#00A550",
    "বিএনপি": "#2060C8",
    "জাতীয় পার্টি": "#E8A020",
    "জামায়াত": "#8B0000",
    "স্বতন্ত্র": "#888888"
  },
  constituencies: {
    "dhaka-1": { name: "ঢাকা-১", division: "ঢাকা", candidates: [{ name: "রাহেলা বেগম", party: "আওয়ামী লীগ", votes: 54200 }, { name: "মাহবুব আলম", party: "বিএনপি", votes: 48900 }, { name: "জসিম উদ্দিন", party: "জাতীয় পার্টি", votes: 8200 }] },
    "dhaka-2": { name: "ঢাকা-২", division: "ঢাকা", candidates: [{ name: "করিম সাহেব", party: "বিএনপি", votes: 61000 }, { name: "নাসিমা খানম", party: "আওয়ামী লীগ", votes: 55400 }] },
    "dhaka-3": { name: "ঢাকা-৩", division: "ঢাকা", candidates: [{ name: "তানভীর হোসেন", party: "আওয়ামী লীগ", votes: 72000 }, { name: "শাহীন মিয়া", party: "বিএনপি", votes: 59000 }] },
    "dhaka-4": { name: "ঢাকা-৪", division: "ঢাকা", candidates: [{ name: "ফারহান আহমেদ", party: "জাতীয় পার্টি", votes: 44000 }, { name: "সালমা বেগম", party: "আওয়ামী লীগ", votes: 43500 }] },
    "dhaka-5": { name: "ঢাকা-৫", division: "ঢাকা", candidates: [{ name: "রিয়া রানী", party: "আওয়ামী লীগ", votes: 58000 }, { name: "মনির উদ্দিন", party: "বিএনপি", votes: 53000 }] },
    "chittagong-1": { name: "চট্টগ্রাম-১", division: "চট্টগ্রাম", candidates: [{ name: "আমির হোসেন", party: "বিএনপি", votes: 67000 }, { name: "লায়লা আক্তার", party: "আওয়ামী লীগ", votes: 60000 }] },
    "chittagong-2": { name: "চট্টগ্রাম-২", division: "চট্টগ্রাম", candidates: [{ name: "জহির রায়হান", party: "আওয়ামী লীগ", votes: 75000 }, { name: "নূর আলম", party: "জামায়াত", votes: 55000 }] },
    "chittagong-3": { name: "চট্টগ্রাম-৩", division: "চট্টগ্রাম", candidates: [{ name: "বিথী দাস", party: "আওয়ামী লীগ", votes: 51000 }, { name: "ইমরান সরকার", party: "বিএনপি", votes: 49500 }] },
    "sylhet-1": { name: "সিলেট-১", division: "সিলেট", candidates: [{ name: "শফিকুল ইসলাম", party: "আওয়ামী লীগ", votes: 63000 }, { name: "মিতা চৌধুরী", party: "বিএনপি", votes: 57000 }] },
    "sylhet-2": { name: "সিলেট-২", division: "সিলেট", candidates: [{ name: "রাজিব আহমেদ", party: "জাতীয় পার্টি", votes: 46000 }, { name: "শিপ্রা দেবী", party: "আওয়ামী লীগ", votes: 44000 }] },
    "rajshahi-1": { name: "রাজশাহী-১", division: "রাজশাহী", candidates: [{ name: "মোস্তফা কামাল", party: "বিএনপি", votes: 70000 }, { name: "আলেয়া বেগম", party: "আওয়ামী লীগ", votes: 62000 }] },
    "rajshahi-2": { name: "রাজশাহী-২", division: "রাজশাহী", candidates: [{ name: "সোনিয়া আক্তার", party: "আওয়ামী লীগ", votes: 53000 }, { name: "নজরুল ইসলাম", party: "বিএনপি", votes: 51000 }] },
    "khulna-1": { name: "খুলনা-১", division: "খুলনা", candidates: [{ name: "পলাশ মণ্ডল", party: "আওয়ামী লীগ", votes: 49000 }, { name: "সুমাইয়া হাসান", party: "বিএনপি", votes: 47000 }] },
    "khulna-2": { name: "খুলনা-২", division: "খুলনা", candidates: [{ name: "দীপু মনি", party: "আওয়ামী লীগ", votes: 58000 }, { name: "সাইফুল বাহার", party: "জামায়াত", votes: 42000 }] },
    "barisal-1": { name: "বরিশাল-১", division: "বরিশাল", candidates: [{ name: "তমাল রায়", party: "আওয়ামী লীগ", votes: 47000 }, { name: "নূরজাহান খানম", party: "বিএনপি", votes: 45000 }] },
    "rangpur-1": { name: "রংপুর-১", division: "রংপুর", candidates: [{ name: "আবদুল করিম", party: "জাতীয় পার্টি", votes: 55000 }, { name: "মরিয়ম বিবি", party: "আওয়ামী লীগ", votes: 50000 }] },
    "mymensingh-1": { name: "ময়মনসিংহ-১", division: "ময়মনসিংহ", candidates: [{ name: "ইমান আলী", party: "আওয়ামী লীগ", votes: 61000 }, { name: "রাবেয়া সুলতানা", party: "বিএনপি", votes: 55000 }] },
    "comilla-1": { name: "কুমিল্লা-১", division: "চট্টগ্রাম", candidates: [{ name: "হাসান ইমাম", party: "বিএনপি", votes: 64000 }, { name: "পারুল বেগম", party: "আওয়ামী লীগ", votes: 61000 }] },
    "noakhali-1": { name: "নোয়াখালী-১", division: "চট্টগ্রাম", candidates: [{ name: "সোহাগ মিয়া", party: "আওয়ামী লীগ", votes: 59000 }, { name: "ফরিদা ইয়াসমিন", party: "বিএনপি", votes: 54000 }] },
    "jessore-1": { name: "যশোর-১", division: "খুলনা", candidates: [{ name: "অর্পণ চন্দ্র", party: "স্বতন্ত্র", votes: 52000 }, { name: "মেহেদী হাসান", party: "আওয়ামী লীগ", votes: 49000 }] }
  }
};

// ─── Storage Helpers ─────────────────────────────────────────
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function initData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
  }
}

// ─── Business Logic ──────────────────────────────────────────
function getLeader(constituency) {
  if (!constituency.candidates || constituency.candidates.length === 0) return null;
  return [...constituency.candidates].sort((a, b) => b.votes - a.votes)[0];
}

function getTop2(constituency) {
  if (!constituency.candidates) return [];
  return [...constituency.candidates].sort((a, b) => b.votes - a.votes).slice(0, 2);
}

function getVoteDiff(constituency) {
  const top2 = getTop2(constituency);
  if (top2.length < 2) return 0;
  return top2[0].votes - top2[1].votes;
}

function getTotalVotes(constituency) {
  if (!constituency.candidates) return 0;
  return constituency.candidates.reduce((s, c) => s + (c.votes || 0), 0);
}

// Seat count per party
function getSeatCount(data) {
  const seats = {};
  Object.values(data.constituencies).forEach(c => {
    const leader = getLeader(c);
    if (leader) {
      seats[leader.party] = (seats[leader.party] || 0) + 1;
    }
  });
  return seats;
}

// ─── Bengali number helper ────────────────────────────────────
function toBengaliNum(n) {
  return String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

function formatVotes(n) {
  return toBengaliNum(Number(n).toLocaleString("en-IN"));
}

// Expose to window for both pages
window.ElectionApp = {
  loadData, saveData, initData,
  getLeader, getTop2, getVoteDiff, getTotalVotes, getSeatCount,
  formatVotes, toBengaliNum, DEFAULT_DATA, STORAGE_KEY
};
