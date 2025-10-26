import { auth, db } from './firebase-config.js';
import {
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.25.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot
} from "https://www.gstatic.com/firebasejs/9.25.0/firebase-firestore.js";

const newBtn = document.getElementById('newGameBtn');
const inviteBtn = document.getElementById('inviteBtn');
const logBox = document.getElementById('log');
const boards = document.getElementById('boards');
let roomId = null;
let user = null;

// Utility
const log = msg => logBox.innerHTML += `<div>${new Date().toLocaleTimeString()} ${msg}</div>`;

// Auth completion for email-link
window.addEventListener('load', async () => {
  const url = window.location.href;
  if (isSignInWithEmailLink(auth, url)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) email = prompt('Please confirm your email for sign-in:');
    try {
      await signInWithEmailLink(auth, email, url);
      window.localStorage.removeItem('emailForSignIn');
      log('Signed in successfully.');
    } catch (e) { log('Sign-in error: ' + e.message); }
  }
});

onAuthStateChanged(auth, async (u) => {
  user = u;
  if (user) {
    log(`Signed in as ${user.email}`);
    const params = new URLSearchParams(window.location.search);
    const r = params.get('room');
    if (r) joinRoom(r);
  } else {
    log('Not signed in.');
  }
});

async function createRoom() {
  const id = Math.random().toString(36).substring(2,9);
  await setDoc(doc(db, 'rooms', id), {
    hostUid: auth.currentUser.uid,
    players: [auth.currentUser.uid],
    moves: [],
    createdAt: Date.now(),
    currentTurnUid: auth.currentUser.uid
  });
  roomId = id;
  window.history.replaceState({}, '', `?room=${id}`);
  log(`Room created: ${id}`);
  return id;
}

async function joinRoom(id) {
  roomId = id;
  const ref = doc(db, 'rooms', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) { log('Room not found.'); return; }
  const data = snap.data();
  if (!data.players.includes(auth.currentUser.uid)) {
    await updateDoc(ref, { players: arrayUnion(auth.currentUser.uid) });
  }
  listenRoom(id);
  boards.classList.remove('hidden');
  log(`Joined room ${id}`);
}

function listenRoom(id) {
  const ref = doc(db, 'rooms', id);
  onSnapshot(ref, (snap) => {
    const d = snap.data();
    if (d) {
      log(`Players: ${d.players.length} | Moves: ${d.moves.length}`);
    }
  });
}

function sendInvite() {
  if (!roomId) { log('Create a room first.'); return; }
  const email = prompt('Enter guest email:');
  if (!email) return;
  const actionCodeSettings = {
    url: `https://YOURUSERNAME.github.io/YOUR-REPO/?room=${roomId}`,
    handleCodeInApp: true
  };
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
      log('Invite link sent!');
    })
    .catch(e => log('Error: ' + e.message));
}

newBtn.onclick = async () => {
  if (!auth.currentUser) {
    alert('Please sign in first via email invite link.');
    return;
  }
  await createRoom();
};

inviteBtn.onclick = sendInvite;
