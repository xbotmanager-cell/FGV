import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, onSnapshot, query, where, orderBy, limit, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');

let firestoreDatabaseId = '(default)';
let config = {};
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    firestoreDatabaseId = config.firestoreDatabaseId || '(default)';
}

const app = initializeApp(config);
const realDb = getFirestore(app, firestoreDatabaseId);

class DocProxy {
    constructor(path) { this.path = path; this.ref = doc(realDb, path); }
    async get() {
        const snapshot = await getDoc(this.ref);
        return { id: snapshot.id, exists: snapshot.exists(), data: () => snapshot.data() };
    }
    async set(data, options) { return setDoc(this.ref, data, options); }
    async update(data) { return updateDoc(this.ref, data); }
    async delete() { return deleteDoc(this.ref); }
    onSnapshot(callback) {
        return onSnapshot(this.ref, (snapshot) => {
            callback({ id: snapshot.id, exists: snapshot.exists(), data: () => snapshot.data() });
        });
    }
}

class QueryProxy {
    constructor(collectionPath, constraints = []) {
        this.collectionPath = collectionPath;
        this.constraints = constraints;
    }
    where(field, op, val) { return new QueryProxy(this.collectionPath, [...this.constraints, where(field, op, val)]); }
    orderBy(field, dir) { return new QueryProxy(this.collectionPath, [...this.constraints, orderBy(field, dir)]); }
    limit(n) { return new QueryProxy(this.collectionPath, [...this.constraints, limit(n)]); }
    async get() {
        const q = query(collection(realDb, this.collectionPath), ...this.constraints);
        const snapshot = await getDocs(q);
        return { empty: snapshot.empty, size: snapshot.size, docs: snapshot.docs.map(d => ({ id: d.id, exists: d.exists(), data: () => d.data() })) };
    }
    onSnapshot(callback) {
        const q = query(collection(realDb, this.collectionPath), ...this.constraints);
        return onSnapshot(q, (snapshot) => {
            callback({ empty: snapshot.empty, size: snapshot.size, docs: snapshot.docs.map(d => ({ id: d.id, exists: d.exists(), data: () => d.data() })) });
        });
    }
    doc(id) { return new DocProxy(`${this.collectionPath}/${id}`); }
    async add(data) {
        const ref = await addDoc(collection(realDb, this.collectionPath), data);
        return { id: ref.id };
    }
}

const db = {
    collection: (name) => new QueryProxy(name),
    batch: () => writeBatch(realDb)
};

export { db };
